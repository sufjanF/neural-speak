/**
 * Text Input Component
 * =====================
 * 
 * A text area component for entering content to be converted to speech.
 * Includes character counting, clear functionality, and an embedded
 * audio player for the most recently generated audio.
 * 
 * @module components/create/text-input
 * 
 * Features:
 * - Controlled textarea with character limit (500 chars)
 * - Real-time character count display
 * - Clear button to reset input
 * - Embedded audio player for current generation
 * - Download button for generated audio
 * - Glassmorphism card styling
 * 
 * Props:
 * - Controlled text state from parent
 * - Audio player ref and current audio object
 * - Download callback function
 * 
 * @example
 * <TextInput
 *   text={text}
 *   setText={setText}
 *   currentAudio={currentAudio}
 *   audioRef={audioRef}
 *   onDownload={downloadAudio}
 * />
 */
"use client";

import { X, Download, Music } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import AudioPlayer, { type AudioPlayerRef } from "~/components/ui/audio-player";
import type { GeneratedAudio } from "~/types/tts";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Props for the TextInput component.
 * 
 * @interface TextInputProps
 * @property {string} text - Current text input value
 * @property {function} setText - Text change handler
 * @property {GeneratedAudio | null} currentAudio - Most recent generated audio
 * @property {React.RefObject<HTMLAudioElement | null>} audioRef - Ref to audio element
 * @property {function} onDownload - Download button click handler
 */
interface TextInputProps {
  text: string;
  setText: (text: string) => void;
  currentAudio: GeneratedAudio | null;
  audioRef: React.RefObject<AudioPlayerRef | null>;
  onDownload: (audio: GeneratedAudio) => void;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * TextInput - Text entry area with integrated audio player.
 * 
 * Provides the main input interface for TTS text and displays
 * the most recently generated audio with playback controls.
 * 
 * @param {TextInputProps} props - Component props
 * @returns {JSX.Element} The text input panel UI
 */
export default function TextInput({
  text,
  setText,
  currentAudio,
  audioRef,
  onDownload,
}: TextInputProps) {
  return (
    <Card className="border-border/20 bg-card/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-border/30">
      <CardContent className="p-2 sm:p-3">
        {/* Section Header */}
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="mb-0.5 text-sm font-semibold text-foreground">Your Text</h3>
            <p className="text-xs text-muted-foreground">
              Enter the text you want to convert to speech
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Main Text Input Area */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here... Maximum 500 characters."
            maxLength={500}
            rows={8}
            className="w-full rounded-md border border-border/20 bg-muted/20 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:border-violet-400/40 focus:outline-none focus:ring-2 focus:ring-violet-400/20"
          />
          
          {/* Character Count and Clear Button */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{text.length}/500 characters</span>
            {text.length > 0 && (
              <Button
                onClick={() => setText("")}
                variant="ghost"
                size="sm"
                className="h-6 gap-1 px-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
                Clear
              </Button>
            )}
          </div>
          
          {/* Now Playing Audio Player */}
          {currentAudio && (
            <div className="rounded-lg border border-violet-400/20 bg-gradient-to-r from-violet-400/10 to-fuchsia-500/10 p-3 transition-all duration-300 sm:p-4">
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-shift shadow-md">
                    <Music className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-violet-300">
                      {currentAudio.voiceName ?? "Generated Audio"}
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(currentAudio.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => onDownload(currentAudio)}
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 border-violet-400/30 px-3 text-xs text-violet-400 hover:bg-violet-400/10 hover:text-violet-300"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download WAV
                </Button>
              </div>
              {/* Text preview (truncated to 100 chars) */}
              <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {currentAudio.text.substring(0, 120)}
                {currentAudio.text.length > 120 && "..."}
              </p>
              {/* Audio player container */}
              <AudioPlayer
                ref={audioRef}
                src={currentAudio.audioUrl}
                key={currentAudio.s3_key}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}