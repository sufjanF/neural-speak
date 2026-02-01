"use client";

import { Button } from "~/components/ui/button";
import {
  Sparkles,
  Zap,
  ArrowRight,
  Mic,
  Globe2,
  Activity,
  CheckCircle2,
  Play,
  AudioWaveform,
} from "lucide-react";
import Link from "next/link";
import DemoSection from "~/components/demo-section";
import { useEffect, useState, useRef, type ReactNode } from "react";

// Scroll animation hook
function useScrollAnimation(threshold = 0.15) {
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
      { threshold, rootMargin: "0px 0px -80px 0px" }
    );
    
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);
  
  return { ref, isVisible };
}

// Reusable scroll reveal component
function ScrollReveal({ 
  children, 
  className = "", 
  delay = 0,
  direction = "up",
  duration = 800
}: { 
  children: ReactNode; 
  className?: string; 
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale" | "fade";
  duration?: number;
}) {
  const { ref, isVisible } = useScrollAnimation();
  
  const transforms = {
    up: "translateY(50px)",
    down: "translateY(-50px)",
    left: "translateX(50px)",
    right: "translateX(-50px)",
    scale: "scale(0.92)",
    fade: "translateY(0)",
  };
  
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) translateX(0) scale(1)" : transforms[direction],
        transition: `all ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Stagger animation for lists
function StaggerReveal({ 
  children, 
  className = "", 
  staggerDelay = 100,
  baseDelay = 0
}: { 
  children: ReactNode[]; 
  className?: string; 
  staggerDelay?: number;
  baseDelay?: number;
}) {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <div
          key={i}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(40px)",
            transition: `all 700ms cubic-bezier(0.22, 1, 0.36, 1) ${baseDelay + i * staggerDelay}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [heroLoaded, setHeroLoaded] = useState(false);
  
  useEffect(() => {
    // Trigger hero animation on mount
    const timer = setTimeout(() => setHeroLoaded(true), 100);
    
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background relative selection:bg-cyan-500/30">
      {/* Chromatic gradient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-background to-cyan-500/5" />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-30"
          style={{ 
            background: 'linear-gradient(135deg, #f43f5e 0%, #f59e0b 25%, #22d3ee 50%, #10b981 75%, #f43f5e 100%)',
            left: `${mousePos.x * 0.015 - 100}px`, 
            top: `${mousePos.y * 0.015 + scrollY * 0.05 - 100}px`,
            transition: 'left 0.8s ease-out, top 0.8s ease-out'
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      </div>
      
      {/* Navigation - with scroll-aware styling */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${
          scrollY > 50 
            ? 'bg-background/95 border-border/20 shadow-lg shadow-black/5' 
            : 'bg-background/80 border-border/10'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-12 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative transition-transform duration-300 group-hover:scale-110">
                <AudioWaveform className="h-5 w-5 text-cyan-400" />
              </div>
              <span className="text-sm font-semibold tracking-tight">Neural Speak</span>
            </Link>
            <div className="flex items-center gap-1">
              {/* Hide these on mobile */}
              <Link href="#features" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="cursor-pointer text-xs text-muted-foreground hover:text-foreground h-7 px-3 transition-colors duration-200">
                  Features
                </Button>
              </Link>
              <Link href="#pricing" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="cursor-pointer text-xs text-muted-foreground hover:text-foreground h-7 px-3 transition-colors duration-200">
                  Pricing
                </Button>
              </Link>
              <div className="w-px h-4 bg-border/30 mx-1 sm:mx-2 hidden sm:block" />
              <Link href="/auth/sign-in">
                <Button variant="ghost" size="sm" className="cursor-pointer text-xs h-7 px-2 sm:px-3 transition-colors duration-200">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm" className="cursor-pointer text-xs h-7 px-2 sm:px-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white border-0 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/20">
                  Launch App
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero - dramatic and compact */}
      <section className="relative pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left - Copy with staggered entrance */}
            <div className="space-y-6">
              <div 
                className="inline-flex items-center gap-2 text-[10px] font-mono text-cyan-400/80 bg-cyan-500/8 border border-cyan-500/15 px-3 py-1.5 tracking-wider"
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? "translateY(0)" : "translateY(20px)",
                  transition: "all 800ms cubic-bezier(0.22, 1, 0.36, 1) 100ms",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                POWERED BY CHATTERBOX AI
              </div>
              
              <h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? "translateY(0)" : "translateY(30px)",
                  transition: "all 900ms cubic-bezier(0.22, 1, 0.36, 1) 200ms",
                }}
              >
                <span className="block">Text to speech,</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-400 to-cyan-400">
                  perfected.
                </span>
              </h1>
              
              <p 
                className="text-base text-muted-foreground max-w-md leading-relaxed"
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? "translateY(0)" : "translateY(30px)",
                  transition: "all 900ms cubic-bezier(0.22, 1, 0.36, 1) 350ms",
                }}
              >
                Clone any voice. Generate speech in 24 languages. 
                Broadcast-quality audio in seconds.
              </p>
              
              <div 
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2"
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? "translateY(0)" : "translateY(30px)",
                  transition: "all 900ms cubic-bezier(0.22, 1, 0.36, 1) 500ms",
                }}
              >
                <Link href="/dashboard">
                  <Button className="cursor-pointer h-10 px-5 bg-white text-black hover:bg-white/90 font-medium group w-full sm:w-auto">
                    Start Free
                    <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button variant="outline" className="cursor-pointer h-10 px-5 border-border/30 hover:border-border/50 font-medium w-full sm:w-auto">
                    <Play className="mr-2 h-3.5 w-3.5" />
                    Hear Samples
                  </Button>
                </Link>
              </div>
              
              {/* Metrics bar */}
              <div 
                className="flex flex-wrap items-center gap-4 sm:gap-8 pt-6 border-t border-border/15"
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? "translateY(0)" : "translateY(30px)",
                  transition: "all 900ms cubic-bezier(0.22, 1, 0.36, 1) 650ms",
                }}
              >
                {[
                  { value: "24", label: "languages" },
                  { value: "<3s", label: "latency" },
                  { value: "48kHz", label: "quality" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-baseline gap-1.5">
                    <span className="text-lg font-semibold font-mono text-foreground">{stat.value}</span>
                    <span className="text-[11px] text-muted-foreground/80">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right - Neural Network Voice Animation with parallax */}
            <div 
              className="relative hidden md:flex h-[350px] lg:h-[540px] items-center justify-center lg:justify-start lg:-ml-[8vw]"
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? `translateY(${scrollY * 0.05}px)` : "translateY(60px) scale(0.95)",
                transition: heroLoaded ? "transform 0.1s linear" : "all 1000ms cubic-bezier(0.22, 1, 0.36, 1) 400ms",
              }}
            >
              {/* Soft ambient glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10 blur-3xl" />
              
              {/* Neural network container - responsive sizing */}
              <div className="relative w-[400px] h-[320px] lg:w-[620px] lg:h-[480px]">
                {/* Neural nodes - input layer (left) */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={`input-${i}`}
                    className="absolute w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.7)] animate-[nodePulse_2.5s_ease-in-out_infinite]"
                    style={{
                      left: '8%',
                      top: `${15 + i * 17.5}%`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
                
                {/* Neural nodes - hidden layer 1 */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={`hidden1-${i}`}
                    className="absolute w-3.5 h-3.5 rounded-full bg-cyan-400/80 shadow-[0_0_16px_rgba(34,211,238,0.5)] animate-[nodePulse_2.5s_ease-in-out_infinite]"
                    style={{
                      left: '30%',
                      top: `${10 + i * 16}%`,
                      animationDelay: `${0.2 + i * 0.1}s`,
                    }}
                  />
                ))}
                
                {/* Neural nodes - hidden layer 2 */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={`hidden2-${i}`}
                    className="absolute w-3.5 h-3.5 rounded-full bg-emerald-400/80 shadow-[0_0_16px_rgba(52,211,153,0.5)] animate-[nodePulse_2.5s_ease-in-out_infinite]"
                    style={{
                      left: '52%',
                      top: `${10 + i * 16}%`,
                      animationDelay: `${0.4 + i * 0.1}s`,
                    }}
                  />
                ))}
                
                {/* Neural nodes - output layer (right) */}
                {[0, 1, 2].map((i) => (
                  <div
                    key={`output-${i}`}
                    className="absolute w-5 h-5 rounded-full bg-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.7)] animate-[nodePulse_2.5s_ease-in-out_infinite]"
                    style={{
                      left: '74%',
                      top: `${28 + i * 22}%`,
                      animationDelay: `${0.6 + i * 0.15}s`,
                    }}
                  />
                ))}
                
                {/* Connection lines SVG */}
                <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgb(34,211,238)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="rgb(52,211,153)" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  {/* Input to Hidden1 connections */}
                  {[0,1,2,3,4].map((i) =>
                    [0,1,2,3,4,5].map((j) => (
                      <line
                        key={`i-h1-${i}-${j}`}
                        x1="12%" y1={`${17 + i * 17.5}%`}
                        x2="30%" y2={`${12 + j * 16}%`}
                        stroke="url(#lineGradient)"
                        strokeWidth="1"
                        className="animate-[linePulse_3s_ease-in-out_infinite]"
                        style={{ animationDelay: `${(i + j) * 0.05}s` }}
                      />
                    ))
                  )}
                  {/* Hidden1 to Hidden2 connections */}
                  {[0,1,2,3,4,5].map((i) =>
                    [0,1,2,3,4,5].map((j) => (
                      <line
                        key={`h1-h2-${i}-${j}`}
                        x1="34%" y1={`${12 + i * 16}%`}
                        x2="52%" y2={`${12 + j * 16}%`}
                        stroke="url(#lineGradient)"
                        strokeWidth="1"
                        className="animate-[linePulse_3s_ease-in-out_infinite]"
                        style={{ animationDelay: `${0.3 + (i + j) * 0.05}s` }}
                      />
                    ))
                  )}
                  {/* Hidden2 to Output connections */}
                  {[0,1,2,3,4,5].map((i) =>
                    [0,1,2].map((j) => (
                      <line
                        key={`h2-o-${i}-${j}`}
                        x1="56%" y1={`${12 + i * 16}%`}
                        x2="74%" y2={`${30 + j * 22}%`}
                        stroke="url(#lineGradient)"
                        strokeWidth="1"
                        className="animate-[linePulse_3s_ease-in-out_infinite]"
                        style={{ animationDelay: `${0.6 + (i + j) * 0.05}s` }}
                      />
                    ))
                  )}
                </svg>
                
                {/* Signal pulses flowing through network - now colored to match */}
                <div className="absolute w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)] animate-[dataFlow_3s_ease-in-out_infinite]" />
                <div className="absolute w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)] animate-[dataFlow_3s_ease-in-out_infinite]" style={{ animationDelay: '1s' }} />
                <div className="absolute w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)] animate-[dataFlow_3s_ease-in-out_infinite]" style={{ animationDelay: '2s' }} />
                
                {/* Voice waveform output - complex multi-layer voice visualization */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 flex items-center">
                  {/* Primary waveform - varied heights and widths for realistic voice */}
                  <div className="flex items-center gap-[2px]">
                    {[
                      { h: 0.3, w: 2, d: 0 },
                      { h: 0.5, w: 3, d: 0.05 },
                      { h: 0.8, w: 2, d: 0.1 },
                      { h: 1, w: 4, d: 0.12 },
                      { h: 0.7, w: 3, d: 0.15 },
                      { h: 0.9, w: 2, d: 0.18 },
                      { h: 0.5, w: 3, d: 0.22 },
                      { h: 0.85, w: 4, d: 0.25 },
                      { h: 1, w: 3, d: 0.28 },
                      { h: 0.6, w: 2, d: 0.32 },
                      { h: 0.8, w: 3, d: 0.35 },
                      { h: 0.4, w: 2, d: 0.4 },
                      { h: 0.7, w: 4, d: 0.42 },
                      { h: 0.95, w: 3, d: 0.45 },
                      { h: 0.55, w: 2, d: 0.5 },
                      { h: 0.75, w: 3, d: 0.52 },
                      { h: 0.35, w: 2, d: 0.58 },
                    ].map((bar, i) => (
                      <div
                        key={i}
                        className="rounded-full animate-[voiceWave_2.8s_ease-in-out_infinite]"
                        style={{
                          width: `${bar.w}px`,
                          height: `${bar.h * 80}px`,
                          background: `linear-gradient(to top, rgb(52,211,153), rgb(34,211,238))`,
                          boxShadow: '0 0 6px rgba(52,211,153,0.6)',
                          animationDelay: `${bar.d}s`,
                        }}
                      />
                    ))}
                  </div>
                  {/* Secondary glow layer for depth */}
                  <div className="absolute inset-0 blur-sm opacity-50 flex items-center gap-[2px]">
                    {[0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8].map((h, i) => (
                      <div
                        key={i}
                        className="w-[4px] rounded-full animate-[voiceWave_3.5s_ease-in-out_infinite]"
                        style={{
                          height: `${h * 60}px`,
                          background: 'rgb(52,211,153)',
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Labels - only visible on large screens */}
                <span className="absolute left-[5%] bottom-[-24px] text-[10px] font-mono text-cyan-400/60 tracking-wider uppercase hidden lg:block">Text Input</span>
                <span className="absolute left-[33%] bottom-[-24px] text-[10px] font-mono text-muted-foreground/50 tracking-wider uppercase hidden lg:block">Neural Layers</span>
                <span className="absolute right-[-2%] top-[36%] text-[10px] font-mono text-emerald-400/60 tracking-wider uppercase hidden lg:block">Voice Output</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <DemoSection />

      {/* Features - grid layout with scroll animations */}
      <section id="features" className="relative py-20 border-t border-border/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ScrollReveal className="max-w-xl mb-12">
            <span className="text-[10px] font-mono text-cyan-400/80 mb-2 block tracking-wider">CAPABILITIES</span>
            <h2 className="text-3xl font-bold tracking-tight mb-3 text-foreground">
              Everything you need
            </h2>
            <p className="text-muted-foreground/80">
              Professional-grade tools for voice synthesis at scale.
            </p>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/20">
            {[
              {
                icon: <Mic className="h-4 w-4" />,
                title: "Voice Cloning",
                desc: "30-second sample creates a digital voice replica.",
                color: "rose"
              },
              {
                icon: <Activity className="h-4 w-4" />,
                title: "Emotional Range",
                desc: "Control intensity, pacing, and expression.",
                color: "amber"
              },
              {
                icon: <Globe2 className="h-4 w-4" />,
                title: "24 Languages",
                desc: "English, Spanish, Japanese, Arabic, and more.",
                color: "cyan"
              },
              {
                icon: <Zap className="h-4 w-4" />,
                title: "Instant Output",
                desc: "GPU-accelerated. Results in under 3 seconds.",
                color: "emerald"
              },
            ].map((feature, i) => (
              <ScrollReveal 
                key={i} 
                delay={i * 100}
                direction="up"
              >
                <div className="bg-background p-6 group hover:bg-card/50 transition-all duration-300 cursor-default h-full">
                  <div className={`inline-flex items-center justify-center w-8 h-8 mb-4 transition-transform duration-300 group-hover:scale-110 ${
                    feature.color === 'rose' ? 'bg-rose-500/10 text-rose-400' :
                    feature.color === 'amber' ? 'bg-amber-500/10 text-amber-400' :
                    feature.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-400' :
                    'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-1.5 text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works - horizontal flow with scroll animations */}
      <section className="relative py-20 border-t border-border/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ScrollReveal className="max-w-xl mb-12">
            <span className="text-[10px] font-mono text-amber-400/80 mb-2 block tracking-wider">WORKFLOW</span>
            <h2 className="text-3xl font-bold tracking-tight mb-3 text-foreground">
              Three steps to studio audio
            </h2>
            <p className="text-muted-foreground/80">
              No expertise required. Write, configure, export.
            </p>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: "Write your script",
                desc: "Paste text up to 5,000 characters. We handle punctuation, abbreviations, and formatting.",
              },
              {
                num: "02",
                title: "Select a voice",
                desc: "Choose from our library or upload a 30-second sample to clone your own.",
              },
              {
                num: "03",
                title: "Export instantly",
                desc: "Download high-fidelity WAV files. Commercial-ready. No restrictions.",
              },
            ].map((step, i) => {
              const colors = ['text-rose-500/30 group-hover:text-rose-500/50', 'text-amber-500/30 group-hover:text-amber-500/50', 'text-cyan-500/30 group-hover:text-cyan-500/50'];
              return (
                <ScrollReveal key={i} delay={i * 150} direction="up">
                  <div className="relative group">
                    <div className="flex items-start gap-4">
                      <span className={`text-4xl font-bold font-mono ${colors[i]} transition-colors duration-300`}>
                        {step.num}
                      </span>
                      <div className="pt-2">
                        <h3 className="font-semibold mb-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                    {i < 2 && (
                      <div className="hidden md:block absolute top-6 left-full w-8 h-px bg-gradient-to-r from-border/40 to-transparent -translate-x-4" />
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing - single card with scroll animations */}
      <section id="pricing" className="relative py-20 border-t border-border/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="right">
              <span className="text-[10px] font-mono text-emerald-400/80 mb-2 block tracking-wider">PRICING</span>
              <h2 className="text-3xl font-bold tracking-tight mb-3 text-foreground">
                Start free, scale as you grow
              </h2>
              <p className="text-muted-foreground/80 mb-6">
                10 free credits included. No credit card required to start.
              </p>
              
              <ul className="space-y-2">
                {[
                  "Unlimited voice cloning",
                  "All 24 languages",
                  "High-fidelity WAV exports",
                  "Commercial usage rights",
                  "Priority GPU processing",
                ].map((item, i) => (
                  <li 
                    key={i} 
                    className="flex items-center gap-2 text-sm"
                    style={{
                      animationDelay: `${i * 100}ms`,
                    }}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
            
            <ScrollReveal direction="left" delay={200}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 blur-3xl" />
                <div className="relative border border-border/30 bg-card/30 backdrop-blur-sm p-8 transition-all duration-300 hover:border-border/50 hover:bg-card/50">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-5xl font-bold">$0</span>
                    <span className="text-muted-foreground">to start</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    10 credits included • Pay-as-you-go after
                  </p>
                  <Link href="/dashboard" className="block">
                    <Button className="cursor-pointer w-full h-11 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Get Started Free
                    </Button>
                  </Link>
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    No credit card required
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Final CTA with scroll animation */}
      <section className="relative py-20 border-t border-border/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <ScrollReveal direction="scale">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
              Ready to create?
            </h2>
            <p className="text-muted-foreground/80 mb-8 max-w-md mx-auto">
              Join thousands using Neural Speak for professional voice synthesis.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/dashboard">
                <Button className="cursor-pointer h-11 px-6 bg-white text-black hover:bg-white/90 font-medium transition-all duration-300 hover:shadow-lg">
                  Launch App
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer - minimal with fade in */}
      <ScrollReveal direction="fade">
        <footer className="border-t border-border/10 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <AudioWaveform className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-semibold">Neural Speak</span>
              </div>
              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <Link href="#features" className="hover:text-foreground transition-colors duration-200">Features</Link>
                <Link href="#pricing" className="hover:text-foreground transition-colors duration-200">Pricing</Link>
                <Link href="/dashboard" className="hover:text-foreground transition-colors duration-200">Dashboard</Link>
              </div>
              <p className="text-xs text-muted-foreground">
                © 2026 Neural Speak
              </p>
            </div>
          </div>
        </footer>
      </ScrollReveal>
    </div>
  );
}
