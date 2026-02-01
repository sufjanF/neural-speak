import type { ReactNode } from "react";
import { Providers } from "~/components/providers";
import { AudioWaveform, Mic, Zap, Target } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <div className="auth-page flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 lg:flex lg:w-1/2">
          <div className="bg-grid-white/[0.02] absolute inset-0 bg-[size:30px_30px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/50" />
          
          {/* Animated background orbs */}
          <div className="animate-float absolute right-20 top-20 h-32 w-32 rounded-full bg-rose-500/15 blur-3xl" />
          <div className="animate-float-delayed absolute bottom-20 right-32 h-24 w-24 rounded-full bg-amber-500/12 blur-2xl" />
          <div className="animate-float absolute right-10 top-1/2 h-16 w-16 rounded-full bg-emerald-500/10 blur-xl" />
          
          <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
            {/* Logo */}
            <Link
              href="/"
              className="mb-10 flex cursor-pointer items-center gap-2.5"
            >
              <div className="gradient-shift flex h-11 w-11 items-center justify-center rounded-xl shadow-lg shadow-cyan-500/20">
                <AudioWaveform className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                Neural Speak
              </span>
            </Link>

            {/* Hero Content */}
            <div className="max-w-md">
              <h1 className="mb-5 text-4xl font-bold leading-tight text-white xl:text-5xl">
                Your words,{" "}
                <span className="text-gradient">any voice</span>
              </h1>
              <p className="mb-6 text-lg leading-relaxed text-slate-300">
                Clone voices, synthesize speech in 24 languages, and deliver broadcast-quality audio.
              </p>

              {/* Feature List */}
              <div className="space-y-3">
                {[
                  {
                    icon: Mic,
                    text: "Voice Cloning",
                    color:
                      "bg-rose-500/20 border-rose-500/30 text-rose-400",
                  },
                  {
                    icon: Zap,
                    text: "Instant Processing",
                    color: "bg-amber-500/20 border-amber-500/30 text-amber-400",
                  },
                  {
                    icon: Target,
                    text: "Studio Quality",
                    color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-sm border backdrop-blur-sm ${feature.color}`}
                    >
                      <feature.icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-slate-200">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex flex-1 flex-col justify-center bg-background px-6 py-10 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            {/* Mobile Logo */}
            <div className="mb-6 text-center lg:hidden">
              <Link
                href="/"
                className="inline-flex cursor-pointer items-center gap-2"
              >
                <div className="gradient-shift flex h-10 w-10 items-center justify-center rounded-sm">
                  <AudioWaveform className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  Neural Speak
                </span>
              </Link>
            </div>

            {/* Auth Form Container */}
            <div>{children}</div>

            {/* Footer Link */}
            <p className="mt-5 text-center text-sm text-muted-foreground">
              Back to{" "}
              <Link
                href="/"
                className="cursor-pointer font-medium text-cyan-500 transition-colors hover:text-cyan-400"
              >
                homepage
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Providers>
  );
}