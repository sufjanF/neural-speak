/**
 * Application Providers Component
 * ================================
 * 
 * Root provider component that wraps the application with necessary
 * context providers. Currently configures the Better Auth UI provider
 * for authentication state management.
 * 
 * @module components/providers
 * 
 * Providers Included:
 * - AuthUIProvider: Manages authentication state and UI components
 * 
 * Configuration:
 * - authClient: The Better Auth client instance for API communication
 * - navigate: Next.js router.push for programmatic navigation
 * - replace: Next.js router.replace for navigation without history
 * - onSessionChange: Callback that refreshes router cache on auth changes
 * - Link: Next.js Link component for client-side navigation
 * 
 * Usage:
 * Wrap your application or layout with this component to enable
 * authentication features throughout the component tree.
 * 
 * @example
 * // In layout.tsx
 * export default function Layout({ children }) {
 *   return <Providers>{children}</Providers>
 * }
 */
"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { authClient } from "~/lib/auth-client";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Props for the Providers component.
 * 
 * @interface ProvidersProps
 * @property {ReactNode} children - Child components to wrap with providers
 */
interface ProvidersProps {
  children: ReactNode;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Providers - Root provider wrapper for the application.
 * 
 * Configures authentication context and provides necessary hooks
 * and utilities to child components. Must be used as a client component
 * since it uses the useRouter hook.
 * 
 * @param {ProvidersProps} props - Component props
 * @returns {JSX.Element} Children wrapped with providers
 */
export function Providers({ children }: ProvidersProps) {
  const router = useRouter();
  
  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={(path: string) => router.push(path)}
      replace={(path: string) => router.replace(path)}
      onSessionChange={() => {
        // Refresh router cache when session changes to update protected routes
        router.refresh();
      }}
      Link={Link}
    >
      {children}
    </AuthUIProvider>
  );
}