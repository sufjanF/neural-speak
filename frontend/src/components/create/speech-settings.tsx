/**
 * Speech Settings Component
 * ==========================
 * 
 * A comprehensive settings panel for configuring TTS generation parameters.
 * Provides controls for language selection, voice selection, expression
 * intensity, speech pacing, and custom voice upload.
 * 
 * @module components/create/speech-settings
 * 
 * Features:
 * - Language selector with 24 supported languages
 * - Voice selector combining default and user-uploaded voices
 * - Custom voice upload with drag-and-drop support
 * - Emotional expression slider (exaggeration parameter)
 * - Speech pacing slider (cfg_weight parameter)
 * - Generate button with credit cost display
 * - Loading states for upload and generation
 * 
 * Props:
 * - Controlled form state from parent component
 * - Callbacks for state updates and actions
 * - Lists of available languages and voices
 * 
 * @example
 * <SpeechSettings
 *   languages={LANGUAGES}
 *   voiceFiles={VOICE_FILES}
 *   selectedLanguage="en"
 *   setSelectedLanguage={setSelectedLanguage}
 *   // ... other props
 * />
 */
"use client";

import { Globe, Volume2, Upload, Settings, Loader2 } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import type { Language, VoiceFile, UploadedVoice } from "~/types/tts";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Props for the SpeechSettings component.
 * 
 * @interface SpeechSettingsProps
 * @property {Language[]} languages - Available languages for TTS
 * @property {VoiceFile[]} voiceFiles - Default voice samples
 * @property {string} selectedLanguage - Currently selected language code
 * @property {function} setSelectedLanguage - Language selection handler
 * @property {string} selectedVoice - Currently selected voice S3 key
 * @property {function} setSelectedVoice - Voice selection handler
 * @property {number} exaggeration - Emotional intensity (0-1)
 * @property {function} setExaggeration - Exaggeration change handler
 * @property {number} cfgWeight - Speech pacing control (0-1)
 * @property {function} setCfgWeight - CFG weight change handler
 * @property {UploadedVoice[]} userUploadedVoices - User's custom voices
 * @property {boolean} isUploadingVoice - Voice upload in progress
 * @property {function} handleVoiceUpload - File input change handler
 * @property {string} text - Current text input for credit calculation
 * @property {boolean} isGenerating - Generation in progress
 * @property {function} onGenerate - Generate button click handler
 */
interface SpeechSettingsProps {
  languages: Language[];
  voiceFiles: VoiceFile[];
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  exaggeration: number;
  setExaggeration: (value: number) => void;
  cfgWeight: number;
  setCfgWeight: (value: number) => void;
  userUploadedVoices: UploadedVoice[];
  isUploadingVoice: boolean;
  handleVoiceUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  text: string;
  isGenerating: boolean;
  onGenerate: () => void;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * SpeechSettings - TTS configuration panel.
 * 
 * Renders a card with all speech generation settings including
 * language, voice, expression, and pacing controls.
 * 
 * @param {SpeechSettingsProps} props - Component props
 * @returns {JSX.Element} The settings panel UI
 */
export default function SpeechSettings({
  languages,
  voiceFiles,
  selectedLanguage,
  setSelectedLanguage,
  selectedVoice,
  setSelectedVoice,
  exaggeration,
  setExaggeration,
  cfgWeight,
  setCfgWeight,
  userUploadedVoices,
  isUploadingVoice,
  handleVoiceUpload,
  text,
  isGenerating,
  onGenerate,
}: SpeechSettingsProps) {
  // Calculate credits needed based on text length (1 credit per 100 chars, min 1)
  const creditsNeeded = Math.max(1, Math.ceil(text.length / 100));
  
  return (
    <Card className="border-border/20 bg-card/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-border/30">
      <CardContent className="p-2 sm:p-3">
        {/* Section Header */}
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="mb-0.5 text-sm font-semibold text-foreground">Settings</h3>
            <p className="text-xs text-muted-foreground">
              Customize your speech
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Language Selector */}
          <div>
            <label className="mb-1 flex items-center gap-1 text-xs font-medium text-foreground">
              <Globe className="h-3 w-3 text-orange-400" />
              Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full rounded-md border border-border/20 bg-muted/30 px-2 py-1.5 text-xs text-foreground transition-all duration-200 focus:border-amber-400/40 focus:outline-none focus:ring-1 focus:ring-amber-400/40"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[10px] text-muted-foreground/70">
              Write your text in this language for best results
            </p>
          </div>
          
          {/* Voice Selector */}
          <div>
            <label className="mb-1 flex items-center gap-1 text-xs font-medium text-foreground">
              <Volume2 className="h-3 w-3 text-amber-400" />
              Voice
            </label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full rounded-md border border-border/20 bg-muted/30 px-2 py-1.5 text-xs text-foreground transition-all duration-200 focus:border-amber-400/40 focus:outline-none focus:ring-1 focus:ring-amber-400/40"
            >
              {/* User's custom uploaded voices (shown first with mic icon) */}
              {userUploadedVoices.map((voice) => (
                <option key={voice.id} value={voice.s3Key}>
                  🎤 {voice.name}
                </option>
              ))}
              {/* Default system voices */}
              {voiceFiles.map((voice) => (
                <option key={voice.s3_key} value={voice.s3_key}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 flex items-center gap-1 text-xs font-medium text-foreground">
              <Upload className="h-3 w-3 text-emerald-400" />
              Upload Your Voice
            </label>
            <div className="space-y-2">
              {isUploadingVoice ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                  <span className="ml-2 text-xs text-muted-foreground">
                    Uploading...
                  </span>
                </div>
              ) : (
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleVoiceUpload}
                  className="w-full cursor-pointer text-xs text-muted-foreground file:mr-2 file:rounded-md file:border-0 file:bg-amber-400/10 file:px-2 file:py-1 file:text-xs file:text-amber-400 file:transition-colors file:hover:bg-amber-400/20"
                />
              )}
              <p className="text-xs text-muted-foreground">
                Upload a clear voice sample (WAV/MP3). Uploaded voices appear in
                the dropdown above.
              </p>
            </div>
          </div>
          <div>
            <label className="mb-1 flex items-center justify-between text-xs font-medium text-foreground">
              <span className="flex items-center gap-1">
                <Settings className="h-3 w-3 text-amber-400" />
                Emotion/Intensity
              </span>
              <span className="text-muted-foreground">
                {exaggeration.toFixed(1)}
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={exaggeration}
              onChange={(e) => setExaggeration(parseFloat(e.target.value))}
              className="w-full cursor-pointer accent-amber-400"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>Calm</span>
              <span>Expressive</span>
            </div>
          </div>
          <div>
            <label className="mb-1 flex items-center justify-between text-xs font-medium text-foreground">
              <span className="flex items-center gap-1">
                <Settings className="h-3 w-3 text-amber-400" />
                Pacing Control
              </span>
              <span className="text-muted-foreground">
                {cfgWeight.toFixed(1)}
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={cfgWeight}
              onChange={(e) => setCfgWeight(parseFloat(e.target.value))}
              className="w-full cursor-pointer accent-amber-400"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>Fast</span>
              <span>Accurate</span>
            </div>
          </div>
          <div className="space-y-2">
            {text.trim() && (
              <div className="rounded-md border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-center">
                <p className="text-xs text-amber-300">
                  Cost:{" "}
                  <span className="font-semibold">
                    {creditsNeeded} credit
                    {creditsNeeded > 1 ? "s" : ""}
                  </span>{" "}
                  ({text.length} characters)
                </p>
              </div>
            )}
            <Button
              onClick={onGenerate}
              disabled={isGenerating || !text.trim()}
              className="h-9 w-full gap-2 gradient-shift text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4" />
                  Generate Speech
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}