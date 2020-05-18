import { Slice } from './slice';
import { Exon } from './exon';
import { CDS } from './cds';
import { Source } from './source';
import { Product } from './product';

export type Transcript = {
  type: 'Transcript';
  id: string;
  symbol: string;
  so_term: string; // is there a better name for it?
  biotype?: string; // either this or so_term above need to be removed in the future
  slice: Slice;
  exons: Exon[];
  cds: CDS | null;
  product: Product | null;
  xrefs?: Source[];
};
