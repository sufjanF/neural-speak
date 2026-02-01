import { Coins, Sparkles } from "lucide-react";
import { getUserCredits } from "~/actions/tts";

export default async function Credits() {
  const result = await getUserCredits();
  const credits = result.success ? result.credits : 0;
  return (
    <div className="group flex items-center gap-1.5 rounded-sm border border-border/20 bg-card/50 px-2.5 py-1.5 transition-all duration-200 hover:border-border/40">
      <div className="flex items-center gap-1.5">
        <div className="relative">
          <Coins className="h-3.5 w-3.5 text-emerald-400 transition-colors duration-200 group-hover:text-emerald-300" />
          <Sparkles className="absolute -right-1 -top-1 h-2 w-2 text-emerald-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-foreground transition-colors duration-200 group-hover:text-emerald-400">
            {credits}
          </span>
          <span className="text-[10px] leading-tight text-muted-foreground">
            Credits
          </span>
        </div>
      </div>
    </div>
  );
}