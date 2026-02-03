"""
Neural Speak - Text-to-Speech Backend Service
==============================================

This module implements a serverless TTS (Text-to-Speech) API using Modal for GPU-accelerated
inference. It leverages the Chatterbox Multilingual TTS model to generate high-quality,
natural-sounding speech from text input.

Architecture:
    - Deployed on Modal's serverless GPU infrastructure (L40S)
    - Uses S3 cloud storage for audio file persistence
    - Supports voice cloning via audio prompts
    - Provides a FastAPI endpoint with proxy authentication

Features:
    - 24+ language support via Chatterbox multilingual model
    - Voice cloning from 30-second audio samples
    - Configurable emotional expression (exaggeration parameter)
    - Adjustable speech pacing (cfg_weight parameter)
    - High-fidelity WAV output at model's native sample rate

Dependencies:
    - Modal: Serverless GPU compute platform
    - PyTorch & Torchaudio: Deep learning and audio processing
    - Chatterbox: Multilingual TTS model
    - Pydantic: Request/response validation

Author: Neural Speak Team
Version: 1.0.0
"""

import io
import os
import sys
from typing import Optional
import uuid

import modal
from pydantic import BaseModel
import torch 
import torchaudio

# =============================================================================
# MODAL APPLICATION CONFIGURATION
# =============================================================================

# Initialize Modal application with unique identifier
app = modal.App("neural-speak-sufjan")

# Define the container image with all required dependencies
# Uses Debian slim for minimal footprint with Python 3.11
image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install("numpy==1.26.0", "torch==2.6.0")
    .pip_install_from_requirements("requirements.txt")
    .apt_install("ffmpeg")  # Required for audio format conversion
)

# Persistent volume for caching Hugging Face model weights
# Reduces cold start time by preserving downloaded models between invocations
volume = modal.Volume.from_name("hf-cache-neural-speak", create_if_missing=True)

# AWS S3 credentials for audio file storage
s3_secret = modal.Secret.from_name("neural-speak-aws-secret")


# =============================================================================
# REQUEST/RESPONSE MODELS
# =============================================================================

class TextToSpeechRequest(BaseModel):
    """
    Pydantic model for TTS generation requests.
    
    Attributes:
        text: The input text to convert to speech. Supports up to 5000 characters.
        voice_s3_key: Optional S3 key pointing to a voice sample for cloning.
                      If not provided, uses the default model voice.
        language: ISO 639-1 language code (e.g., 'en', 'es', 'ja').
                  Defaults to English.
        exaggeration: Controls emotional intensity of speech (0.0 to 1.0).
                      Higher values produce more expressive output.
        cfg_weight: Classifier-free guidance weight affecting speech pacing.
                    Lower values = faster speech, higher = more deliberate.
    """
    text: str
    voice_s3_key: Optional[str] = None
    language: str = "en"
    exaggeration: float = 0.5
    cfg_weight: float = 0.5


class TextToSpeechResponse(BaseModel):
    """
    Pydantic model for TTS generation responses.
    
    Attributes:
        s3_Key: The S3 object key where the generated audio file is stored.
                Format: 'tts/{uuid}.wav'
    """
    s3_Key: str


# =============================================================================
# TTS SERVER CLASS
# =============================================================================

@app.cls(
    image=image,
    gpu="L40S",  # NVIDIA L40S GPU for fast inference
    volumes={
        "/root/.cache/huppingface": volume,  # Model cache mount
        "/s3-mount": modal.CloudBucketMount("neural-speak-sufjan", secret=s3_secret)
    },
    scaledown_window=120,  # Keep warm for 2 minutes after last request
    secrets=[s3_secret]
)
class TextToSpeechServer:
    """
    Serverless TTS generation service powered by Chatterbox multilingual model.
    
    This class is decorated with Modal's @app.cls to enable GPU-accelerated,
    auto-scaling inference. The model is loaded once on container startup
    and persists across multiple requests.
    
    Methods:
        load_model: Lifecycle hook that initializes the TTS model on startup.
        generate_speech: FastAPI endpoint that processes TTS requests.
    """
    
    @modal.enter()
    def load_model(self) -> None:
        """
        Initialize the Chatterbox multilingual TTS model.
        
        This method is called automatically when the Modal container starts.
        It loads the pre-trained model weights onto the GPU for inference.
        The model is stored as an instance attribute for reuse across requests.
        """
        from chatterbox.mtl_tts import ChatterboxMultilingualTTS
        self.model = ChatterboxMultilingualTTS.from_pretrained(device="cuda")

    @modal.fastapi_endpoint(method="POST", requires_proxy_auth=True)
    def generate_speech(self, request: TextToSpeechRequest) -> TextToSpeechResponse:
        """
        Generate speech audio from text input.
        
        This endpoint accepts text and optional voice cloning parameters,
        generates speech using the Chatterbox model, and stores the result
        in S3 for retrieval by the frontend.
        
        Args:
            request: TextToSpeechRequest containing text and generation parameters.
            
        Returns:
            TextToSpeechResponse with the S3 key of the generated audio file.
            
        Raises:
            FileNotFoundError: If the specified voice prompt file doesn't exist in S3.
        """
        # Generate speech with gradient computation disabled for inference efficiency
        with torch.no_grad():
            if request.voice_s3_key:
                # Voice cloning mode: use provided audio sample as voice reference
                audio_prompt_path = f"/s3-mount/{request.voice_s3_key}"

                if not os.path.exists(audio_prompt_path):
                    raise FileNotFoundError(
                        f"Prompt audio not found at {audio_prompt_path}")
                
                wav = self.model.generate(
                    request.text, 
                    audio_prompt_path=audio_prompt_path,
                    language_id=request.language,
                    exaggeration=request.exaggeration,
                    cfg_weight=request.cfg_weight
                )
            else:
                # Default voice mode: use model's built-in voice
                wav = self.model.generate(
                    request.text,
                    language_id=request.language,
                    exaggeration=request.exaggeration,
                    cfg_weight=request.cfg_weight
                )
            
            # Move tensor to CPU for file I/O operations
            wav_cpu = wav.cpu()
            
            # Trim trailing silence/artifacts from the audio
            wav_cpu = self._trim_trailing_silence(wav_cpu, self.model.sr)

        # Convert the audio tensor to WAV format bytes using an in-memory buffer
        buffer = io.BytesIO()
        torchaudio.save(buffer, wav_cpu, self.model.sr, format="wav")
        buffer.seek(0)  # Reset buffer position for reading
        audio_bytes = buffer.read()

        # Generate unique filename and construct S3 path
        audio_uuid = str(uuid.uuid4())  
        s3_key = f"tts/{audio_uuid}.wav"

        # Write audio file to S3 via mounted bucket
        s3_path = f"/s3-mount/{s3_key}" 
        os.makedirs(os.path.dirname(s3_path), exist_ok=True)
        with open(s3_path, "wb") as f:
            f.write(audio_bytes)
        
        print(f"Saved audio to S3: {s3_key}")
        return TextToSpeechResponse(s3_Key=s3_key)
    
    def _trim_trailing_silence(self, wav: torch.Tensor, sample_rate: int, 
                                threshold_db: float = -40.0, 
                                min_silence_ms: int = 150) -> torch.Tensor:
        """
        Trim trailing silence and artifacts from audio.
        
        Uses energy-based detection to find the end of meaningful audio content
        and trims excess silence while preserving a small natural tail.
        
        Args:
            wav: Audio tensor of shape (1, samples) or (samples,)
            sample_rate: Audio sample rate in Hz
            threshold_db: Energy threshold in dB below which audio is considered silence
            min_silence_ms: Minimum silence to preserve at end (ms) for natural decay
            
        Returns:
            Trimmed audio tensor
        """
        # Ensure 2D tensor
        if wav.dim() == 1:
            wav = wav.unsqueeze(0)
        
        # Convert threshold from dB to linear
        threshold = 10 ** (threshold_db / 20)
        
        # Calculate frame-level energy using a sliding window
        frame_length = int(sample_rate * 0.025)  # 25ms frames
        hop_length = int(sample_rate * 0.010)    # 10ms hop
        
        # Compute RMS energy for each frame
        audio = wav.squeeze()
        num_frames = (len(audio) - frame_length) // hop_length + 1
        
        if num_frames <= 0:
            return wav
        
        # Find the last frame with energy above threshold
        last_voiced_frame = 0
        for i in range(num_frames - 1, -1, -1):
            start = i * hop_length
            end = start + frame_length
            frame = audio[start:end]
            rms = torch.sqrt(torch.mean(frame ** 2)).item()
            
            if rms > threshold:
                last_voiced_frame = i
                break
        
        # Calculate trim point with a small buffer for natural decay
        min_silence_samples = int(sample_rate * min_silence_ms / 1000)
        trim_point = (last_voiced_frame + 1) * hop_length + frame_length + min_silence_samples
        trim_point = min(trim_point, len(audio))  # Don't exceed original length
        
        return wav[:, :trim_point]