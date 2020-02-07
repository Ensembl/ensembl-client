import { Strand } from './strand';
import { Transcript } from './transcript';

export type Gene = {
  type: 'Gene';
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
  transcripts: Transcript[];
};
