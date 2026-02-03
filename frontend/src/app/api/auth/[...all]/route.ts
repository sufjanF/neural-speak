/**
 * Better Auth API Route Handler
 * ==============================
 * 
 * This catch-all API route handles all authentication-related HTTP requests
 * for the Better Auth library. It processes sign-in, sign-up, sign-out,
 * session management, and OAuth callbacks.
 * 
 * @module app/api/auth/[...all]/route
 * 
 * Route Pattern: /api/auth/*
 * 
 * Handled Endpoints:
 * - POST /api/auth/sign-in     → Email/password authentication
 * - POST /api/auth/sign-up     → New user registration
 * - POST /api/auth/sign-out    → Session termination
 * - GET  /api/auth/session     → Session validation
 * - POST /api/auth/callback/*  → OAuth provider callbacks
 * 
 * The toNextJsHandler utility converts Better Auth's handler into
 * Next.js App Router compatible GET and POST exports.
 * 
 * @see {@link https://www.better-auth.com/docs/integrations/next}
 */

import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "~/lib/auth";

// =============================================================================
// ROUTE HANDLERS
// =============================================================================

/**
 * Export GET and POST handlers for all auth-related API routes.
 * The catch-all route [...all] ensures all auth endpoints are handled.
 */
export const { POST, GET } = toNextJsHandler(auth);