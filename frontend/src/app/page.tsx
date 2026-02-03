/**
 * Neural Speak Landing Page
 * -------------------------
 * Main marketing page showcasing TTS capabilities with
 * animated neural network visualization and scroll-based reveals.
 */
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
  Type,
  Settings,
  Download,
} from "lucide-react";
import Link from "next/link";
import DemoSection from "~/components/demo-section";
import { Logo } from "~/components/ui/logo";
import { useEffect, useState, useRef, type ReactNode } from "react";

/* ============================================================================
   CONSTANTS & CONFIGURATION
   ============================================================================ */

/** Hero section statistics */
const HERO_METRICS = [
  { value: "24+", label: "languages supported" },
  { value: "10", label: "free credits" },
  { value: "50+", label: "voice styles" },
] as const;

/** Feature cards for capabilities section */
const FEATURES = [
  {
    icon: <Mic className="h-4 w-4" />,
    title: "Voice Cloning",
    desc: "30-second sample creates a digital voice replica.",
    color: "rose" as const,
  },
  {
    icon: <Activity className="h-4 w-4" />,
    title: "Emotional Range",
    desc: "Control intensity, pacing, and expression.",
    color: "amber" as const,
  },
  {
    icon: <Globe2 className="h-4 w-4" />,
    title: "24 Languages",
    desc: "English, Spanish, Japanese, Arabic, and more.",
    color: "cyan" as const,
  },
  {
    icon: <Zap className="h-4 w-4" />,
    title: "Studio Quality",
    desc: "48kHz broadcast-ready WAV files every time.",
    color: "emerald" as const,
  },
] as const;

/** Workflow steps for "How it works" section */
const WORKFLOW_STEPS = [
  {
    num: "01",
    title: "Write your script",
    desc: "Paste text up to 5,000 characters. We handle punctuation, abbreviations, and formatting.",
    color: "text-rose-500/30 group-hover:text-rose-500/50",
  },
  {
    num: "02",
    title: "Select a voice",
    desc: "Choose from our library or upload a 30-second sample to clone your own.",
    color: "text-amber-500/30 group-hover:text-amber-500/50",
  },
  {
    num: "03",
    title: "Download & use",
    desc: "Export high-fidelity WAV files. Commercial-ready. No restrictions.",
    color: "text-cyan-500/30 group-hover:text-cyan-500/50",
  },
] as const;

/** Pricing features list */
const PRICING_FEATURES = [
  "Unlimited voice cloning",
  "All 24 languages",
  "High-fidelity WAV exports",
  "Commercial usage rights",
  "Priority GPU processing",
] as const;

/* ============================================================================
   ANIMATION HOOKS & COMPONENTS
   ============================================================================ */

/**
 * Custom hook for scroll-triggered animations
 * @param threshold - Intersection threshold (0-1)
 * @returns ref to attach and visibility state
 */
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

/** Transform values for different animation directions */
const DIRECTION_TRANSFORMS = {
  up: "translateY(50px)",
  down: "translateY(-50px)",
  left: "translateX(50px)",
  right: "translateX(-50px)",
  scale: "scale(0.92)",
  fade: "translateY(0)",
} as const;

/**
 * ScrollReveal - Animates children on scroll into view
 * @param children - Content to animate
 * @param delay - Animation delay in ms
 * @param direction - Animation direction
 * @param duration - Animation duration in ms
 */
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
  direction?: keyof typeof DIRECTION_TRANSFORMS;
  duration?: number;
}) {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) translateX(0) scale(1)" : DIRECTION_TRANSFORMS[direction],
        transition: `all ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================================
   MAIN PAGE COMPONENT
   ============================================================================ */

export default function HomePage() {
  // Scroll and mouse position for parallax effects
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [heroLoaded, setHeroLoaded] = useState(false);
  
  // Initialize event listeners for scroll/mouse tracking
  useEffect(() => {
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 relative selection:bg-cyan-500/30">
      {/* Chromatic gradient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/6 via-slate-900 to-cyan-500/6" />
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
      
      {/* ========== NAVIGATION ========== */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${
          scrollY > 50 
            ? 'bg-slate-900/95 border-border/20 shadow-lg shadow-black/5' 
            : 'bg-slate-900/80 border-border/10'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-12 items-center justify-between">
            {/* Brand logo */}
            <Link href="/" className="group">
              <Logo size="md" showText textClass="text-sm font-semibold tracking-tight text-slate-200" />
            </Link>
            
            {/* Navigation links & auth buttons */}
            <div className="flex items-center gap-1">
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

      {/* ========== HERO SECTION ========== */}
      <section className="relative pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Hero copy with staggered entrance */}
            <div className="space-y-6 lg:pr-4">
              <a 
                href="https://www.resemble.ai/chatterbox/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-slate-500/8 border border-slate-500/20 px-3 py-1.5 tracking-wider hover:bg-slate-500/12 hover:border-slate-500/30 transition-all duration-200 cursor-pointer"
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? "translateY(0)" : "translateY(20px)",
                  transition: "all 800ms cubic-bezier(0.22, 1, 0.36, 1) 100ms",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                POWERED BY CHATTERBOX TTS
                <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
              
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
                  crafted for clarity.
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
              
              {/* Hero metrics bar */}
              <div 
                className="flex flex-wrap items-center gap-4 sm:gap-8 pt-6 border-t border-border/15"
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? "translateY(0)" : "translateY(30px)",
                  transition: "all 900ms cubic-bezier(0.22, 1, 0.36, 1) 650ms",
                }}
              >
                {HERO_METRICS.map((stat, i) => (
                  <div key={i} className="flex items-baseline gap-1.5">
                    <span className="text-lg font-semibold font-mono text-foreground">{stat.value}</span>
                    <span className="text-[11px] text-muted-foreground/80">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Neural Network Animation (desktop only) */}
            <div 
              className="relative hidden md:flex h-[500px] lg:h-[720px] items-center justify-start lg:-ml-8"
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? `translateY(${scrollY * 0.05}px)` : "translateY(60px) scale(0.95)",
                transition: heroLoaded ? "transform 0.1s linear" : "all 1000ms cubic-bezier(0.22, 1, 0.36, 1) 400ms",
              }}
            >
              {/* Soft ambient glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10 blur-3xl" />
              
              {/* Neural network container - responsive sizing with proper containment */}
              <div className="relative w-full max-w-[580px] lg:max-w-[820px] h-[440px] lg:h-[640px]">
                {/* Neural nodes - input layer (left) */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={`input-${i}`}
                    className="absolute w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.7)] animate-[nodePulse_4s_ease-in-out_infinite]"
                    style={{
                      left: '6%',
                      top: `${12 + i * 18}%`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
                
                {/* Neural nodes - hidden layer 1 */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={`hidden1-${i}`}
                    className="absolute w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 rounded-full bg-cyan-400/80 shadow-[0_0_16px_rgba(34,211,238,0.5)] animate-[nodePulse_4s_ease-in-out_infinite]"
                    style={{
                      left: '28%',
                      top: `${8 + i * 15}%`,
                      animationDelay: `${0.2 + i * 0.1}s`,
                    }}
                  />
                ))}
                
                {/* Neural nodes - hidden layer 2 */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={`hidden2-${i}`}
                    className="absolute w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 rounded-full bg-emerald-400/80 shadow-[0_0_16px_rgba(52,211,153,0.5)] animate-[nodePulse_4s_ease-in-out_infinite]"
                    style={{
                      left: '50%',
                      top: `${8 + i * 15}%`,
                      animationDelay: `${0.4 + i * 0.1}s`,
                    }}
                  />
                ))}
                
                {/* Neural nodes - output layer (right) */}
                {[0, 1, 2].map((i) => (
                  <div
                    key={`output-${i}`}
                    className="absolute w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.7)] animate-[nodePulse_4s_ease-in-out_infinite]"
                    style={{
                      left: '72%',
                      top: `${25 + i * 22}%`,
                      animationDelay: `${0.6 + i * 0.15}s`,
                    }}
                  />
                ))}
                
                {/* Connection lines SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
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
                        x1="9%" y1={`${14 + i * 18}%`}
                        x2="27%" y2={`${10 + j * 15}%`}
                        stroke="url(#lineGradient)"
                        strokeWidth="1"
                        className="animate-[linePulse_5s_ease-in-out_infinite]"
                        style={{ animationDelay: `${(i + j) * 0.08}s` }}
                      />
                    ))
                  )}
                  {/* Hidden1 to Hidden2 connections */}
                  {[0,1,2,3,4,5].map((i) =>
                    [0,1,2,3,4,5].map((j) => (
                      <line
                        key={`h1-h2-${i}-${j}`}
                        x1="31%" y1={`${10 + i * 15}%`}
                        x2="49%" y2={`${10 + j * 15}%`}
                        stroke="url(#lineGradient)"
                        strokeWidth="1"
                        className="animate-[linePulse_5s_ease-in-out_infinite]"
                        style={{ animationDelay: `${0.5 + (i + j) * 0.08}s` }}
                      />
                    ))
                  )}
                  {/* Hidden2 to Output connections */}
                  {[0,1,2,3,4,5].map((i) =>
                    [0,1,2].map((j) => (
                      <line
                        key={`h2-o-${i}-${j}`}
                        x1="53%" y1={`${10 + i * 15}%`}
                        x2="71%" y2={`${27 + j * 22}%`}
                        stroke="url(#lineGradient)"
                        strokeWidth="1"
                        className="animate-[linePulse_5s_ease-in-out_infinite]"
                        style={{ animationDelay: `${1 + (i + j) * 0.08}s` }}
                      />
                    ))
                  )}
                </svg>
                
                {/* Signal pulses flowing through network - centered with transform */}
                <div className="absolute w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)] animate-[dataFlowContained_6s_ease-in-out_infinite] opacity-0 -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)] animate-[dataFlowContained_6s_ease-in-out_infinite] opacity-0 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '2s' }} />
                <div className="absolute w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)] animate-[dataFlowContained_6s_ease-in-out_infinite] opacity-0 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '4s' }} />
                
                {/* Voice waveform output - aligned with middle output node at 47% */}
                <div className="absolute right-[3%] top-[47%] -translate-y-1/2 flex items-center">
                  {/* Primary waveform - smaller bars */}
                  <div className="flex items-center gap-[3px]">
                    {[
                      { h: 0.3, w: 3, d: 0 },
                      { h: 0.5, w: 4, d: 0.05 },
                      { h: 0.8, w: 3, d: 0.1 },
                      { h: 1, w: 4, d: 0.12 },
                      { h: 0.7, w: 3, d: 0.15 },
                      { h: 0.9, w: 3, d: 0.18 },
                      { h: 0.5, w: 4, d: 0.22 },
                      { h: 0.85, w: 4, d: 0.25 },
                      { h: 1, w: 3, d: 0.28 },
                      { h: 0.6, w: 3, d: 0.32 },
                      { h: 0.8, w: 4, d: 0.35 },
                      { h: 0.4, w: 3, d: 0.4 },
                    ].map((bar, i) => (
                      <div
                        key={i}
                        className="rounded-full animate-[voiceWave_4.5s_ease-in-out_infinite]"
                        style={{
                          width: `${bar.w}px`,
                          height: `${bar.h * 82}px`,
                          background: `linear-gradient(to top, rgb(52,211,153), rgb(34,211,238))`,
                          boxShadow: '0 0 6px rgba(52,211,153,0.6)',
                          animationDelay: `${bar.d}s`,
                        }}
                      />
                    ))}
                  </div>
                  {/* Secondary glow layer for depth */}
                  <div className="absolute inset-0 blur-sm opacity-50 flex items-center gap-[3px]">
                    {[0.4, 0.7, 1, 0.6, 0.9].map((h, i) => (
                      <div
                        key={i}
                        className="w-[4px] rounded-full animate-[voiceWave_5.5s_ease-in-out_infinite]"
                        style={{
                          height: `${h * 60}px`,
                          background: 'rgb(52,211,153)',
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Labels - individually positioned relative to animation elements */}
                <span className="absolute left-[6%] top-[90%] text-[9px] lg:text-[10px] font-mono text-cyan-400/60 tracking-wider uppercase whitespace-nowrap pointer-events-none -translate-x-1/4">Text Input</span>
                <span className="absolute left-[39%] top-[90%] text-[9px] lg:text-[10px] font-mono text-slate-400/80 tracking-wider uppercase whitespace-nowrap pointer-events-none -translate-x-1/2">Neural Layers</span>
                {/* Voice Output label - positioned below waveform */}
                <span className="absolute right-[3%] top-[58%] text-[9px] lg:text-[10px] font-mono text-emerald-400/60 tracking-wider uppercase whitespace-nowrap pointer-events-none">Voice Output</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== DEMO SECTION ========== */}
      <DemoSection />

      {/* ========== FEATURES SECTION ========== */}
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
          
          {/* Feature cards grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/20">
            {FEATURES.map((feature, i) => (
              <ScrollReveal key={i} delay={i * 100} direction="up">
                <div className="bg-slate-900/40 p-6 group hover:bg-slate-900/55 transition-all duration-300 cursor-default h-full">
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

      {/* ========== WORKFLOW SECTION ========== */}
      <section className="relative py-20 border-t border-border/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Section header */}
          <ScrollReveal className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] font-mono text-amber-400/80 mb-2 block tracking-wider">HOW IT WORKS</span>
            <h2 className="text-3xl font-bold tracking-tight mb-3 text-foreground">
              Three steps to studio-quality audio
            </h2>
            <p className="text-muted-foreground/80">
              No expertise required. From text to broadcast-ready audio in seconds.
            </p>
          </ScrollReveal>
          
          {/* Workflow steps grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {WORKFLOW_STEPS.map((step, i) => (
              <ScrollReveal key={i} delay={i * 100} direction="up">
                <div className="group h-full bg-slate-900/40 border border-border/20 rounded-lg p-6 transition-all duration-300 hover:bg-slate-900/60 hover:border-border/30">
                  {/* Step number + Icon row */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`text-3xl font-bold font-mono ${step.color}`}>
                      {step.num}
                    </span>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      i === 0 ? 'bg-rose-500/10' :
                      i === 1 ? 'bg-amber-500/10' :
                      'bg-emerald-500/10'
                    }`}>
                      {i === 0 ? <Type className="w-5 h-5 text-rose-400" /> :
                       i === 1 ? <Settings className="w-5 h-5 text-amber-400" /> :
                       <Download className="w-5 h-5 text-emerald-400" />}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-semibold mb-2 text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PRICING SECTION ========== */}
      <section id="pricing" className="relative py-20 border-t border-border/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Pricing copy */}
            <ScrollReveal direction="right">
              <span className="text-[10px] font-mono text-emerald-400/80 mb-2 block tracking-wider">PRICING</span>
              <h2 className="text-3xl font-bold tracking-tight mb-3 text-foreground">
                Start free, scale as you grow
              </h2>
              <p className="text-muted-foreground/80 mb-6">
                10 free credits included. No credit card required to start.
              </p>
              
              {/* Feature list */}
              <ul className="space-y-2">
                {PRICING_FEATURES.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
            
            {/* Pricing card */}
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

      {/* ========== FINAL CTA SECTION ========== */}
      <section className="relative py-24 border-t border-border/10 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-cyan-500/10 blur-3xl rounded-full" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
          <ScrollReveal direction="scale">
            <div className="text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 text-[10px] font-mono text-cyan-400/80 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-full">
                <Sparkles className="w-3 h-3" />
                START CREATING TODAY
              </div>
              
              {/* Heading */}
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                Ready to bring your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                  words to life?
                </span>
              </h2>
              
              {/* Description */}
              <p className="text-lg text-muted-foreground/80 max-w-xl mx-auto">
                Join creators, developers, and businesses using Neural Speak to generate professional voice content.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/dashboard">
                  <Button className="cursor-pointer h-12 px-8 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/25 hover:scale-105">
                    Start Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button variant="outline" className="cursor-pointer h-12 px-8 border-border/30 hover:border-cyan-500/50 font-medium">
                    <Play className="mr-2 h-4 w-4" />
                    Listen to Samples
                  </Button>
                </Link>
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>10 free credits</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <ScrollReveal direction="fade">
        <footer className="border-t border-border/10 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Footer logo */}
              <Logo size="sm" showText textClass="text-sm font-semibold text-slate-200" />
              
              {/* Footer links */}
              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <Link href="#features" className="hover:text-foreground transition-colors duration-200">Features</Link>
                <Link href="#pricing" className="hover:text-foreground transition-colors duration-200">Pricing</Link>
                <Link href="/dashboard" className="hover:text-foreground transition-colors duration-200">Dashboard</Link>
              </div>
              
              {/* Copyright */}
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
