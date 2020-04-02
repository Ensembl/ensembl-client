import { ProteinFeature } from './protein-feature';

export type Translation = {
  id: string;
  start: number;
  length: number;
  end: number;
  protein_features: ProteinFeature[];
};
