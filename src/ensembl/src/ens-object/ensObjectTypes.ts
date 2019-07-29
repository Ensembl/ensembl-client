export type EnsObjectLocation = {
  chromosome: string;
  end: number;
  start: number;
};

export type EnsObject = {
  bio_type: string | null;
  label: string;
  object_id: string;
  genome_id: string;
  location: EnsObjectLocation;
  object_type: string;
  stable_id: string | null;
  strand: string | null;
  description: string | null;
  track: EnsObjectTrack | null;
};

export type EnsObjectTrack = {
  additional_info?: string;
  child_tracks?: EnsObjectTrack[];
  colour?: string;
  label: string;
  ensembl_object_id?: string;
  support_level?: string | null;
  track_id: string;
  description: string | null;
};

/*
TODO: discuss with BE whether they want to put ensObject data inside
a root-level namespace key, so the response type becomes:
{
  ens_object: EnsObject
}
*/
export type EnsObjectResponse = EnsObject;
