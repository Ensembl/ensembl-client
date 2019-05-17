import { TrackPanelCategory } from 'src/content/app/browser/track-panel/trackPanelConfig';

export type Assembly = {
  name: string;
  patch: string;
};

export enum Strand {
  FORWARD = 'forward',
  REVERSE = 'reverse'
}

export type AssociatedObject = {
  obj_symbol?: string;
  obj_type: string;
  selected_info: string;
  spliced_length: number;
  stable_id: string;
};

export type EnsObjectInfo = {
  assembly: Assembly;
  associated_object: AssociatedObject;
  bio_type: string;
  obj_symbol: string;
  obj_type: string;
  spliced_length: number;
  stable_id: string;
  strand: Strand;
};

export type EnsObject = {
  object_info: EnsObjectInfo;
  track_categories: TrackPanelCategory[];
};
