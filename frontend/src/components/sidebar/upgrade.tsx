"use client";

import { authClient } from "~/lib/auth-client";
import { Button } from "../ui/button";
import { Crown, Sparkles } from "lucide-react";

export default function Upgrade() {
  const upgrade = async () => {
    await authClient.checkout({
      products: [
        "1f4845d1-6550-4163-9e86-814913d357ed",
        "10806cf4-e388-49b5-8c34-d22e01e943a3",
        "da30ecbb-73f5-4245-ae4a-8a6db24ff312",
      ],
    });
  };
  return (
    <Button
      variant="outline"
      size="sm"
      className="group relative ml-2 h-8 overflow-hidden border-violet-500/30 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/5 text-violet-400 transition-all duration-300 hover:border-violet-400 hover:gradient-shift hover:text-white"
      onClick={upgrade}
    >
      <div className="flex items-center gap-1.5">
        <Crown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12" />
        <span className="text-xs font-medium">Upgrade</span>
        <Sparkles className="h-2.5 w-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-violet-400/20 to-fuchsia-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Button>
  );
}