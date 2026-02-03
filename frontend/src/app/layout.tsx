/**
 * Root Layout Component
 * ======================
 * 
 * This is the root layout for the Neural Speak application. It establishes
 * the foundational HTML structure, global styles, font configurations,
 * and application-wide providers.
 * 
 * @module app/layout
 * 
 * Architecture:
 * - Wraps all pages with consistent HTML structure
 * - Configures custom Google Fonts (Inter + IBM Plex Mono)
 * - Sets up global toast notification system
 * - Provides SEO metadata for the application
 * 
 * Typography:
 * - Inter: Primary display font for headings and body text
 * - IBM Plex Mono: Monospace font for code and technical content
 * 
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts}
 */

import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { Toaster } from "sonner";

// =============================================================================
// SEO METADATA CONFIGURATION
// =============================================================================

/**
 * Application-wide metadata for SEO and browser tab display.
 * Configures the page title, description, and favicon.
 */
export const metadata: Metadata = {
  title: "Neural Speak",
  description: "AI-powered text-to-speech synthesis",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

// =============================================================================
// FONT CONFIGURATION
// =============================================================================

/**
 * Inter font configuration for display text.
 * Used for headings, body text, and UI elements.
 * Available via CSS variable --font-display.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-display",
});

/**
 * IBM Plex Mono font configuration for monospace text.
 * Used for code snippets, technical content, and badges.
 * Available via CSS variable --font-mono.
 */
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

// =============================================================================
// ROOT LAYOUT COMPONENT
// =============================================================================

/**
 * RootLayout - The top-level layout wrapper for all pages.
 * 
 * This component:
 * - Sets the HTML lang attribute for accessibility
 * - Applies font CSS variables to the document
 * - Renders the global toast notification system
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child page content to render
 * @returns {JSX.Element} The root HTML structure
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmPlexMono.variable}`}>
      <body>
        {children}
        {/* Global toast notification system with dark theme styling */}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: 'oklch(0.28 0.012 260)',
              border: '1px solid oklch(0.40 0.01 260 / 0.5)',
              color: 'oklch(0.95 0.005 260)',
            },
          }}
        />
      </body>
    </html>
  );
}
