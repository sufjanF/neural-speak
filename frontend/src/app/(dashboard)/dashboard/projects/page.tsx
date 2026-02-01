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

import { useRouter } from "next/navigation";

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

type SortBy = "newest" | "oldest" | "name";

export default function Projects() {
  const [isLoading, setIsLoading] = useState(true);
  const [audioProjects, setAudioProjects] = useState<AudioProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<AudioProject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const router = useRouter();

  useEffect(() => {
    const initializeProjects = async () => {
      try {
        // Fetch session and projects in parallel
        const [, projectsResult] = await Promise.all([
          authClient.getSession(),
          getUserAudioProjects(),
        ]);

        // Set audio projects
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

  useEffect(() => {
    let filtered = audioProjects.filter((project) =>
      project.text.toLowerCase().includes(searchQuery.toLowerCase()),
    );
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
              <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
                Your Audio Projects
              </h1>
              <p className="text-base text-muted-foreground">
                Manage and organize all your text-to-speech audio (
                {filteredProjects.length}{" "}
                {filteredProjects.length === 1 ? "audio" : "audios"})
              </p>
            </div>
            <Button
              onClick={() => router.push("/dashboard/create")}
              className="gap-2 self-start bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-400 hover:to-fuchsia-400 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/20 sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              New Audio
            </Button>
          </div>
          <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative max-w-md flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search audio projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-border/30 bg-muted/50 pl-9 focus:border-rose-400/40"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="rounded-md border border-border/30 bg-muted/50 px-3 py-2 text-sm text-foreground focus:border-rose-400/40 focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Text A-Z</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {filteredProjects.length === 0 ? (
            <>
              <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="relative mb-6">
                    <div className="flex h-24 w-24 items-center justify-center rounded-sm border-2 border-dashed border-border/30 bg-rose-400/10">
                      <Music className="h-10 w-10 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    {searchQuery ? "No audio found" : "No audio projects yet"}
                  </h3>

                  <p className="mb-6 max-w-md text-sm text-muted-foreground">
                    {searchQuery
                      ? `No audio matches "${searchQuery}". Try adjusting your search terms.`
                      : "Start creating text-to-speech audio to see them here."}
                  </p>
                  {!searchQuery && (
                    <Button
                      onClick={() => router.push("/dashboard/create")}
                      className="gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-400 hover:to-fuchsia-400 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/20"
                    >
                      <Plus className="h-4 w-4" />
                      Create Your First Audio
                    </Button>
                  )}

                  {searchQuery && (
                    <Button
                      variant="outline"
                      onClick={() => setSearchQuery("")}
                      className="gap-2 border-border/30 hover:border-rose-400/30 hover:bg-rose-400/10"
                    >
                      Clear Search
                    </Button>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="group border-border/30 bg-card/50 backdrop-blur-sm transition-all hover:border-rose-400/30"
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border/30 bg-gradient-to-br from-rose-400/10 to-rose-500/10">
                        <Music className="h-8 w-8 text-rose-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="mb-2 line-clamp-2 text-sm text-foreground/80">
                          {project.text}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1 capitalize">
                            <Music className="h-3 w-3" />
                            {project.language}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-2">
                        <audio
                          controls
                          className="w-48"
                          style={{ height: "32px" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <source src={project.audioUrl} type="audio/wav" />
                        </audio>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-rose-400/10 hover:text-rose-400"
                          onClick={(e) =>
                            handleDownload(project.audioUrl, project.name, e)
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                          onClick={(e) => handleDelete(project.id, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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