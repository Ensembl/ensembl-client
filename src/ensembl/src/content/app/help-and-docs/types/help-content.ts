import { Article } from '../types/article';
import { Video } from '../types/video';

export type HelpContent = {
  componentId: string;
  article: Article;
  video?: Video;
};
