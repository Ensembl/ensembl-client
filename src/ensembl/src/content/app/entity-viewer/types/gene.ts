import JSONValue from 'src/shared/types/JSON';
import { Slice } from './slice';
import { Transcript, TranscriptFromLookup } from './transcript';
import { ExternalLink } from './externalLink';
import { Source } from './source';
import { Metadata } from './metadata';

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

export type GeneFromLookup = Pick<
  Gene,
  'id' | 'type' | 'symbol' | 'so_term' | 'slice'
> & {
  transcripts: TranscriptFromLookup[];
};
