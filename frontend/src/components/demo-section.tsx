/**
 * Demo Section Component
 * ----------------------
 * Showcases audio samples demonstrating TTS quality.
 * Features natural speech and multilingual samples with
 * scroll-triggered animations.
 */
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Play, Pause, Sparkles, Mic, Globe2 } from "lucide-react";
import Link from "next/link";

/* ============================================================================
   SAMPLE DATA
   ============================================================================ */

/** Natural speech voice samples */
const NATURAL_SPEECH_SAMPLES = [
  {
    id: "friendly-female",
    text: "Hi there! I'm excited to help you create amazing voice content today.",
    voiceType: "Friendly Female",
    audioUrl: "/audio/friendly-female.wav",
  },
  {
    id: "news-anchor",
    text: "Introducing the next generation of refreshment. Duff Beer just got bolder, smoother, and brewed to perfection.",
    voiceType: "Stewie Voice Clone",
    audioUrl: "/audio/duff_stewie.wav",
  },
  {
    id: "conan-protest",
    text: "So I want you to get up now. I want all of you to get up out of your chairs. I want you to go to the window, open it, and stick your head out and yell 'I'M MAD AS HELL!",
    voiceType: "Conan Voice - Passionate Protest",
    audioUrl: "/audio/network_conan.wav",
  },
] as const;

/** Multilingual demo samples */
const MULTILINGUAL_SAMPLES = [
  {
    id: "hindi",
    language: "Indian 🇮🇳",
    text: "नमस्कार! हमारे मंच पर आपका स्वागत है।",
    audioUrl: "/audio/hindi.wav",
  },
  {
    id: "spanish",
    language: "Spanish 🇪🇸",
    text: "¡Hola! Bienvenido a nuestra plataforma.",
    audioUrl: "/audio/spanish.wav",
  },
  {
    id: "french",
    language: "French 🇫🇷",
    text: "Bonjour! Bienvenue sur notre plateforme.",
    audioUrl: "/audio/french.wav",
  },
  {
    id: "japanese",
    language: "Japanese 🇯🇵",
    text: "こんにちは！私たちのプラットフォームへようこそ。",
    audioUrl: "/audio/japanese.wav",
  },
] as const;

/* ============================================================================
   MAIN COMPONENT
   ============================================================================ */

/**
 * DemoSection - Interactive audio sample showcase
 * Displays voice samples in categorized tables with play controls.
 */
export default function DemoSection() {
  const [playingId, setPlayingId] = useState<string | null>(null);

  /**
   * Handles audio playback toggle
   * @param id - Sample identifier
   * @param audioUrl - URL of the audio file
   */
  const handlePlay = (id: string, audioUrl: string) => {
    // Toggle off if already playing
    if (playingId === id) {
      const audio = document.getElementById(id) as HTMLAudioElement;
      audio?.pause();
      setPlayingId(null);
      return;
    }

    // Stop currently playing audio
    if (playingId) {
      const currentAudio = document.getElementById(playingId) as HTMLAudioElement;
      currentAudio?.pause();
      currentAudio.currentTime = 0;
    }

    // Play selected audio
    const audio = document.getElementById(id) as HTMLAudioElement;
    if (audio) {
      audio
        .play()
        .then(() => setPlayingId(id))
        .catch((error) => {
          console.error("Audio playback failed:", error);
          alert("Unable to play audio. Please try generating your own speech in the dashboard!");
        });

      audio.onended = () => setPlayingId(null);
      audio.onerror = () => setPlayingId(null);
    }
  };

  return (
    <section id="demo" className="relative z-10 py-16 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-xl mb-10">
          <span className="text-[10px] font-mono text-cyan-400/80 mb-2 block tracking-wider">SAMPLES</span>
          <h2 className="text-3xl font-bold tracking-tight mb-3 text-white">
            Hear the quality
          </h2>
          <p className="text-slate-300/90">
            Real samples from our synthesis engine—no post-processing, no filters.
          </p>
        </div>

        {/* Natural Speech Samples */}
        <ScrollReveal delay={100} className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 flex items-center justify-center bg-rose-500/8 text-rose-400">
              <Mic className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-sm font-medium text-foreground/90">Expressive Voice Samples</h3>
          </div>
          <Card className="overflow-hidden border-border/20 bg-card/30">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border/20 bg-muted/5">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                      Text
                    </th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                      Voice
                    </th>
                    <th className="px-4 py-2.5 text-center text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                      Play
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {NATURAL_SPEECH_SAMPLES.map((sample, index) => (
                    <ScrollRevealRow key={sample.id} delay={index * 80}>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs">
                        &ldquo;{sample.text}&rdquo;
                      </td>
                      <td className="px-4 py-3 text-xs font-medium whitespace-nowrap">
                        {sample.voiceType}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className={`cursor-pointer gap-1.5 border-border/20 h-7 px-2.5 text-xs ${
                              playingId === sample.id 
                                ? 'bg-cyan-500 text-white border-transparent' 
                                : 'hover:border-cyan-500/50 hover:text-cyan-400'
                            }`}
                            onClick={() =>
                              handlePlay(sample.id, sample.audioUrl)
                            }
                          >
                            {playingId === sample.id ? (
                              <>
                                <Pause className="h-3 w-3" />
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3" />
                              </>
                            )}
                          </Button>
                          {sample.audioUrl && (
                            <audio
                              id={sample.id}
                              src={sample.audioUrl}
                              preload="metadata"
                            />
                          )}
                        </div>
                      </td>
                    </ScrollRevealRow>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </ScrollReveal>

        {/* Multilingual Support Demo */}
        <ScrollReveal delay={200}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 flex items-center justify-center bg-amber-500/8 text-amber-400">
              <Globe2 className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-sm font-medium text-foreground/90">24 Languages Supported</h3>
          </div>
          <Card className="overflow-hidden border-border/20 bg-card/30">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border/20 bg-muted/5">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                      Language
                    </th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                      Text
                    </th>
                    <th className="px-4 py-2.5 text-center text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                      Play
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {MULTILINGUAL_SAMPLES.map((sample, index) => (
                    <ScrollRevealRow key={sample.id} delay={index * 80}>
                      <td className="px-4 py-3 text-xs font-medium whitespace-nowrap">
                        {sample.language}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        &ldquo;{sample.text}&rdquo;
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className={`cursor-pointer gap-1.5 border-border/20 h-7 px-2.5 text-xs ${
                              playingId === sample.id 
                                ? 'bg-cyan-500 text-white border-transparent' 
                                : 'hover:border-cyan-500/50 hover:text-cyan-400'
                            }`}
                            onClick={() =>
                              handlePlay(sample.id, sample.audioUrl)
                            }
                          >
                            {playingId === sample.id ? (
                              <>
                                <Pause className="h-3 w-3" />
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3" />
                              </>
                            )}
                          </Button>
                          {sample.audioUrl && (
                            <audio
                              id={sample.id}
                              src={sample.audioUrl}
                              preload="metadata"
                              crossOrigin="anonymous"
                            />
                          )}
                        </div>
                      </td>
                    </ScrollRevealRow>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={300} className="mt-10 text-center">
          <Link href="/dashboard">
            <Button className="cursor-pointer h-10 px-5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-medium">
              <Sparkles className="mr-2 h-4 w-4" />
              Start Creating Free
            </Button>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ============================================================================
   ANIMATION COMPONENTS
   ============================================================================ */

/**
 * ScrollReveal - Animates children when scrolled into view
 * @param children - Content to animate
 * @param className - Additional CSS classes
 * @param delay - Animation delay in ms
 */
function ScrollReveal({ 
  children, 
  className = "", 
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: `all 700ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * ScrollRevealRow - Animates table rows with horizontal slide
 * @param children - Row content
 * @param delay - Animation delay in ms
 */
function ScrollRevealRow({ 
  children, 
  delay = 0 
}: { 
  children: React.ReactNode; 
  delay?: number;
}) {
  const ref = useRef<HTMLTableRowElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <tr
      ref={ref}
      className="transition-colors duration-200 hover:bg-muted/10"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0)" : "translateX(-30px)",
        transition: `all 500ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </tr>
  );
}