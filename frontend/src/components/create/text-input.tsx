"use client";

import { X, Download } from "lucide-react";

import { Card, CardContent } from "~/components/ui/card";

import { Button } from "~/components/ui/button";

import type { GeneratedAudio } from "~/types/tts";

interface TextInputProps {
  text: string;
  setText: (text: string) => void;
  currentAudio: GeneratedAudio | null;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onDownload: (audio: GeneratedAudio) => void;
}

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
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="mb-0.5 text-sm font-semibold text-foreground">Your Text</h3>
            <p className="text-xs text-muted-foreground">
              Enter the text you want to convert to speech
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here... Maximum 500 characters."
            maxLength={500}
            rows={8}
            className="w-full rounded-md border border-border/20 bg-muted/20 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          />
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
          {currentAudio && (
            <div className="rounded-sm border border-cyan-400/20 bg-gradient-to-r from-cyan-400/10 to-emerald-500/10 p-3 transition-all duration-300">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-xs font-semibold text-cyan-300">
                  Latest Generation
                </h4>
                <Button
                  onClick={() => onDownload(currentAudio)}
                  variant="ghost"
                  size="sm"
                  className="h-6 gap-1 px-2 text-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
                >
                  <Download className="h-3 w-3" />
                  <span className="text-xs">Download</span>
                </Button>
              </div>
              <p className="mb-2 text-xs text-muted-foreground">
                {currentAudio.text.substring(0, 100)}
                {currentAudio.text.length > 100 && "..."}
              </p>
              <div className="rounded-md bg-muted/20 p-2">
                <audio
                  ref={audioRef}
                  controls
                  className="w-full"
                  style={{ height: "32px" }}
                  key={currentAudio.s3_key}
                >
                  <source src={currentAudio.audioUrl} type="audio/wav" />
                </audio>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}