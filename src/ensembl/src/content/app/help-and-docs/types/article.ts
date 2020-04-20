import { Video } from './video';

export type Article = {
  title: string;
  body: string;
  parent?: Article;
  previous_rticle?: Article;
  next_article?: Article;
  related_video?: Video;
};
