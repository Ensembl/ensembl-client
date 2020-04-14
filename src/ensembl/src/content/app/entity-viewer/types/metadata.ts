import { Source } from './source';

export type Metadata = {
  [key: string]: {
    description: string;
    value?: string;
    source_uri?: string;
    source?: Source;
  };
};
