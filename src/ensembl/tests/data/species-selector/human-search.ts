/*

REFERENCE - shape of a single match:

{
  "production_name": string, // a unique identifier (provisional field name)
  "reference_species_name": string | null, // nullable field; present if the match is a subgroup (e.g. strain) of a species
  "common_name": string | null, // common name (if present)
  "scientific_name": string, // should always be present
  "subtype": string | null, // any extra information about the species (e.g. assembly_name for Human)
  "matched_substrings" : [
      {
          "length" : number,
          "offset" : number,
          "match": "common_name" | "scientific_name" | "subtype" // name of the matched field
      }
    ]
}

*/

// sample response for typing "hum" in the search box

export default {
  matches: [
    // <-- notice that it is an array of groups of matches
    [
      {
        production_name: 'homo_sapiens38', // <-- should be unique!
        reference_species_name: null,
        common_name: 'Human',
        scientific_name: 'Homo sapiens',
        subtype: 'GRCh38',
        matched_substrings: [
          {
            length: 3,
            offset: 0,
            match: 'common_name'
          }
        ]
      },
      {
        production_name: 'homo_sapiens37', // <-- should be unique!
        reference_species_name: null,
        common_name: 'Human',
        scientific_name: 'Homo sapiens',
        subtype: 'GRCh37',
        matched_substrings: [
          {
            length: 3,
            offset: 0,
            match: 'common_name'
          }
        ]
      }
    ]
  ]
};
