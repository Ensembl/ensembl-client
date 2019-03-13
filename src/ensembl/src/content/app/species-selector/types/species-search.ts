// description of shape of data returned from the api

export type SearchMatches = SearchMatch[];

export type SearchMatch = {
  description: string;
  scientific_name: string | null;
  assembly_name: string | null;
  matched_substrings: MatchedSubstring[];
  genome: string;
};

export type MatchedSubstring = {
  length: number;
  offset: number;
  match: 'description' | 'scientific_name';
};
