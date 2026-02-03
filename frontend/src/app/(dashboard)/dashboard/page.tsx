/**
 * Dashboard Home Page Component
 * ==============================
 * 
 * The main dashboard view that serves as the user's home screen after login.
 * Displays personalized statistics, quick action buttons, and recent audio
 * projects to provide an overview of their TTS workspace.
 * 
 * @module app/(dashboard)/dashboard/page
 * 
 * Features:
 * - Personalized welcome message with user's name
 * - Statistics grid showing total projects, monthly/weekly activity
 * - Quick action cards for common tasks
 * - Recent audio projects list with inline playback
 * - Loading state with spinner animation
 * 
 * Data Flow:
 * 1. Component mounts and shows loading spinner
 * 2. Parallel fetch of user session and audio projects
 * 3. Calculate statistics from project data
 * 4. Render dashboard with fetched data
 * 
 * Authentication:
 * - Uses RedirectToSignIn for unauthenticated users
 * - SignedIn wrapper ensures content only shows for logged-in users
 * 
 * @see {@link getUserAudioProjects} - Server action for fetching projects
 * @see {@link authClient} - Authentication client for session management
 */
"use client";

import { RedirectToSignIn, SignedIn } from "@daveyplate/better-auth-ui";
import {
  Loader2,
  Sparkles,
  Calendar,
  TrendingUp,
  Star,
  ArrowRight,
  Music,
  Mic,
  Settings,
} from "lucide-react";
import { authClient } from "~/lib/auth-client";
import { useEffect, useState } from "react";
import { getUserAudioProjects } from "~/actions/tts";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Represents a single audio project with all associated metadata.
 * 
 * @interface AudioProject
 * @property {string} id - Unique identifier for the project
 * @property {string | null} name - Optional user-defined project name
 * @property {string} text - The input text that was converted to speech
 * @property {string} audioUrl - Public URL to access the generated audio
 * @property {string} s3Key - S3 object key for the audio file
 * @property {string} language - ISO language code used for generation
 * @property {string} voiceS3key - S3 key of the voice sample used
 * @property {number} exaggeration - Emotional intensity setting (0-1)
 * @property {number} cfgWeight - Classifier-free guidance weight (0-1)
 * @property {string} userId - ID of the user who created the project
 * @property {Date} createdAt - Timestamp when project was created
 * @property {Date} updatedAt - Timestamp of last modification
 */
interface AudioProject {
  id: string;
  name: string | null;
  text: string;
  audioUrl: string;
  s3Key: string;
  language: string;
  voiceS3key: string;
  exaggeration: number;
  cfgWeight: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Aggregated statistics calculated from user's audio projects.
 * 
 * @interface UserStats
 * @property {number} totalAudioProjects - Total count of all projects
 * @property {number} thisMonth - Projects created in current month
 * @property {number} thisWeek - Projects created in last 7 days
 */
interface UserStats {
  totalAudioProjects: number;
  thisMonth: number;
  thisWeek: number;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Calculate user statistics from an array of audio projects.
 * 
 * Computes total count and time-based activity metrics by filtering
 * projects based on their creation timestamps.
 * 
 * @param {AudioProject[]} audios - Array of user's audio projects
 * @returns {UserStats} Computed statistics object
 * 
 * @example
 * const stats = calculateStats(audioProjects);
 * console.log(`Created ${stats.thisWeek} projects this week`);
 */
function calculateStats(audios: AudioProject[]): UserStats {
  const now = new Date();
  // First day of current month
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  // 7 days ago from now
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return {
    totalAudioProjects: audios.length,
    thisMonth: audios.filter((p) => new Date(p.createdAt) >= thisMonth).length,
    thisWeek: audios.filter((p) => new Date(p.createdAt) >= thisWeek).length,
  };
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Dashboard - Main user dashboard displaying stats and recent projects.
 * 
 * This client component serves as the home page for authenticated users.
 * It fetches user data and audio projects on mount, then renders a
 * comprehensive overview of the user's TTS workspace.
 * 
 * @returns {JSX.Element} The dashboard UI with stats and project list
 */
export default function Dashboard() {
  // ---------------------------------------------------------------------------
  // State Management
  // ---------------------------------------------------------------------------
  
  /** Loading state for initial data fetch */
  const [isLoading, setIsLoading] = useState(true);
  
  /** Array of user's audio projects */
  const [audioProjects, setAudioProjects] = useState<AudioProject[]>([]);
  
  /** Computed statistics from audio projects */
  const [userStats, setUserStats] = useState<UserStats>({
    totalAudioProjects: 0,
    thisMonth: 0,
    thisWeek: 0,
  });
  
  /** Current user information from session */
  const [user, setUser] = useState<{
    name?: string;
    createdAt?: string | Date;
  } | null>(null);
  
  /** Next.js router for programmatic navigation */
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Data Fetching
  // ---------------------------------------------------------------------------
  
  /**
   * Initialize dashboard data on component mount.
   * Fetches user session and audio projects in parallel for efficiency.
   */
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Parallel fetch for optimal loading time
        const [sessionResult, audioResult] = await Promise.all([
          authClient.getSession(),
          getUserAudioProjects(),
        ]);

        // Update user state from session
        if (sessionResult?.data?.user) {
          setUser(sessionResult.data.user);
        }

        // Update audio projects state
        if (audioResult.success && audioResult.audioProjects) {
          setAudioProjects(audioResult.audioProjects);
        }

        // Calculate and update statistics
        const audios = audioResult.audioProjects ?? [];
        setUserStats(calculateStats(audios));
      } catch (error) {
        console.error("Dashboard initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void initializeDashboard();
  }, []);

  // ---------------------------------------------------------------------------
  // Loading State
  // ---------------------------------------------------------------------------
  
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
          <p className="text-sm text-muted-foreground">
            Loading your dashboard...
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
      {/* Redirect unauthenticated users to sign-in */}
      <RedirectToSignIn />
      
      {/* Only render content for authenticated users */}
      <SignedIn>
        <div className="space-y-5">
          {/* Welcome Header */}
          <div className="space-y-1.5">
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Welcome back{user?.name ? `, ${user.name}` : ""}!
            </h1>
            <p className="text-sm text-muted-foreground">
              Here&apos;s an overview of your Text-to-Speech workspace
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="relative overflow-hidden border-border/20 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-border/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Total Audio
                </CardTitle>
                <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-rose-500/10">
                  <Music className="h-3.5 w-3.5 text-rose-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-foreground">
                  {userStats.totalAudioProjects}
                </div>
                <p className="text-xs text-muted-foreground">TTS generations</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-border/20 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-border/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  This Month
                </CardTitle>
                <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-amber-500/10">
                  <Calendar className="h-3.5 w-3.5 text-amber-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-foreground">
                  {userStats.thisMonth}
                </div>
                <p className="text-xs text-muted-foreground">
                  Projects created
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-border/20 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-border/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">This Week</CardTitle>
                <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-emerald-500/10">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-foreground">
                  {userStats.thisWeek}
                </div>
                <p className="text-xs text-muted-foreground">Recent activity</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-border/20 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-border/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Member Since
                </CardTitle>
                <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-violet-500/10">
                  <Star className="h-3.5 w-3.5 text-violet-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-foreground">
                  {user?.createdAt
                    ? new Date(
                        user.createdAt as string | number | Date,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">Account created</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border-border/20 bg-card/40 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="h-4 w-4 text-violet-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Button
                  onClick={() => router.push("/dashboard/create")}
                  className="group h-auto flex-col gap-2 gradient-shift p-5 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                >
                  <Mic className="h-7 w-7 transition-transform group-hover:scale-110" />
                  <div className="text-center">
                    <div className="text-sm font-semibold">Text-to-Speech</div>
                    <div className="text-xs opacity-80">
                      Generate audio with voice cloning
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => router.push("/dashboard/projects")}
                  variant="outline"
                  className="group h-auto flex-col gap-2 border-border/20 bg-card/50 p-5 transition-all duration-200 hover:border-amber-500/30 hover:bg-accent"
                >
                  <Music className="h-7 w-7 text-muted-foreground transition-transform group-hover:scale-110 group-hover:text-amber-400" />
                  <div className="text-center">
                    <div className="text-sm font-semibold text-foreground">View All Audio</div>
                    <div className="text-xs text-muted-foreground">
                      Browse your audio library
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => router.push("/dashboard/settings")}
                  variant="outline"
                  className="group h-auto flex-col gap-2 border-border/20 bg-card/50 p-5 transition-all duration-200 hover:border-emerald-500/30 hover:bg-accent"
                >
                  <Settings className="h-7 w-7 text-muted-foreground transition-transform group-hover:scale-110 group-hover:text-emerald-400" />
                  <div className="text-center">
                    <div className="text-sm font-semibold text-foreground">Account Settings</div>
                    <div className="text-xs text-muted-foreground">
                      Manage your profile
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Audio Projects */}
          <Card className="border-border/20 bg-card/40 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Music className="h-4 w-4 text-rose-400" />
                Recent Audio Projects
              </CardTitle>
              {audioProjects.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/dashboard/projects")}
                  className="text-violet-400 hover:bg-violet-500/10 hover:text-violet-300"
                >
                  View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {audioProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="relative mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-sm border-2 border-dashed border-border/20 bg-muted/20">
                      <Music className="h-7 w-7 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="mb-1.5 text-base font-semibold text-foreground">
                    No audio projects yet
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Start generating speech with AI voice cloning
                  </p>
                  <Button
                    onClick={() => router.push("/dashboard/create")}
                    className="gap-2 gradient-shift text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                  >
                    <Mic className="h-4 w-4" />
                    Create Your First Audio
                  </Button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {audioProjects.slice(0, 5).map((audio) => (
                    <div
                      key={audio.id}
                      className="group flex items-center gap-3 rounded-sm border border-border/20 bg-muted/10 p-3 transition-all duration-200 hover:border-violet-500/20 hover:bg-muted/20"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm gradient-shift">
                        <Music className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-medium text-foreground">
                          {audio.name ??
                            audio.text.substring(0, 50) +
                              (audio.text.length > 50 ? "..." : "")}
                        </h4>
                        <div className="mt-0.5 flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">
                            {audio.language.toUpperCase()}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            •
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {new Date(audio.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <audio
                          src={audio.audioUrl}
                          controls
                          className="h-8"
                          style={{ width: "180px" }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SignedIn>
    </>
  );
}