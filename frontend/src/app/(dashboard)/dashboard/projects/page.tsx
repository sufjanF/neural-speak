/**
 * Projects Page Component
 * ========================
 * 
 * A comprehensive project management interface displaying all user-generated
 * audio projects. Provides search, sort, and filter capabilities along with
 * playback and download functionality.
 * 
 * @module app/(dashboard)/dashboard/projects/page
 * 
 * Features:
 * - Grid display of all audio projects
 * - Real-time search filtering by text content
 * - Sort by newest, oldest, or alphabetical
 * - Inline audio playback with HTML5 audio element
 * - Download functionality for WAV files
 * - Delete projects with confirmation
 * - Empty state with call-to-action
 * 
 * State Management:
 * - audioProjects: Complete list from database
 * - filteredProjects: Filtered/sorted subset for display
 * - searchQuery: Current search term
 * - sortBy: Current sort order ('newest' | 'oldest' | 'name')
 * 
 * @see {@link getUserAudioProjects} - Server action for fetching projects
 * @see {@link deleteAudioProject} - Server action for project deletion
 */
"use client";

import { RedirectToSignIn, SignedIn } from "@daveyplate/better-auth-ui";
import {
  Loader2,
  Search,
  Calendar,
  Music,
  Trash2,
  Download,
  Plus,
} from "lucide-react";
import { authClient } from "~/lib/auth-client";
import { useEffect, useState } from "react";
import { getUserAudioProjects, deleteAudioProject } from "~/actions/tts";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import AudioPlayer from "~/components/ui/audio-player";
import { useRouter } from "next/navigation";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Audio project data structure from database.
 * Represents a single TTS generation with all metadata.
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
 * Available sort options for project listing.
 * @type {'newest' | 'oldest' | 'name'}
 */
type SortBy = "newest" | "oldest" | "name";

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Projects - Audio project management interface.
 * 
 * Displays all user's audio projects with search, sort, and CRUD operations.
 * 
 * @returns {JSX.Element} The projects management UI
 */
export default function Projects() {
  // ---------------------------------------------------------------------------
  // State Management
  // ---------------------------------------------------------------------------
  
  /** Loading state for initial data fetch */
  const [isLoading, setIsLoading] = useState(true);
  
  /** Complete list of user's audio projects */
  const [audioProjects, setAudioProjects] = useState<AudioProject[]>([]);
  
  /** Filtered and sorted projects for display */
  const [filteredProjects, setFilteredProjects] = useState<AudioProject[]>([]);
  
  /** Current search query string */
  const [searchQuery, setSearchQuery] = useState("");
  
  /** Current sort order */
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  
  /** Next.js router for navigation */
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Data Fetching
  // ---------------------------------------------------------------------------

  /**
   * Initialize projects data on component mount.
   * Fetches user session and audio projects in parallel.
   */
  useEffect(() => {
    const initializeProjects = async () => {
      try {
        // Parallel fetch for session validation and project data
        const [, projectsResult] = await Promise.all([
          authClient.getSession(),
          getUserAudioProjects(),
        ]);

        // Update state with fetched projects
        if (projectsResult.success && projectsResult.audioProjects) {
          setAudioProjects(projectsResult.audioProjects);
          setFilteredProjects(projectsResult.audioProjects);
        }
      } catch (error) {
        console.error("Audio projects initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void initializeProjects();
  }, []);

  // ---------------------------------------------------------------------------
  // Filtering & Sorting
  // ---------------------------------------------------------------------------

  /**
   * Apply search filter and sort order whenever dependencies change.
   * Filters by text content and sorts according to selected order.
   */
  useEffect(() => {
    // Filter projects by search query (case-insensitive)
    let filtered = audioProjects.filter((project) =>
      project.text.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    
    // Apply sort order
    switch (sortBy) {
      case "newest":
        filtered = filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "oldest":
        filtered = filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "name":
        filtered = filtered.sort((a, b) => a.text.localeCompare(b.text));
        break;
    }

    setFilteredProjects(filtered);
  }, [audioProjects, searchQuery, sortBy]);

  const handleDelete = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this audio project?")) return;

    const result = await deleteAudioProject(projectId);
    if (result.success) {
      setAudioProjects((prev) => prev.filter((p) => p.id !== projectId));
    }
  };

  const handleDownload = (
    audioUrl: string,
    name: string | null,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    window.open(audioUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
          <p className="text-sm text-muted-foreground">
            Loading your projects...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RedirectToSignIn />
      <SignedIn>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Your Audio Projects
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage and organize your text-to-speech library
                <span className="ml-1 rounded-full bg-violet-500/10 px-2 py-0.5 text-xs font-medium text-violet-400">
                  {filteredProjects.length} {filteredProjects.length === 1 ? "audio" : "audios"}
                </span>
              </p>
            </div>
            <Button
              onClick={() => router.push("/dashboard/create")}
              className="gap-2 self-start gradient-shift text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] sm:self-auto\"
            >
              <Plus className="h-4 w-4" />
              New Audio
            </Button>
          </div>
          <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search audio projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-border/30 bg-muted/50 pl-9 focus:border-violet-400/40"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="w-full rounded-lg border border-border/30 bg-muted/50 px-3 py-2 text-sm text-foreground focus:border-violet-400/40 focus:outline-none sm:w-auto"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Text A-Z</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {filteredProjects.length === 0 ? (
            <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center px-4 py-12 text-center sm:py-16">
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-28 w-28 animate-pulse rounded-2xl bg-gradient-to-br from-violet-400/10 to-fuchsia-500/10"></div>
                  </div>
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-border/30 bg-card/50">
                    <Music className="h-10 w-10 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground sm:text-xl">
                  {searchQuery ? "No audio found" : "No audio projects yet"}
                </h3>

                <p className="mb-6 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {searchQuery
                    ? `No audio matches "${searchQuery}". Try adjusting your search terms.`
                    : "Start creating text-to-speech audio to see them here."}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => router.push("/dashboard/create")}
                    className="gap-2 gradient-shift text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                  >
                    <Plus className="h-4 w-4" />
                    Create Your First Audio
                  </Button>
                )}

                {searchQuery && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery("")}
                    className="gap-2 border-border/30 hover:border-violet-400/30 hover:bg-violet-400/10"
                  >
                    Clear Search
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="group border-border/30 bg-card/50 backdrop-blur-sm transition-all hover:border-violet-400/30 hover:shadow-lg hover:shadow-violet-500/5"
                  >
                    <CardContent className="p-4">
                      {/* Top section: Icon, text, and metadata */}
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/30 bg-gradient-to-br from-violet-400/10 to-fuchsia-500/10 sm:h-14 sm:w-14">
                          <Music className="h-6 w-6 text-violet-400 sm:h-7 sm:w-7" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="mb-2 line-clamp-2 text-sm leading-relaxed text-foreground/90">
                            {project.text}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(project.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1 rounded-full bg-violet-500/10 px-2 py-0.5 text-violet-400">
                              {project.language.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Bottom section: Audio player and actions */}
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="w-full sm:flex-1 sm:max-w-lg" onClick={(e) => e.stopPropagation()}>
                          <AudioPlayer src={project.audioUrl} />
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 gap-1.5 border-border/30 px-3 text-xs hover:border-violet-400/40 hover:bg-violet-400/10 hover:text-violet-300"
                            onClick={(e) =>
                              handleDownload(project.audioUrl, project.name, e)
                            }
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Download</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 gap-1.5 border-border/30 px-3 text-xs text-destructive hover:border-destructive/40 hover:bg-destructive/10"
                            onClick={(e) => handleDelete(project.id, e)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </SignedIn>
    </>
  );
}