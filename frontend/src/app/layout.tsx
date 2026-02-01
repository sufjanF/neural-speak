import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Neural Speak",
  description: "AI-powered text-to-speech synthesis",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-display",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmPlexMono.variable}`}>
      <body>{children}
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
