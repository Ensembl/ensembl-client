export type Video = {
  title: string;
  description?: string;
  embedUrl: string;
  embedHtml?: string;
  previousVideo?: Video;
  nextVideo?: Video;
};
