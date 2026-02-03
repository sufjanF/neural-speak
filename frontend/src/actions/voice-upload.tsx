/**
 * Voice Upload Server Actions Module
 * ===================================
 * 
 * This module handles secure voice sample uploads for the Neural Speak voice
 * cloning feature. Users can upload audio samples that are stored in AWS S3
 * and used as reference voices for TTS generation.
 * 
 * @module actions/voice-upload
 * 
 * Key Features:
 * - Secure file upload with authentication validation
 * - AWS S3 integration for cloud storage
 * - Automatic signed URL generation for secure access
 * - Database persistence for voice metadata
 * - File type and size validation
 * 
 * Security:
 * - All uploads require authenticated user session
 * - Files are stored in user-specific S3 paths
 * - Signed URLs expire after 7 days
 * - Maximum file size enforced (10MB)
 * 
 * @example
 * // Upload a voice sample
 * const formData = new FormData();
 * formData.append("voice", audioFile);
 * const result = await uploadVoice(formData);
 */

"use server";

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { cache } from "react";
import { auth } from "~/lib/auth";
import { headers } from "next/headers";
import { env } from "~/env";
import { db } from "~/server/db";

// =============================================================================
// AWS S3 CLIENT CONFIGURATION
// =============================================================================

/**
 * Configured AWS S3 client for voice file storage operations.
 * Uses credentials from environment variables for secure access.
 */
const s3Client = new S3Client({
  region: env.AWS_REGION ?? "us-east-2",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Result object returned from voice upload operations.
 * 
 * @interface UploadVoiceResult
 * @property {boolean} success - Whether the upload completed successfully
 * @property {string} [id] - Database ID of the uploaded voice record
 * @property {string} [s3Key] - S3 object key for the uploaded file
 * @property {string} [url] - Pre-signed URL for accessing the uploaded file
 * @property {string} [error] - Error message if upload failed
 */
interface UploadVoiceResult {
  success: boolean;
  id?: string;
  s3Key?: string;
  url?: string;
  error?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Maximum allowed file size for voice uploads (10MB) */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Duration for signed URL validity (7 days in seconds) */
const SIGNED_URL_EXPIRY = 3600 * 24 * 7;

// =============================================================================
// SERVER ACTIONS
// =============================================================================

/**
 * Upload a voice sample file to S3 and save metadata to database.
 * 
 * This server action handles the complete voice upload workflow:
 * 1. Validates user authentication
 * 2. Validates AWS configuration
 * 3. Validates file type (must be audio/*) and size (<10MB)
 * 4. Uploads file to S3 with user-specific path
 * 5. Generates pre-signed URL for secure access
 * 6. Creates database record with voice metadata
 * 
 * @async
 * @function uploadVoice
 * @param {FormData} formData - Form data containing the voice file under key "voice"
 * @returns {Promise<UploadVoiceResult>} Result object with upload details or error
 * 
 * @example
 * const formData = new FormData();
 * formData.append("voice", audioFile);
 * 
 * const result = await uploadVoice(formData);
 * if (result.success) {
 *   console.log("Voice uploaded:", result.s3Key);
 * }
 * 
 * @throws Will catch and return errors, never throws directly
 */
export async function uploadVoice(formData: FormData): Promise<UploadVoiceResult> {
  try {
    // Validate user authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate AWS S3 configuration
    if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY || !env.AWS_S3_BUCKET_NAME) {
      return { success: false, error: "AWS S3 not configured" };
    }

    // Extract and validate the uploaded file
    const file = formData.get("voice") as File;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Ensure file is an audio format
    if (!file.type.startsWith("audio/")) {
      return { success: false, error: "File must be audio" };
    }

    // Enforce maximum file size limit
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "File must be under 10MB" };
    }

    // Generate unique filename with user-specific path
    const fileExtension = file.name.split(".").pop();
    const fileName = `voices/${session.user.id}/${Date.now()}.${fileExtension}`;

    // Upload file to S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET_NAME ?? "",
        Key: fileName,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: file.type,
      }),
    );

    // Generate pre-signed URL for secure file access
    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: env.AWS_S3_BUCKET_NAME ?? "",
        Key: fileName,
      }),
      { expiresIn: SIGNED_URL_EXPIRY },
    );

    // Create database record for the uploaded voice
    const uploadedVoice = await db.uploadedVoice.create({
      data: {
        name: file.name,
        s3Key: fileName,
        url: signedUrl,
        userId: session.user.id,
      },
    });

    return {
      success: true,
      id: uploadedVoice.id,
      s3Key: fileName,
      url: signedUrl,
    };
  } catch (error) {
    console.error("Voice upload error:", error);
    return { success: false, error: "Failed to upload voice file" };
  }
}

/**
 * Fetch all uploaded voices for the authenticated user.
 * 
 * This function is cached using React's cache() to optimize repeated
 * calls within the same request lifecycle.
 * 
 * @async
 * @function getUserUploadedVoices
 * @returns {Promise<{success: boolean, voices: UploadedVoice[], error?: string}>}
 *          Object containing success status and array of uploaded voices
 * 
 * @example
 * const { success, voices } = await getUserUploadedVoices();
 * if (success) {
 *   voices.forEach(voice => console.log(voice.name));
 * }
 */
export const getUserUploadedVoices = cache(async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized", voices: [] };
    }

    // Fetch all voices for user, ordered by most recent first
    const uploadedVoices = await db.uploadedVoice.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, voices: uploadedVoices };
  } catch (error) {
    console.error("Error fetching uploaded voices:", error);
    return {
      success: false,
      error: "Failed to fetch uploaded voices",
      voices: [],
    };
  }
});