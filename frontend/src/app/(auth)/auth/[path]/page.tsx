/**
 * Dynamic Authentication Page
 * ===========================
 * 
 * This page handles all authentication views (sign-in, sign-up, forgot-password,
 * reset-password, etc.) using a dynamic route segment. The Better Auth UI library
 * provides pre-built, customizable authentication forms.
 * 
 * @module app/(auth)/auth/[path]/page
 * 
 * Route Pattern: /auth/[path]
 * - /auth/sign-in      → Sign in form
 * - /auth/sign-up      → Registration form
 * - /auth/forgot-password → Password recovery
 * - /auth/reset-password  → Password reset with token
 * 
 * Static Generation:
 * - Uses generateStaticParams to pre-render all auth pages at build time
 * - dynamicParams = false ensures only known paths are valid
 * 
 * @see {@link https://github.com/daveyplate/better-auth-ui}
 */

import { AuthView } from "@daveyplate/better-auth-ui";
import { authViewPaths } from "@daveyplate/better-auth-ui/server";

// =============================================================================
// STATIC GENERATION CONFIG
// =============================================================================

/** Disable dynamic params - only allow pre-defined auth paths */
export const dynamicParams = false;

/**
 * Generate static params for all authentication view paths.
 * This enables static generation of auth pages at build time.
 * 
 * @returns {Array<{path: string}>} Array of path objects for static generation
 */
export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

/**
 * AuthPage - Dynamic authentication page component.
 * 
 * Renders the appropriate authentication form based on the URL path.
 * After successful authentication, redirects to the dashboard.
 * 
 * @param {Object} props - Page props from Next.js
 * @param {Promise<{path: string}>} props.params - Dynamic route parameters
 * @returns {Promise<JSX.Element>} The authentication view component
 */
export default async function AuthPage({ 
  params 
}: { 
  params: Promise<{ path: string }> 
}) {
  const { path } = await params;

  return (
    <main className="container flex grow flex-col items-center justify-center self-center p-4 md:p-6">
      <AuthView path={path} redirectTo="/dashboard" />
    </main>
  );
}