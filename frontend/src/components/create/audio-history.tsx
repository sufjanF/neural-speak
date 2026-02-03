/**
 * Audio History Component
 * ========================
 * 
 * A grid display of recently generated audio projects. Shows audio cards
 * with metadata, play controls, and download buttons. Includes an empty
 * state for new users.
 * 
 * @module components/create/audio-history
 * 
 * Features:
 * - Responsive grid layout (1-4 columns based on viewport)
 * - Audio cards with language, timestamp, and text preview
 * - Play and download action buttons
 * - Hover animations with translate and shadow effects
 * - Empty state with icon and message
 * - Gradient accent styling matching app theme
 * 
 * @example
 * <AudioHistory
 *   generatedAudios={audios}
 *   languages={LANGUAGES}
 *   onPlay={playAudio}
 *   onDownload={downloadAudio}
 * />
 */
"use client";

import { Music, Play, Download } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { GeneratedAudio, Language } from "~/types/tts";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Props for the AudioHistory component.
 * 
 * @interface AudioHistoryProps
 * @property {GeneratedAudio[]} generatedAudios - Array of audio objects to display
 * @property {Language[]} languages - Language list for code-to-name mapping
 * @property {function} onPlay - Play button click handler
 * @property {function} onDownload - Download button click handler
 */
interface AudioHistoryProps {
  generatedAudios: GeneratedAudio[];
  languages: Language[];
  onPlay: (audio: GeneratedAudio) => void;
  onDownload: (audio: GeneratedAudio) => void;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * AudioHistory - Grid display of generated audio projects.
 * 
 * Renders a responsive grid of audio cards with metadata and
 * action buttons. Shows an empty state when no audio exists.
 * 
 * @param {AudioHistoryProps} props - Component props
 * @returns {JSX.Element} The audio history grid UI
 */
export default function AudioHistory({
  generatedAudios,
  languages,
  onPlay,
  onDownload,
}: AudioHistoryProps) {
  return (
    <div className="mt-6 border-t border-border/20 px-2 py-6 sm:px-4">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-6 text-center">
          <h2 className="mb-1.5 text-lg font-semibold text-foreground">
            Recent Generations
          </h2>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            Your speech generation history
          </p>
        </div>
        
        {/* Conditional Render: Grid or Empty State */}
        {generatedAudios.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {generatedAudios.map((audio, index) => (
              <div
                key={index}
                className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border/20 bg-card/40 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:shadow-lg hover:shadow-violet-400/5"
              >
                {/* Card Header with Icon and Metadata */}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-shift shadow-md">
                      <Music className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      {/* Display language name by looking up code */}
                      <p className="text-sm font-medium text-foreground">
                        {
                          languages.find((l) => l.code === audio.language)
                            ?.name
                        }
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(audio.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Voice and Settings Info */}
                {audio.voiceName && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center rounded-md bg-violet-500/10 px-2 py-1 text-[10px] font-medium text-violet-400">
                      🎤 {audio.voiceName}
                    </span>
                    {audio.exaggeration !== undefined && (
                      <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-1 text-[10px] font-medium text-amber-400">
                        Expr: {Math.round(audio.exaggeration * 100)}%
                      </span>
                    )}
                    {audio.cfgWeight !== undefined && (
                      <span className="inline-flex items-center rounded-md bg-cyan-500/10 px-2 py-1 text-[10px] font-medium text-cyan-400">
                        Pace: {Math.round(audio.cfgWeight * 100)}%
                      </span>
                    )}
                  </div>
                )}
                
                {/* Text Preview (truncated to 2 lines) - flex-1 pushes buttons to bottom */}
                <p className="mb-4 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                  {audio.text}
                </p>
                
                {/* Action Buttons - always at bottom */}
                <div className="mt-auto flex gap-2">
                  <Button
                    onClick={() => onPlay(audio)}
                    variant="outline"
                    size="sm"
                    className="cursor-pointer h-9 flex-1 gap-1.5 border-border/20 px-3 text-xs font-medium transition-all duration-200 hover:border-violet-400/40 hover:bg-violet-400/10 hover:text-violet-300"
                  >
                    <Play className="h-3.5 w-3.5" />
                    Play
                  </Button>
                  <Button
                    onClick={() => onDownload(audio)}
                    variant="outline"
                    size="sm"
                    className="cursor-pointer h-9 gap-1.5 border-border/20 px-3 text-xs transition-all duration-200 hover:border-violet-400/40 hover:bg-violet-400/10 hover:text-violet-300"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center sm:py-16">
            <div className="relative mx-auto mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-28 w-28 animate-pulse rounded-2xl bg-gradient-to-br from-violet-400/10 to-fuchsia-500/10"></div>
              </div>
              <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-border/20 bg-card/50 shadow-lg">
                <Music className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                No generations yet
              </h3>
              <p className="mx-auto max-w-md px-4 text-sm leading-relaxed text-muted-foreground">
                Start by entering some text and generating your first speech
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}