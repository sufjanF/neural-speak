import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Sparkles,
  Zap,
  ArrowRight,
  Scissors,
  Expand,
  Target,
  Download,
  CheckCircle2,
  Play,
} from "lucide-react";
import Link from "next/link";
import DemoSection from "~/components/demo-section";
export default function HomePage() {
  const features = [
    {
      icon: <Scissors className="h-8 w-8" />,
      title: "Voice Cloning",
      description:
        "Create custom AI voices by cloning your own voice or using pre-built professional voices.",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      icon: <Expand className="h-8 w-8" />,
      title: "Natural Speech Synthesis",
      description:
        "Convert text to speech with lifelike intonation, emotion, and natural-sounding voices.",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Multiple Languages & Voices",
      description:
        "Access hundreds of voices in multiple languages with regional accents and speaking styles.",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description:
        "Generate high-quality speech in seconds with serverless GPU infrastructure.",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];


  const pricingFeatures = [
    "Voice Cloning",
    "Natural Speech Synthesis",
    "Multiple Languages & Voices",
    "High-Quality Audio Downloads",
    "Fast Processing",
    "Cloud Storage",
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100">
      <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-slate-50/95 backdrop-blur supports-[backdrop-filter]:bg-slate-50/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-xl font-bold text-transparent">
                Neural Speak
              </span>
            </div>
            <div className="hidden items-center space-x-8 md:flex">
              <Link
                href="#features"
                className="text-slate-600 transition-colors hover:text-indigo-600"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-slate-600 transition-colors hover:text-indigo-600"
              >
                Pricing
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/sign-in">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm" className="cursor-pointer gap-2">
                  Try Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-indigo-100/30 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span className="font-medium text-indigo-700">
                Powered by Advanced AI
              </span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-800 sm:text-6xl">
              Transform Text into{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                Natural Speech
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600 sm:text-xl">
              Convert text to speech with multiple languages, voice cloning,
              and natural intonation. Fast processing, high quality output.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="cursor-pointer gap-2 px-8 py-6 text-base"
                >
                  <Play className="h-5 w-5" />
                  Try It Free Now
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="cursor-pointer gap-2 px-8 py-6 text-base"
                >
                  <Play className="h-5 w-5" />
                  Listen to Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <DemoSection />
      <section id="features" className="bg-white py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              Powerful AI Voices at Your{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                Fingertips
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Everything you need to generate speech from text
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-slate-200 bg-white/70 backdrop-blur-sm transition-all hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div
                    className={`${feature.bgColor} mb-4 inline-flex items-center justify-center rounded-lg p-3 ${feature.color}`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-800">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {feature.description}
                  </p>
                </CardContent>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-slate-50 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              Simple. Fast. Professional.
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Get professional results in three simple steps
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Enter Your Text",
                description:
                  "Type or paste your text content. We support multiple languages and handle complex formatting.",
              },
              {
                step: "02",
                title: "Choose Your Voice",
                description:
                  "Select from hundreds of AI voices: clone your own voice, choose pre-built professional voices, or customize settings.",
              },
              {
                step: "03",
                title: "Generate & Download",
                description:
                  "Get your natural-sounding speech in seconds. High-quality audio ready for any use case.",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="mb-4 flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-cyan-600 text-lg font-bold text-white shadow-lg">
                    {item.step}
                  </div>
                  {index < 2 && (
                    <div className="ml-4 hidden h-0.5 w-full bg-slate-300 md:block" />
                  )}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-800">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="bg-gradient-to-br from-slate-50 to-indigo-50/50 py-20 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              Start Creating{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                For Free
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              No credit card required. Begin transforming your text into speech
              instantly.
            </p>
          </div>
          <div className="mx-auto max-w-lg">
            <Card className="relative overflow-hidden border-2 border-indigo-300 bg-white/70 backdrop-blur-sm">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-cyan-600 px-4 py-1 text-sm font-medium text-white">
                Free to Start
              </div>
              <CardContent className="p-8">
                <div className="mb-8 text-center">
                  <h3 className="text-2xl font-bold text-slate-800">
                    Free Plan
                  </h3>
                  <div className="mt-4 flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-slate-800">
                      $0
                    </span>
                    <span className="ml-2 text-slate-600">to start</span>
                  </div>
                  <p className="mt-2 text-slate-600">
                    Try all features with free credits
                  </p>
                </div>
                <ul className="mb-8 space-y-4">
                  {pricingFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-500" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard">
                  <Button
                    className="w-full cursor-pointer gap-2 bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700"
                    size="lg"
                  >
                    <Sparkles className="h-4 w-4" />
                    Try It Free Now
                  </Button>
                  <p className="mt-4 text-center text-xs text-slate-500">
                    Includes 10 free credits • No credit card required
                  </p>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="bg-gradient-to-r from-indigo-100/70 to-cyan-100/70 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              Ready to Transform Your Text?
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Convert text to natural speech in seconds. Free to start.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="cursor-pointer gap-2 bg-gradient-to-r from-indigo-500 to-cyan-600 px-8 py-6 text-base hover:from-indigo-600 hover:to-cyan-700"
                >
                  <Sparkles className="h-5 w-5" />
                  Try It Free Now
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="cursor-pointer gap-2 border-slate-300 px-8 py-6 text-base text-slate-700 hover:bg-slate-100"
                >
                  <Download className="h-5 w-5" />
                  Listen to Examples
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-slate-200 bg-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-16">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="md:col-span-2">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-600 shadow-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-xl font-bold text-transparent">
                    Neural Speak
                  </span>
                </div>
                <p className="max-w-md text-slate-600">
                  Text-to-speech synthesis. Multiple languages, voice cloning,
                  fast processing.
                </p>
              </div>
              <div>
                <h3 className="mb-4 font-semibold text-slate-800">Product</h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li>
                    <Link
                      href="#features"
                      className="transition-colors hover:text-indigo-600"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#pricing"
                      className="transition-colors hover:text-indigo-600"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="transition-colors hover:text-indigo-600"
                    >
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 font-semibold text-slate-800">Support</h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li>
                    <Link
                      href="mailto:support@aivoicestudio.com"
                      className="transition-colors hover:text-indigo-600"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/settings"
                      className="transition-colors hover:text-indigo-600"
                    >
                      Account Settings
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-16 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
              <p>&copy; 2025 Neural Speak. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}