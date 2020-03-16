import { Slice } from './slice';
import { Transcript } from './transcript';

export type Gene = {
  type: 'Gene';
  id: string;
  symbol: string;
  so_term: string; // is there a better name for it?
  slice: Slice;
  transcripts: Transcript[];
};
