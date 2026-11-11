// Same names as the backend
export type PodcastStatus = "Generating" | "Ready" | "Failed";
export type PodcastSpeaker = "Host" | "Guest";

export interface IPodcastLine {
  speaker: PodcastSpeaker;
  text: string;
}

// The material first (no note), then one chapter per note
export interface IPodcastChapter {
  title: string;
  noteId?: string | null;
  startSeconds: number;
  durationSeconds: number;
  lines: IPodcastLine[];
}

export interface IPodcast {
  id: string;
  status: PodcastStatus;
  language: string;
  chapters: IPodcastChapter[];
  durationSeconds: number;
  // A short-lived link to the MP3, only when it is ready
  audioUrl?: string | null;
  isContentTruncated: boolean;
  createdAt: string;
  completedAt?: string | null;
}
