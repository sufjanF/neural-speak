/**
 * Custom Audio Player Component
 * ==============================
 * 
 * A fully customizable audio player with modern styling that replaces the
 * browser's native audio controls. Features a gradient play button, progress
 * bar with scrubbing, time display, and volume controls.
 * 
 * @module components/ui/audio-player
 * 
 * Features:
 * - Animated gradient play/pause button
 * - Draggable progress bar with visual scrubber
 * - Time display (current time and duration)
 * - Volume slider with mute toggle (desktop only)
 * - Fully keyboard accessible
 * - Responsive design (volume hidden on mobile)
 * 
 * @example
 * // Basic usage
 * <AudioPlayer src="/audio/sample.wav" />
 * 
 * // With ref for programmatic control
 * const audioRef = useRef<AudioPlayerRef>(null);
 * <AudioPlayer ref={audioRef} src={audioUrl} onEnded={() => console.log('done')} />
 * audioRef.current?.play();
 */
"use client";

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "~/lib/utils";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Props for the AudioPlayer component.
 * 
 * @interface AudioPlayerProps
 * @property {string} src - URL of the audio file to play
 * @property {string} [className] - Additional CSS classes for the container
 * @property {function} [onPlay] - Callback when audio starts playing
 * @property {function} [onPause] - Callback when audio is paused
 * @property {function} [onEnded] - Callback when audio finishes playing
 */
interface AudioPlayerProps {
  src: string;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

/**
 * Ref interface for programmatic control of the audio player.
 * 
 * @interface AudioPlayerRef
 * @property {function} play - Start playback (returns Promise)
 * @property {function} pause - Pause playback
 * @property {function} load - Reload the audio source
 */
export interface AudioPlayerRef {
  play: () => Promise<void>;
  pause: () => void;
  load: () => void;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * AudioPlayer - Custom styled audio player component.
 * 
 * Provides a modern, accessible audio player with play/pause controls,
 * progress scrubbing, time display, and volume controls.
 * 
 * @param {AudioPlayerProps} props - Component props
 * @param {React.Ref<AudioPlayerRef>} ref - Forwarded ref for external control
 * @returns {JSX.Element} The audio player UI
 */
const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(
  ({ src, className, onPlay, onPause, onEnded }, ref) => {
    // -------------------------------------------------------------------------
    // Refs
    // -------------------------------------------------------------------------
    
    /** Reference to the hidden HTML audio element */
    const audioRef = useRef<HTMLAudioElement>(null);
    
    /** Reference to the progress bar for click position calculation */
    const progressRef = useRef<HTMLDivElement>(null);
    
    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------
    
    /** Whether audio is currently playing */
    const [isPlaying, setIsPlaying] = useState(false);
    
    /** Current playback position in seconds */
    const [currentTime, setCurrentTime] = useState(0);
    
    /** Total duration of the audio in seconds */
    const [duration, setDuration] = useState(0);
    
    /** Volume level (0 to 1) */
    const [volume, setVolume] = useState(1);
    
    /** Whether audio is muted */
    const [isMuted, setIsMuted] = useState(false);
    
    /** Whether user is dragging the progress scrubber */
    const [isDragging, setIsDragging] = useState(false);

    // -------------------------------------------------------------------------
    // Imperative Handle (for ref control)
    // -------------------------------------------------------------------------
    
    useImperativeHandle(ref, () => ({
      play: async () => {
        try {
          await audioRef.current?.play();
        } catch (error) {
          console.error("Playback failed:", error);
        }
      },
      pause: () => {
        audioRef.current?.pause();
      },
      load: () => {
        audioRef.current?.load();
      },
    }));

    // -------------------------------------------------------------------------
    // Audio Event Listeners
    // -------------------------------------------------------------------------

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const handleTimeUpdate = () => {
        if (!isDragging) {
          setCurrentTime(audio.currentTime);
        }
      };

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        onEnded?.();
      };

      const handlePlay = () => {
        setIsPlaying(true);
        onPlay?.();
      };

      const handlePause = () => {
        setIsPlaying(false);
        onPause?.();
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
      };
    }, [isDragging, onEnded, onPlay, onPause]);

    // -------------------------------------------------------------------------
    // Helper Functions
    // -------------------------------------------------------------------------

    /**
     * Format seconds into MM:SS display string
     * @param {number} time - Time in seconds
     * @returns {string} Formatted time string (e.g., "2:05")
     */
    const formatTime = (time: number) => {
      if (isNaN(time)) return "0:00";
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    /** Toggle play/pause state */
    const togglePlay = () => {
      if (!audioRef.current) return;
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        void audioRef.current.play();
      }
    };

    /** Toggle mute state */
    const toggleMute = () => {
      if (!audioRef.current) return;
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      audioRef.current.muted = newMuted;
    };

    /** Handle volume slider changes */
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
      if (newVolume === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    };

    /** Handle click on progress bar to seek */
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || !audioRef.current) return;
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    };

    /** Handle progress bar drag for seeking */
    const handleProgressDrag = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging || !progressRef.current || !audioRef.current) return;
      const rect = progressRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newTime = percent * duration;
      setCurrentTime(newTime);
    };

    /** Finalize drag operation and update audio position */
    const handleDragEnd = () => {
      if (isDragging && audioRef.current) {
        audioRef.current.currentTime = currentTime;
      }
      setIsDragging(false);
    };

    // -------------------------------------------------------------------------
    // Global Mouse Event Handling for Drag
    // -------------------------------------------------------------------------

    useEffect(() => {
      if (isDragging) {
        const handleMouseMove = (e: MouseEvent) => {
          if (!progressRef.current || !audioRef.current) return;
          const rect = progressRef.current.getBoundingClientRect();
          const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          const newTime = percent * duration;
          setCurrentTime(newTime);
        };

        const handleMouseUp = () => {
          if (audioRef.current) {
            audioRef.current.currentTime = currentTime;
          }
          setIsDragging(false);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener("mouseup", handleMouseUp);
        };
      }
    }, [isDragging, currentTime, duration]);

    // -------------------------------------------------------------------------
    // Computed Values
    // -------------------------------------------------------------------------

    /** Progress percentage for the progress bar (0-100) */
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    // -------------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------------

    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl bg-gradient-to-r from-slate-800/90 to-slate-900/90 px-3 py-2.5 shadow-lg backdrop-blur-sm border border-white/5",
          className
        )}
      >
        <audio ref={audioRef} src={src} preload="metadata" />
        
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full gradient-shift text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" fill="currentColor" />
          ) : (
            <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
          )}
        </button>

        {/* Time Display */}
        <span className="w-10 shrink-0 text-xs font-medium tabular-nums text-slate-300">
          {formatTime(currentTime)}
        </span>

        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="relative h-1.5 flex-1 cursor-pointer rounded-full bg-slate-700/80"
          onClick={handleProgressClick}
          onMouseDown={() => setIsDragging(true)}
          onMouseMove={handleProgressDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          {/* Buffered/Background */}
          <div className="absolute inset-0 rounded-full bg-slate-600/50" />
          
          {/* Progress Fill */}
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
          
          {/* Scrubber Handle */}
          <div
            className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white bg-gradient-to-br from-violet-400 to-fuchsia-400 shadow-md transition-all duration-75 hover:scale-110"
            style={{ left: `calc(${progress}% - 7px)` }}
          />
        </div>

        {/* Duration */}
        <span className="w-10 shrink-0 text-xs font-medium tabular-nums text-slate-400">
          {formatTime(duration)}
        </span>

        {/* Volume Control */}
        <div className="hidden items-center gap-2 sm:flex">
          <button
            onClick={toggleMute}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-slate-200"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
          <div className="relative h-1 w-16">
            {/* Background track */}
            <div className="absolute inset-0 rounded-full bg-slate-700" />
            {/* Filled track */}
            <div 
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400"
              style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
            />
            {/* Invisible range input for interaction */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-violet-400/50"
            />
          </div>
        </div>
      </div>
    );
  }
);

AudioPlayer.displayName = "AudioPlayer";

export default AudioPlayer;
