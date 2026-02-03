/**
 * Settings Page Component
 * ========================
 * 
 * User account and security settings page powered by Better Auth UI.
 * Provides pre-built, customizable settings cards for account management
 * and security configuration.
 * 
 * @module app/(dashboard)/dashboard/settings/page
 * 
 * Features:
 * - Account settings (profile info, email, avatar)
 * - Security settings (password change, 2FA, sessions)
 * - Pre-built UI from Better Auth UI library
 * - Loading state with spinner
 * - Authentication guard with redirect
 * 
 * Components Used:
 * - AccountSettingsCards: Profile and account management
 * - SecuritySettingsCards: Password and security options
 * 
 * @see {@link https://github.com/daveyplate/better-auth-ui} - Better Auth UI docs
 */
"use client";

import {
  RedirectToSignIn,
  SecuritySettingsCards,
  SignedIn,
  AccountSettingsCards,
} from "@daveyplate/better-auth-ui";
import { Loader2 } from "lucide-react";
import { authClient } from "~/lib/auth-client";
import { useEffect, useState } from "react";

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * SettingsPage - User account and security settings interface.
 * 
 * Renders Better Auth UI's pre-built settings cards for account
 * and security management. Includes session validation on mount.
 * 
 * @returns {JSX.Element} The settings page UI
 */
export default function SettingPage() {
  /** Loading state for session validation */
  const [isLoading, setIsLoading] = useState(true);
  
  /**
   * Validate user session on component mount.
   * This ensures the user is authenticated before rendering settings.
   */
  useEffect(() => {
    const checkSession = async () => {
      try {
        await authClient.getSession();
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void checkSession();
  }, []);

  // ---------------------------------------------------------------------------
  // Loading State
  // ---------------------------------------------------------------------------
  
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
          <p className="text-sm text-muted-foreground">
            Loading your settings...
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Main Render
  // ---------------------------------------------------------------------------

  return (
    <>
      {/* Redirect unauthenticated users */}
      <RedirectToSignIn />
      
      {/* Only render for authenticated users */}
      <SignedIn>
        <div className="space-y-8">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              Account Settings
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your account preferences and security settings
            </p>
          </div>

          {/* Settings Cards Container */}
          <div className="flex flex-col items-center justify-center gap-6">
            {/* Account management (profile, email, avatar) */}
            <AccountSettingsCards className="w-full max-w-2xl" />
            
            {/* Security settings (password, 2FA, sessions) */}
            <SecuritySettingsCards className="w-full max-w-2xl" />
          </div>
        </div>
      </SignedIn>
    </>
  );
}