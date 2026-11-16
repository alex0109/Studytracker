// Same shape as backend MaterialVideoDto
export interface IVideoSegment {
  // Second of the video the line starts at
  start: number;
  text: string;
}

export interface IMaterialVideo {
  videoId: string;
  language: string;
  segments: IVideoSegment[];
  // Only the first half hour of a longer video has subtitles
  isClipped: boolean;
  updatedAt: string;
}
