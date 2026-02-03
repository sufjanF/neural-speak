/**
 * @fileoverview Customer Portal Redirect Component
 * @module components/sidebar/CustomerPortalRedirect
 * 
 * @description
 * Client component that handles automatic redirection to the Polar.sh customer
 * portal. When mounted, it initiates a redirect to the customer portal where
 * users can manage their subscriptions, billing information, and payment methods.
 * 
 * @requires lucide-react - For loading spinner icon
 * @requires react - For useEffect hook
 * @requires ~/lib/auth-client - For authClient portal method
 * 
 * @example
 * // Typically rendered as a standalone page
 * // /dashboard/customer-portal/page.tsx
 * export default function CustomerPortalPage() {
 *   return <CustomerPortalRedirect />;
 * }
 */
"use client";

import { Loader2 } from 'lucide-react';
import { useEffect } from "react";
import { authClient } from "~/lib/auth-client";

/**
 * CustomerPortalRedirect - Polar.sh customer portal redirect handler
 * 
 * Displays a loading spinner while automatically redirecting the user to
 * their customer portal. Uses Better Auth's customer portal integration
 * with Polar.sh for subscription and billing management.
 * 
 * @component
 * @returns {React.JSX.Element} Loading spinner UI while redirect is processed
 * 
 * @remarks
 * - Executes redirect on mount via useEffect
 * - Non-cancellable redirect (fire-and-forget pattern)
 * - User sees loading state until browser navigates away
 * 
 * @see {@link https://www.polar.sh/docs|Polar.sh Documentation}
 * @see {@link https://better-auth.com/|Better Auth Documentation}
 */
export default function CustomerPortalRedirect(): React.JSX.Element {
  useEffect(() => {
    /**
     * Initiates redirect to Polar.sh customer portal.
     * Uses Better Auth's integrated customer management API.
     */
    const portal = async (): Promise<void> => {
      await authClient.customer.portal();
    };

    // Fire-and-forget pattern - redirect happens automatically
    void portal();
  }, []);

  // Loading UI displayed during redirect process
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated loading spinner */}
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-muted-foreground text-sm">
          Loading your customer portal...
        </p>
      </div>
    </div>
  );
}