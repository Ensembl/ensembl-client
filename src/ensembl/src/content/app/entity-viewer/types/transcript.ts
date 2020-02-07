import { Strand } from './strand';
import { Exon } from './exon';

// temporary type; modelled after the way data is currently stored
export type Transcript = {
  type: 'Transcript';
  id: string;
  name: string; // or is it symbol?
  so_term: string; // is there a better name for it?
  slice: {
    location: {
      start: number;
      end: number;
      // length: number,
    };
    region: {
      name: string;
      strand: Strand;
    };
  };
  exons: Exon[];
};
