import { Strand } from './strand';
import { Exon } from './exon';
import { CDS } from './cds';

export type Transcript = {
  type: 'Transcript';
  id: string;
  symbol: string;
  so_term: string; // is there a better name for it?
  slice: {
    location: {
      start: number;
      end: number;
      // length: number,
    };
    region: {
      name: string;
      strand: {
        code: Strand;
      };
    };
  };
  exons: Exon[];
  cds: CDS | null;
};
