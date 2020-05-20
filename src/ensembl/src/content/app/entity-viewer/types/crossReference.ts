import { Source } from './source';

export type CrossReference = {
  id: string;
  name: string;
  description: string;
  url: string;
  source: Source;
};
