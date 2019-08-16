import { EnsObjectTrack } from 'src/ens-object/ensObjectTypes';
import { TrackSet } from 'src/content/app/browser/track-panel/trackPanelConfig';

export type GenomeInfo = {
  genome_id: string;
  reference_genome_id: string | null;
  common_name: string;
  assembly_name: string;
  scientific_name: string;
  example_objects: string[];
};

export type GenomeInfoData = {
  [key: string]: GenomeInfo;
};

export type GenomeTrackCategory = {
  label: string;
  track_category_id: string;
  track_list: EnsObjectTrack[];
  types: TrackSet[];
};

export type GenomeInfoResponse = {
  genome_info: GenomeInfo[];
};

export type GenomeTrackCategories = {
  [genomeId: string]: GenomeTrackCategory[];
};

export enum GenomeKaryotypeType {
  CHROMOSOME = 'chromosome'
}

export type GenomeKaryotype = {
  is_chromosome: boolean;
  is_circular: boolean;
  length: number;
  name: string;
  type: GenomeKaryotypeType;
};
