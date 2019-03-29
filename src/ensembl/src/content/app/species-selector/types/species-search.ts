// description of shape of data returned from the api

export type SearchMatches = SearchMatch[];

export type SearchMatch = {
  description: string;
  scientific_name: string | null;
  assembly_name: string | null;
  matched_substrings: MatchedSubstring[];
  // genome: string;
};

export type SearchMatchGroup = {
  title?: string;
  matches: SearchMatch[];
};

export type MatchedSubstring = {
  length: number;
  offset: number;
  match: 'description' | 'scientific_name';
};

/*

NOTES/QUESTIONS:

- see Kieron's comment to our api docs in Confluence:
> I don't like "parent species name" as a key. Given your comment context, I propose "reference_species_name".


- what data needs to be passed to the genome browser after one/more species are selected
(current pathname in genome browser: /app/browser/GRCh38_demo/ENSG00000139618?region=13:32274159-32434627)

*/

export type Strain = {
  id: string;
  display_name: string;
  parent_species_name: string;
};

export type Assembly = {
  display_name: string;
};

export type CommittedItem = {
  display_name: string;
  assembly_name: string;
  isEnabled: boolean;
  parentSpecies: string; // ???
};
