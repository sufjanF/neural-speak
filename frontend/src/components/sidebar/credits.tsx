/**
 * @fileoverview User Credits Display Component
 * @module components/sidebar/credits
 * 
 * @description
 * Server component that fetches and displays the user's current credit balance
 * in the sidebar. Credits are the application's currency for generating TTS audio.
 * Features animated hover states for enhanced user engagement.
 * 
 * @requires lucide-react - For Coins and Sparkles icons
 * @requires ~/actions/tts - For getUserCredits server action
 * 
 * @example
 * // Typically used in the sidebar footer
 * <SidebarFooter>
 *   <Credits />
 *   <Upgrade />
 * </SidebarFooter>
 */
import { Coins, Sparkles } from "lucide-react";
import { getUserCredits } from "~/actions/tts";

/**
 * Credits - Server-side credit balance display
 * 
 * Asynchronously fetches the user's credit balance and renders a compact
 * display widget with animated hover effects. Gracefully handles fetch
 * failures by displaying 0 credits.
 * 
 * @async
 * @component
 * @returns {Promise<React.JSX.Element>} The credits display widget
 * 
 * @remarks
 * - Server Component: Fetches data at request time
 * - Hover animations: Sparkle effect and color transitions
 * - Graceful degradation: Shows 0 on fetch failure
 */
export default async function Credits(): Promise<React.JSX.Element> {
  // Fetch user's current credit balance from the server
  const result = await getUserCredits();
  const credits = result.success ? result.credits : 0;

  return (
    <div className="group flex items-center gap-1.5 rounded-sm border border-border/20 bg-card/50 px-2.5 py-1.5 transition-all duration-200 hover:border-border/40">
      <div className="flex items-center gap-1.5">
        {/* Animated coin icon with sparkle overlay */}
        <div className="relative">
          <Coins className="h-3.5 w-3.5 text-emerald-400 transition-colors duration-200 group-hover:text-emerald-300" />
          {/* Sparkle appears on hover for visual delight */}
          <Sparkles className="absolute -right-1 -top-1 h-2 w-2 text-emerald-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        </div>
        {/* Credit count and label */}
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