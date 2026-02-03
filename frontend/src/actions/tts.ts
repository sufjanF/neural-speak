/**
 * TTS Server Actions Module
 * =========================
 * 
 * This module provides server-side actions for the Neural Speak text-to-speech
 * functionality. It handles the complete lifecycle of TTS generation including
 * authentication, credit management, API communication, and data persistence.
 * 
 * @module actions/tts
 * 
 * Key Features:
 * - Secure speech generation with user authentication
 * - Credit-based usage system (1 credit per 100 characters)
 * - Integration with Modal TTS backend API
 * - Automatic audio project persistence to database
 * - Cached data fetching for optimal performance
 * 
 * Architecture:
 * - Uses Next.js Server Actions for secure server-side execution
 * - Communicates with Modal's GPU-powered TTS service
 * - Stores generated audio in AWS S3
 * - Persists project metadata in PostgreSQL via Prisma
 * 
 * @example
 * // Generate speech from client component
 * const result = await generateSpeech({
 *   text: "Hello, world!",
 *   voice_S3_key: "samples/voices/Michael.wav",
 *   language: "en",
 *   exaggeration: 0.5,
 *   cfg_weight: 0.5
 * });
 */

"use server";

import { headers } from "next/headers";
import { cache } from "react";
import { env } from "~/env";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Input parameters for speech generation.
 * 
 * @interface GenerateSpeechData
 * @property {string} text - The text content to convert to speech (max 5000 chars)
 * @property {string} voice_S3_key - S3 key of the voice sample to use for generation
 * @property {string} language - ISO 639-1 language code (e.g., 'en', 'es', 'ja')
 * @property {number} exaggeration - Emotional intensity level (0.0 to 1.0)
 * @property {number} cfg_weight - Classifier-free guidance weight for pacing control
 */
interface GenerateSpeechData {
  text: string;
  voice_S3_key: string;
  language: string;
  exaggeration: number;
  cfg_weight: number;
}

/**
 * Result object returned from speech generation.
 * 
 * @interface GenerateSpeechResult
 * @property {boolean} success - Whether the generation completed successfully
 * @property {string} [s3_key] - S3 object key of the generated audio file
 * @property {string} [audioUrl] - Full public URL to access the audio file
 * @property {string} [projectId] - Database ID of the created audio project
 * @property {string} [error] - Error message if generation failed
 */
interface GenerateSpeechResult {
  success: boolean;
  s3_key?: string;
  audioUrl?: string;
  projectId?: string;
  error?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Base URL for the S3 bucket containing generated audio files */
const S3_BUCKET_URL = "https://neural-speak-sufjan.s3.us-east-2.amazonaws.com";

// =============================================================================
// SERVER ACTIONS
// =============================================================================

/**
 * Generate speech audio from text using the Modal TTS backend.
 * 
 * This is the primary server action for TTS generation. It performs the following:
 * 1. Validates user authentication and session
 * 2. Validates required input parameters
 * 3. Checks user credit balance against required credits
 * 4. Calls the Modal TTS API with generation parameters
 * 5. Deducts credits from user account
 * 6. Persists the audio project to the database
 * 
 * @async
 * @function generateSpeech
 * @param {GenerateSpeechData} data - The speech generation parameters
 * @returns {Promise<GenerateSpeechResult>} Result object with audio URL or error
 * 
 * @example
 * const result = await generateSpeech({
 *   text: "Welcome to Neural Speak!",
 *   voice_S3_key: "samples/voices/Michael.wav",
 *   language: "en",
 *   exaggeration: 0.6,
 *   cfg_weight: 0.5
 * });
 * 
 * if (result.success) {
 *   console.log("Audio URL:", result.audioUrl);
 * }
 */
export async function generateSpeech(data: GenerateSpeechData): Promise<GenerateSpeechResult> {
  try {
    // Authenticate user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate required input fields
    if (!data.text || !data.voice_S3_key || !data.language) {
      return { success: false, error: "Missing required fields" };
    }

    // Calculate credits needed based on text length (1 credit per 100 characters, minimum 1)
    const creditsNeeded = Math.max(1, Math.ceil(data.text.length / 100));

    // Fetch current user credit balance
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Verify sufficient credit balance
    if (user.credits < creditsNeeded) {
      return {
        success: false,
        error: `Insufficient credits. Need ${creditsNeeded}, have ${user.credits}`,
      };
    }

    // Call Modal TTS API with authenticated request
    const response = await fetch(env.MODAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Modal-Key": env.MODAL_API_KEY,
        "Modal-Secret": env.MODAL_API_SECRET,
      },
      body: JSON.stringify({
        text: data.text,
        voice_s3_key: data.voice_S3_key,
        language: data.language,
        exaggeration: data.exaggeration ?? 0.5,
        cfg_weight: data.cfg_weight ?? 0.5,
      }),
    });

    if (!response.ok) {
      return { success: false, error: "Failed to generate speech" };
    }

    // Parse API response and construct audio URL
    const result = (await response.json()) as { s3_Key: string };
    const audioUrl = `${S3_BUCKET_URL}/${result.s3_Key}`;

    // Deduct credits from user account atomically
    await db.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: creditsNeeded } },
    });

    // Create audio project record in database for history tracking
    const audioProject = await db.audioProject.create({
      data: {
        text: data.text,
        audioUrl,
        s3Key: result.s3_Key,
        language: data.language,
        voiceS3key: data.voice_S3_key,
        exaggeration: data.exaggeration,
        cfgWeight: data.cfg_weight,
        userId: session.user.id,
      },
    });

    return {
      success: true,
      s3_key: result.s3_Key,
      audioUrl,
      projectId: audioProject.id,
    };
  } catch (error) {
    console.error("Speech generation error:", error);
    return { success: false, error: "Internal server error" };
  }
}

/**
 * Fetch all audio projects for the authenticated user.
 * 
 * This function is cached using React's cache() to prevent redundant
 * database queries during a single request lifecycle.
 * 
 * @async
 * @function getUserAudioProjects
 * @returns {Promise<{success: boolean, audioProjects?: AudioProject[], error?: string}>}
 *          Object containing success status and array of audio projects
 * 
 * @example
 * const { success, audioProjects } = await getUserAudioProjects();
 * if (success) {
 *   audioProjects.forEach(project => console.log(project.text));
 * }
 */
export const getUserAudioProjects = cache(async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Fetch all projects for user, ordered by most recent first
    const audioProjects = await db.audioProject.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, audioProjects };
  } catch (error) {
    console.error("Error fetching audio projects:", error);
    return { success: false, error: "Failed to fetch audio projects" };
  }
});

/**
 * Fetch the current credit balance for the authenticated user.
 * 
 * This function is cached to optimize repeated credit checks
 * within the same request cycle.
 * 
 * @async
 * @function getUserCredits
 * @returns {Promise<{success: boolean, credits: number, error?: string}>}
 *          Object containing success status and credit count
 * 
 * @example
 * const { success, credits } = await getUserCredits();
 * console.log(`You have ${credits} credits remaining`);
 */
export const getUserCredits = cache(async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized", credits: 0 };
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    if (!user) {
      return { success: false, error: "User not found", credits: 0 };
    }

    return { success: true, credits: user.credits };
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return { success: false, error: "Failed to fetch credits", credits: 0 };
  }
});

/**
 * Delete an audio project by ID.
 * 
 * Verifies that the requesting user owns the project before deletion.
 * Note: This only removes the database record; S3 cleanup is handled separately.
 * 
 * @async
 * @function deleteAudioProject
 * @param {string} id - The unique identifier of the audio project to delete
 * @returns {Promise<{success: boolean, error?: string}>} Result of deletion operation
 * 
 * @example
 * const result = await deleteAudioProject("clxyz123...");
 * if (result.success) {
 *   console.log("Project deleted successfully");
 * }
 */
export async function deleteAudioProject(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Fetch project to verify ownership
    const project = await db.audioProject.findUnique({
      where: { id },
    });

    // Ensure project exists and belongs to the requesting user
    if (project?.userId !== session.user.id) {
      return { success: false, error: "Not found or unauthorized" };
    }

    // Perform deletion
    await db.audioProject.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting audio project:", error);
    return { success: false, error: "Failed to delete audio project" };
  }
}