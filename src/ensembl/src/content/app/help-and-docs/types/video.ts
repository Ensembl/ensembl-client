export type Video = {
  title: string;
  description?: string;
  embed_url: string;
  embed_html: string;
  previousVideo?: Video;
  nextVideo?: Video;
};
