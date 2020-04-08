import { Slice } from './slice';
import { Exon } from './exon';
import { CDS } from './cds';
import { Source } from './source';

export type Transcript = {
  type: 'Transcript';
  id: string;
  symbol: string;
  so_term?: string; // is there a better name for it?
  biotype?: string;
  slice: Slice;
  exons: Exon[];
  cds: CDS | null;
  xrefs?: Source[];
};
