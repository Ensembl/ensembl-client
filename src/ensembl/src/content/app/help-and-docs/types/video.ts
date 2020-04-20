export type Video = {
  title: string;
  description?: string;
  youtube_url: string;
  previous_video?: Video;
  next_video?: Video;
};
