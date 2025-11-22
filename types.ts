export interface ImageState {
  file: File | null;
  previewUrl: string | null;
  base64: string | null;
}

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export type GenerationMode = 'standard' | 'gesture';

export interface GenerationConfig {
  prompt: string;
  aspectRatio: AspectRatio;
}

export interface GeneratedResult {
  imageUrl: string | null;
  text: string | null;
}