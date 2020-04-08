export type Video = {
  title: string;
  description?: string;
  uri: string;
  previousVideo?: Video;
  nextVideo?: Video;
};
