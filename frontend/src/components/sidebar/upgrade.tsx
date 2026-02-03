/**
 * @fileoverview Subscription Upgrade Button Component
 * @module components/sidebar/upgrade
 * 
 * @description
 * Client component that renders an animated upgrade button for initiating
 * the Polar.sh checkout flow. Displays available subscription tiers and
 * handles payment flow integration through Better Auth.
 * 
 * @requires ~/lib/auth-client - For authClient checkout method
 * @requires ../ui/button - For Button component
 * @requires lucide-react - For Crown and Sparkles icons
 * 
 * @example
 * // Used in sidebar footer alongside credits display
 * <SidebarFooter>
 *   <Credits />
 *   <Upgrade />
 * </SidebarFooter>
 */
"use client";

import { authClient } from "~/lib/auth-client";
import { Button } from "../ui/button";
import { Crown, Sparkles } from "lucide-react";

/**
 * Polar.sh product IDs for available subscription tiers.
 * These IDs correspond to different credit packages/plans.
 * 
 * @constant {string[]}
 * @see {@link https://polar.sh/|Polar.sh Dashboard} for product management
 */
const POLAR_PRODUCT_IDS = [
  "1f4845d1-6550-4163-9e86-814913d357ed", // Tier 1
  "10806cf4-e388-49b5-8c34-d22e01e943a3", // Tier 2
  "da30ecbb-73f5-4245-ae4a-8a6db24ff312", // Tier 3
] as const;

/**
 * Upgrade - Subscription checkout trigger button
 * 
 * Renders a visually prominent upgrade button with gradient styling and
 * animated hover effects. Clicking initiates the Polar.sh checkout flow
 * displaying all available subscription products.
 * 
 * @component
 * @returns {React.JSX.Element} Animated upgrade button
 * 
 * @remarks
 * - Payment Integration: Uses Better Auth's Polar.sh integration
 * - Visual Design: Gradient background with glow effect on hover
 * - Animations: Crown rotation and sparkle fade-in on hover
 * 
 * @see {@link https://www.polar.sh/docs|Polar.sh Checkout Documentation}
 */
export default function Upgrade(): React.JSX.Element {
  /**
   * Initiates the Polar.sh checkout flow with available products.
   * Opens checkout modal/page displaying subscription options.
   * 
   * @async
   */
  const upgrade = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await authClient.checkout({
      products: [...POLAR_PRODUCT_IDS],
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
        {/* Crown icon with rotation animation on hover */}
        <Crown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12" />
        <span className="text-xs font-medium">Upgrade</span>
        {/* Sparkles appear on hover for visual delight */}
        <Sparkles className="h-2.5 w-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Subtle glow overlay effect on hover */}
      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-violet-400/20 to-fuchsia-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Button>
  );
}