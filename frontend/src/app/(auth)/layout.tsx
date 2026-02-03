/**
 * Authentication Layout Component
 * ================================
 * 
 * A split-screen authentication layout that provides a premium,
 * branded experience for sign-in, sign-up, and password reset flows.
 * 
 * @module app/(auth)/layout
 * 
 * Design:
 * - Left panel: Branded experience with animated gradients and feature highlights
 * - Right panel: Clean authentication form container
 * - Responsive: Full-width form on mobile, split-screen on desktop (lg+)
 * 
 * Visual Elements:
 * - Animated gradient orbs with staggered pulse animations
 * - Grid pattern overlay for depth
 * - Feature cards showcasing key product capabilities
 * - Gradient accent border at bottom
 * 
 * This layout wraps all routes under the (auth) route group,
 * providing consistent branding across authentication flows.
 * 
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/route-groups}
 */

import type { ReactNode } from "react";
import { Providers } from "~/components/providers";
import { Mic, Zap, Globe2, Sparkles } from "lucide-react";
import Link from "next/link";
import { Logo } from "~/components/ui/logo";

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Feature highlights displayed on the branded left panel.
 * Each feature includes an icon, title, description, and color scheme.
 */
const AUTH_FEATURES = [
  {
    icon: Mic,
    title: "Voice Cloning",
    desc: "Clone any voice with just 30 seconds of audio",
    color: "from-rose-500/20 to-rose-500/5 border-rose-500/20 text-rose-400",
  },
  {
    icon: Globe2,
    title: "24 Languages",
    desc: "Generate natural speech in multiple languages",
    color: "from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400",
  },
  {
    icon: Zap,
    title: "Studio Quality",
    desc: "Broadcast-ready audio with natural prosody",
    color: "from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-400",
  },
] as const;

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <div className="auth-page flex min-h-screen">
        {/* Left Panel - Branded Experience */}
        <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden bg-slate-950">
          {/* Layered background effects */}
          <div className="absolute inset-0">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
            
            {/* Animated gradient orbs */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/3 -right-32 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute -bottom-32 left-1/4 w-72 h-72 bg-rose-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            
            {/* Grid pattern overlay */}
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '60px 60px'
              }}
            />
            
            {/* Top fade */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-950 to-transparent" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col h-full px-12 xl:px-16 py-12">
            {/* Logo */}
            <Link href="/" className="group inline-flex w-fit">
              <Logo size="lg" showText textClass="text-2xl font-bold text-white" />
            </Link>
            
            {/* Main hero content - centered */}
            <div className="flex-1 flex flex-col justify-center max-w-lg">
              <div className="space-y-6">
                {/* Tagline badge */}
                <div className="inline-flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 text-violet-400" />
                  AI-POWERED VOICE SYNTHESIS
                </div>
                
                {/* Hero heading */}
                <h1 className="text-4xl xl:text-5xl font-bold leading-[1.15] text-white">
                  Transform text into{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400">
                    lifelike speech
                  </span>
                </h1>
                
                {/* Subtitle */}
                <p className="text-lg text-slate-400 leading-relaxed">
                  Professional voice cloning and text-to-speech synthesis. 
                  Create broadcast-quality audio in seconds.
                </p>
              </div>
              
              {/* Feature cards */}
              <div className="mt-10 space-y-3">
                {AUTH_FEATURES.map((feature, i) => (
                  <div 
                    key={i}
                    className={`group flex items-center gap-4 p-4 rounded-xl border bg-gradient-to-r ${feature.color} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900/50">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                      <p className="text-xs text-slate-400">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className="flex flex-1 flex-col bg-background">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-border/20">
            <Link href="/" className="group">
              <Logo size="md" showText textClass="text-lg font-semibold text-foreground" />
            </Link>
          </div>
          
          {/* Form container - centered */}
          <div className="flex-1 flex flex-col justify-center px-6 py-10 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              {/* Auth form content */}
              <div>{children}</div>

              {/* Footer link */}
              <p className="mt-8 text-center text-sm text-muted-foreground">
                <Link
                  href="/"
                  className="font-medium text-violet-500 hover:text-violet-400 transition-colors"
                >
                  ← Back to homepage
                </Link>
              </p>
            </div>
          </div>
          
          {/* Bottom border accent */}
          <div className="h-1 bg-gradient-to-r from-violet-500/50 via-fuchsia-500/50 to-violet-500/50" />
        </div>
      </div>
    </Providers>
  );
}