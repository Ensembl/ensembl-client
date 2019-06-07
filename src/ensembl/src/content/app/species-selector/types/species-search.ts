// description of shape of data returned from the api

export type SearchMatches = SearchMatch[];

export type SearchMatch = {
  genome_id: string; // unique identifier (down to the assembly level)
  reference_genome_id: string | null; // if present, indicates that the match is a strain (or some other subspecies group) of the reference species
  common_name: string | null; // not every species has a common name
  scientific_name: string; // every species has a scientific name
  assembly_name: string; // display name of the assembly associated with this genome_id
  matched_substrings: MatchedSubstring[];
};

export type SearchMatchGroup = {
  title?: string;
  matches: SearchMatch[];
};

export type MatchedSubstring = {
  length: number;
  offset: number;
  match: MatchedFieldName;
};

export enum MatchedFieldName {
  COMMON_NAME = 'common_name',
  SCIENTIFIC_NAME = 'scientific_name',
  ASSEMBLY_NAME = 'assembly_name'
}

export type Strain = {
  genome_id: string;
  display_name: string;
};

export type Assembly = {
  genome_id: string;
  assembly_name: string;
};

export type CommittedItem = {
  genome_id: string;
  reference_genome_id: string | null; // because in Species Selector we need to keep track of how many strains of the same species are selected
  common_name: string | null;
  scientific_name: string;
  assembly_name: string;
  isEnabled: boolean;
};

export type PopularSpecies = {
  genome_id: string;
  reference_genome_id: string | null;
  common_name: string | null;
  scientific_name: string;
  assembly_name: string; // notice in mockups that every popular species has an assembly
  image: string; // link to the svg or base64-encoded svg
  division_ids: string[]; // e.g. ['model_organism', 'ensembl_plants',...]; a popular species can belong to several divisions
  isAvailable: boolean; // indicates whether we have data for this species and, therefore, whether it can be selected
};
