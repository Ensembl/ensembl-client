import JSONValue from 'src/shared/types/JSON';
import { Slice } from './slice';
import { Transcript } from './transcript';
import { ExternalLink } from './externalLink';
import { Source } from './source';
import { Metadata } from './Metadata';

export type Gene = {
  type: 'Gene';
  id: string;
  symbol: string;
  source?: Source;
  so_term: string; // is there a better name for it?
  slice: Slice;
  transcripts: Transcript[];
  synonyms?: string[];
  attributes?: string[];
  metadata?: Metadata;
  function?: {
    description: string;
    source: Source;
  };
  xrefs?: ExternalLink[];
  filters?: {
    [key: string]: JSONValue;
  };
};
