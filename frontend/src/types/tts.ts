/** Generated audio project stored in the database */
export interface GeneratedAudio {
  s3_key: string;
  audioUrl: string;
  text: string;
  language: string;
  timestamp: Date;
  voiceName?: string;
  exaggeration?: number;
  cfgWeight?: number;
}

/** Voice file reference for TTS generation */
export interface VoiceFile {
  name: string;
  s3_key: string;
}

/** User-uploaded voice sample with metadata */
export interface UploadedVoice {
  id: string;
  name: string;
  s3Key: string;
  url: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Supported language for TTS generation */
export interface Language {
  code: string;
  name: string;
  flag: string;
}