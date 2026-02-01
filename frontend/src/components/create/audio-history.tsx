"use client";

import { Music, Play, Download } from "lucide-react";
import { Button } from "~/components/ui/button";

import type { GeneratedAudio, Language } from "~/types/tts";

interface AudioHistoryProps {
  generatedAudios: GeneratedAudio[];
  languages: Language[];
  onPlay: (audio: GeneratedAudio) => void;
  onDownload: (audio: GeneratedAudio) => void;
}

export default function AudioHistory({
  generatedAudios,
  languages,
  onPlay,
  onDownload,
}: AudioHistoryProps) {
  return (
    <div className="mt-4 border-t border-border/20 px-2 py-5 sm:px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 text-center">
          <h2 className="mb-1.5 text-lg font-semibold text-foreground">
            Recent Generations
          </h2>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            Your speech generation history
          </p>
        </div>
        {generatedAudios.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {generatedAudios.map((audio, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-sm border border-border/20 bg-card/40 p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-400/5"
              >
                <div className="mb-2.5 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-sm gradient-shift shadow-lg">
                      <Music className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">
                        {
                          languages.find((l) => l.code === audio.language)
                            ?.name
                        }
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(audio.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="mb-2.5 line-clamp-3 text-xs text-muted-foreground">
                  {audio.text}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => onPlay(audio)}
                    variant="outline"
                    size="sm"
                    className="cursor-pointer h-7 flex-1 gap-1 border-border/20 px-2 text-xs transition-all duration-200 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300"
                  >
                    <Play className="h-3 w-3" />
                    Play
                  </Button>
                  <Button
                    onClick={() => onDownload(audio)}
                    variant="outline"
                    size="sm"
                    className="cursor-pointer h-7 gap-1 border-border/20 px-2 text-xs transition-all duration-200 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="relative mx-auto mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-24 w-24 animate-pulse rounded-sm bg-gradient-to-br from-cyan-400/10 to-emerald-500/10"></div>
              </div>
              <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-sm border-2 border-dashed border-border/20 bg-card/50 shadow-lg">
                <Music className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                No generations yet
              </h3>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
                Start by entering some text and generating your first speech
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}