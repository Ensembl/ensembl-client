// description of shape of data returned from the api

export type SearchMatches = SearchMatch[];

export type SearchMatch = {
  production_name: string; // unique identifier; not a very good field name
  reference_species_name: string | null; // indicates whether the match is a strain of a reference species
  common_name: string | null; // not every species has a common name
  scientific_name: string; // every species has a scientific name
  subtype: string | null; // any extra information about the species (e.g. assembly name for Human)
  matched_substrings: MatchedSubstring[];
};

export type SearchMatchGroup = {
  title?: string;
  matches: SearchMatch[];
};

export type MatchedSubstring = {
  length: number;
  offset: number;
  match: 'description' | 'scientific_name' | 'subtype';
};

/*

NOTES/QUESTIONS:

- what data needs to be passed to the genome browser after one/more species are selected
(current pathname in genome browser: /app/browser/GRCh38_demo/ENSG00000139618?region=13:32274159-32434627)

*/

export type Strain = {
  production_name: string;
  display_name: string;
};

export type Assembly = {
  assembly_name: string;
};

export type CommittedItem = {
  common_name: string | null;
  scientific_name: string;
  assembly_name: string;
  isEnabled: boolean;
  reference_species_name: string; // because in Species Selector we need to keep track of how many strains have been selected
};
