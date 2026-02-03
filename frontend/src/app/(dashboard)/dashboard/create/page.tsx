/**
 * TTS Creation Page Component
 * ============================
 * 
 * The primary interface for text-to-speech generation. This page provides
 * a comprehensive UI for creating speech audio with customizable voice,
 * language, and expression parameters.
 * 
 * @module app/(dashboard)/dashboard/create/page
 * 
 * Features:
 * - Text input with character counting
 * - Voice selection (default voices + user-uploaded voices)
 * - 24 language support with flag indicators
 * - Emotional expression control (exaggeration slider)
 * - Speech pacing control (cfg_weight slider)
 * - Custom voice upload (max 10MB audio files)
 * - Real-time audio playback and download
 * - Generation history with recent audio projects
 * 
 * Component Architecture:
 * - SpeechSettings: Left panel with voice/language controls
 * - TextInput: Main text area with audio player
 * - AudioHistory: Recent generations grid below
 * 
 * State Management:
 * - Form state: text, selectedLanguage, selectedVoice, exaggeration, cfgWeight
 * - Loading states: isLoading, isGenerating, isUploadingVoice
 * - Audio state: generatedAudios, currentAudio, userUploadedVoices
 * 
 * @see {@link SpeechSettings} - Voice and language settings component
 * @see {@link TextInput} - Text input with audio player component
 * @see {@link AudioHistory} - Recent generations display component
 */
"use client";

import { RedirectToSignIn, SignedIn } from "@daveyplate/better-auth-ui";
import { Loader2 } from "lucide-react";
import { authClient } from "~/lib/auth-client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  generateSpeech as generateSpeechAction,
  getUserAudioProjects,
} from "~/actions/tts";
import { uploadVoice, getUserUploadedVoices } from "~/actions/voice-upload";
import { toast } from "sonner";
import type {
  GeneratedAudio,
  VoiceFile,
  Language,
  UploadedVoice,
} from "~/types/tts";
import SpeechSettings from "~/components/create/speech-settings";
import TextInput from "~/components/create/text-input";
import AudioHistory from '~/components/create/audio-history';

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Supported languages for TTS generation.
 * Each language includes an ISO code, display name, and flag emoji.
 * The Chatterbox multilingual model supports all listed languages.
 */
const LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
  { code: "da", name: "Danish", flag: "🇩🇰" },
  { code: "fi", name: "Finnish", flag: "🇫🇮" },
  { code: "no", name: "Norwegian", flag: "🇳🇴" },
  { code: "el", name: "Greek", flag: "🇬🇷" },
  { code: "he", name: "Hebrew", flag: "🇮🇱" },
  { code: "ms", name: "Malay", flag: "🇲🇾" },
  { code: "sw", name: "Swahili", flag: "🇰🇪" },
] as const;

/**
 * Default voice samples available to all users.
 * These are pre-loaded voices stored in S3 that don't require user upload.
 * Voice files should be clear, 10-30 second samples for best cloning results.
 * 
 * Note: s3_key paths must match the actual file locations in the S3 bucket.
 */
const VOICE_FILES: VoiceFile[] = [
  { name: "Conan (Male, Expressive)", s3_key: "samples/voices/network_conan.wav" },
  { name: "Sarah (Female, Friendly)", s3_key: "samples/voices/friendly-female.wav" },
  { name: "Stewie (Character Clone)", s3_key: "samples/voices/duff_stewie.wav" },
  { name: "French Speaker", s3_key: "samples/voices/french.wav" },
  { name: "Hindi Speaker", s3_key: "samples/voices/hindi.wav" },
  { name: "Japanese Speaker", s3_key: "samples/voices/japanese.wav" },
  { name: "Spanish Speaker", s3_key: "samples/voices/spanish.wav" },
] as const;

/** Maximum number of audio items to display in history */
const MAX_AUDIO_HISTORY = 20;

/** Maximum voice file size for uploads (10MB in bytes) */
const MAX_VOICE_FILE_SIZE = 10 * 1024 * 1024;

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * CreatePage - Main TTS generation interface.
 * 
 * This client component provides the primary interface for generating
 * text-to-speech audio. It manages form state, handles API calls,
 * and coordinates between child components.
 * 
 * @returns {JSX.Element} The TTS creation interface
 */
export default function CreatePage() {
  const router = useRouter();
  
  // ---------------------------------------------------------------------------
  // Loading States
  // ---------------------------------------------------------------------------
  
  /** Initial page load state */
  const [isLoading, setIsLoading] = useState(true);
  
  /** Speech generation in progress */
  const [isGenerating, setIsGenerating] = useState(false);
  
  /** Voice file upload in progress */
  const [isUploadingVoice, setIsUploadingVoice] = useState(false);
  
  // ---------------------------------------------------------------------------
  // Form State
  // ---------------------------------------------------------------------------
  
  /** Text content to convert to speech */
  const [text, setText] = useState("");
  
  /** Selected language ISO code */
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  
  /** Selected voice S3 key */
  const [selectedVoice, setSelectedVoice] = useState(
    VOICE_FILES[0]?.s3_key ?? "samples/voices/Michael.wav",
  );
  
  /** Emotional expression intensity (0.0 to 1.0) */
  const [exaggeration, setExaggeration] = useState(0.5);
  
  /** Speech pacing control (0.0 to 1.0) */
  const [cfgWeight, setCfgWeight] = useState(0.5);
  
  // ---------------------------------------------------------------------------
  // Audio State
  // ---------------------------------------------------------------------------
  
  /** Array of previously generated audio */
  const [generatedAudios, setGeneratedAudios] = useState<GeneratedAudio[]>([]);
  
  /** Currently playing/displayed audio */
  const [currentAudio, setCurrentAudio] = useState<GeneratedAudio | null>(null);
  
  /** User's uploaded custom voices */
  const [userUploadedVoices, setUserUploadedVoices] = useState<UploadedVoice[]>([]);
  
  /** Reference to audio element for playback control */
  const audioRef = useRef<HTMLAudioElement>(null);

  // ---------------------------------------------------------------------------
  // Data Fetching
  // ---------------------------------------------------------------------------

  /**
   * Fetch user's uploaded voice samples from the server.
   * Updates the userUploadedVoices state with the result.
   */
  const fetchUserUploadedVoices = async () => {
    const result = await getUserUploadedVoices();
    if (result.success) {
      setUserUploadedVoices(result.voices);
    }
  };

  /**
   * Initialize page data on component mount.
   * Fetches session, existing projects, and uploaded voices in parallel.
   */
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Parallel fetch for optimal loading time
        const [, projectsResult, voicesResult] = await Promise.all([
          authClient.getSession(),
          getUserAudioProjects(),
          getUserUploadedVoices(),
        ]);
        
        // Get user uploaded voices for voice name lookup
        const uploadedVoices = voicesResult.success ? voicesResult.voices : [];
        
        // Set user's uploaded voices for voice selection
        if (voicesResult.success) {
          setUserUploadedVoices(voicesResult.voices);
        }
        
        // Map existing projects to the GeneratedAudio format for history display
        if (projectsResult.success && projectsResult.audioProjects) {
          // Combine all voices for name lookup
          const allVoices = [
            ...uploadedVoices.map(v => ({ name: v.name, s3_key: v.s3Key })),
            ...VOICE_FILES
          ];
          
          const mappedProjects = projectsResult.audioProjects.map((project) => {
            // Find voice name from voiceS3key
            const voiceName = allVoices.find(v => v.s3_key === project.voiceS3key)?.name ?? "Custom Voice";
            
            return {
              s3_key: project.s3Key,
              audioUrl: project.audioUrl,
              text: project.text,
              language: project.language,
              timestamp: new Date(project.createdAt),
              voiceName: voiceName,
              exaggeration: project.exaggeration,
              cfgWeight: project.cfgWeight,
            };
          });
          setGeneratedAudios(mappedProjects);
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void initializeData();
  }, []);

  // ---------------------------------------------------------------------------
  // Event Handlers
  // ---------------------------------------------------------------------------

  /**
   * Generate TTS audio from the current text input.
   * Calls the server action and updates state with the result.
   */
  const generateSpeech = async () => {
    // Validate text input
    if (!text.trim()) {
      toast.error("Please enter some text!");
      return;
    }
    
    setIsGenerating(true);
    try {
      // Call server action with current form state
      const result = await generateSpeechAction({
        text: text,
        voice_S3_key: selectedVoice,
        language: selectedLanguage,
        exaggeration: exaggeration,
        cfg_weight: cfgWeight,
      });

      if (!result.success || !result.audioUrl || !result.s3_key) {
        throw new Error(result.error ?? "Generation failed");
      }

      // Refresh router cache to update credit display
      router.refresh();

      // Get voice name for display
      const allVoices = [...userUploadedVoices.map(v => ({ name: v.name, s3_key: v.s3Key })), ...VOICE_FILES];
      const voiceName = allVoices.find(v => v.s3_key === selectedVoice)?.name ?? "Unknown Voice";

      // Create new audio object for state
      const newAudio: GeneratedAudio = {
        s3_key: result.s3_key,
        audioUrl: result.audioUrl,
        text: text,
        language: selectedLanguage,
        timestamp: new Date(),
        voiceName: voiceName,
        exaggeration: exaggeration,
        cfgWeight: cfgWeight,
      };

      // Update current audio and prepend to history
      setCurrentAudio(newAudio);
      setGeneratedAudios([newAudio, ...generatedAudios].slice(0, MAX_AUDIO_HISTORY));

      // Auto-play the generated audio with slight delay for DOM update
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.play().catch((error) => {
            console.error("Autoplay failed:", error);
          });
        }
      }, 100);

      toast.success("Speech generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate speech";
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Play selected audio from history
   */
  const playAudio = (audio: GeneratedAudio) => {
    setCurrentAudio(audio);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().catch((error) => {
          console.error("Autoplay failed:", error);
        });
      }
    }, 100);
    toast.info("Now playing...");
  };

  /**
   * Download audio file
   */
  const downloadAudio = (audio: GeneratedAudio) => {
    window.open(audio.audioUrl, "_blank");
    toast.success("Download started!");
  };

  /**
   * Handle voice file upload
   */
  const handleVoiceUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith("audio/")) {
      toast.error("Please select an audio file!");
      return;
    }

    // Validate file size
    if (file.size > MAX_VOICE_FILE_SIZE) {
      toast.error("File size must be less than 10MB!");
      return;
    }

    setIsUploadingVoice(true);
    try {
      const formData = new FormData();
      formData.append("voice", file);

      const result = await uploadVoice(formData);

      if (!result.success) {
        throw new Error(result.error ?? "Upload failed");
      }

      toast.success("Voice uploaded successfully!");
      await fetchUserUploadedVoices();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload voice file");
    } finally {
      setIsUploadingVoice(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
      </div>
    );
  }

  return (
    <>
      <RedirectToSignIn />
      <SignedIn>
        <div className="border-b border-border/30 bg-card/30 py-2">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-gradient mb-1 text-lg font-bold">
              Text-to-Speech Generator
            </h1>
            <p className="mx-auto max-w-xl text-xs text-muted-foreground">
              Generate natural-sounding speech in 24 languages with voice
              cloning
            </p>
          </div>
        </div>
        {/* Main Content Area */}
        <div className="mx-auto max-w-7xl px-2 py-4 sm:px-4 sm:py-6">
          <div className="grid grid-cols-1 gap-2 sm:gap-4 lg:grid-cols-3">
            {/* Left Side - Controls (1/3 width) */}
            <div className="order-2 space-y-2 sm:space-y-3 lg:order-1 lg:col-span-1">
              <SpeechSettings
                languages={LANGUAGES}
                voiceFiles={VOICE_FILES}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                selectedVoice={selectedVoice}
                setSelectedVoice={setSelectedVoice}
                exaggeration={exaggeration}
                setExaggeration={setExaggeration}
                cfgWeight={cfgWeight}
                setCfgWeight={setCfgWeight}
                userUploadedVoices={userUploadedVoices}
                isUploadingVoice={isUploadingVoice}
                handleVoiceUpload={handleVoiceUpload}
                text={text}
                isGenerating={isGenerating}
                onGenerate={generateSpeech}
              />
            </div>
            <div className="order-1 space-y-2 sm:space-y-3 lg:order-2 lg:col-span-2">
              <TextInput
                text={text}
                setText={setText}
                currentAudio={currentAudio}
                audioRef={audioRef}
                onDownload={downloadAudio}
              />
            </div>
          </div>
          <AudioHistory
            generatedAudios={generatedAudios}
            languages={LANGUAGES}
            onPlay={playAudio}
            onDownload={downloadAudio}
          />
        </div>
      </SignedIn>
    </>
  );
}