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

// sample response for typing "mou" in the search box

// QUESTION: what does the endpoint look like? Keep in mind that it should accept the division filter parameter

export default {
  matches: [
    [
      // <-- notice that it is an array of groups of matches
      {
        production_name: 'mus_musculus',
        reference_species_name: null,
        common_name: 'Mouse',
        scientific_name: 'Mus musculus',
        subtype: null,
        matched_substrings: [
          {
            length: 3,
            offset: 0,
            match: 'common_name'
          }
        ]
      },
      {
        production_name: 'mus_musculus_1', // <-- should be unique
        reference_species_name: 'mus_musculus',
        common_name: 'Mouse 129S1/SvImJ',
        scientific_name: 'Mus musculus',
        subtype: null,
        matched_substrings: [
          {
            length: 3,
            offset: 0,
            match: 'common_name'
          }
        ]
      },
      {
        production_name: 'mus_musculus_2', // <-- should be unique
        reference_species_name: 'mus_musculus',
        common_name: 'Mouse A/J',
        scientific_name: 'Mus musculus',
        subtype: null,
        matched_substrings: [
          {
            length: 3,
            offset: 0,
            match: 'common_name'
          }
        ]
      },
      {
        production_name: 'mus_musculus_3', // <-- should be unique
        reference_species_name: 'mus_musculus',
        common_name: 'Mouse AKR/J',
        scientific_name: 'Mus musculus',
        subtype: null,
        matched_substrings: [
          {
            length: 3,
            offset: 0,
            match: 'common_name'
          }
        ]
      },
      {
        production_name: 'mus_musculus_4', // <-- should be unique
        reference_species_name: 'mus_musculus',
        common_name: 'Mouse BALB/cJ',
        scientific_name: 'Mus musculus',
        subtype: null,
        matched_substrings: [
          {
            length: 3,
            offset: 0,
            match: 'common_name'
          }
        ]
      },
      {
        production_name: 'mus_musculus_5', // <-- should be unique
        reference_species_name: 'mus_musculus',
        common_name: 'Mouse C3H/HeJ',
        scientific_name: 'Mus musculus',
        subtype: null,
        matched_substrings: [
          {
            length: 3,
            offset: 0,
            match: 'common_name'
          }
        ]
      },
      {
        production_name: 'mus_musculus_6', // <-- should be unique
        reference_species_name: 'mus_musculus',
        common_name: 'Mouse C57BL/6NJ',
        scientific_name: 'Mus musculus',
        subtype: null,
        matched_substrings: [
          {
            length: 3,
            offset: 0,
            match: 'common_name'
          }
        ]
      },
      {
        production_name: 'mus_musculus_7', // <-- should be unique
        reference_species_name: 'mus_musculus',
        common_name: 'Mouse CAST/EiJ',
        scientific_name: 'Mus musculus',
        subtype: null,
        matched_substrings: [
          {
            length: 3,
            offset: 0,
            match: 'common_name'
          }
        ]
      },
      {
        production_name: 'mus_musculus_8', // <-- should be unique
        reference_species_name: 'mus_musculus',
        common_name: 'Mouse CBA/J',
        scientific_name: 'Mus musculus',
        subtype: null,
        matched_substrings: [
          {
            length: 3,
            offset: 0,
            match: 'common_name'
          }
        ]
      },
      {
        production_name: 'mus_musculus_9', // <-- should be unique
        reference_species_name: 'mus_musculus',
        common_name: 'Mouse DBA/2',
        scientific_name: 'Mus musculus',
        subtype: null,
        matched_substrings: [
          {
            length: 3,
            offset: 0,
            match: 'common_name'
          }
        ]
      },
      {
        production_name: 'mus_musculus_10', // <-- should be unique
        reference_species_name: 'mus_musculus',
        common_name: 'Mouse FVB/NJ',
        scientific_name: 'Mus musculus',
        subtype: null,
        matched_substrings: [
          {
            length: 3,
            offset: 0,
            match: 'common_name'
          }
        ]
      },
      {
        production_name: 'mus_musculus_11', // <-- should be unique
        reference_species_name: 'mus_musculus',
        common_name: 'Mouse LP/J',
        scientific_name: 'Mus musculus',
        subtype: null,
        matched_substrings: [
          {
            length: 3,
            offset: 0,
            match: 'common_name'
          }
        ]
      },
      {
        production_name: 'microcebus_murinus',
        reference_species_name: null,
        common_name: 'Mouse Lemur',
        scientific_name: 'Microcebus murinus', // <-- a lemur!
        subtype: null,
        matched_substrings: [
          {
            length: 3,
            offset: 0,
            match: 'common_name'
          }
        ]
      },
      {
        production_name: 'mus_musculus_12', // <-- should be unique
        reference_species_name: 'mus_musculus',
        common_name: 'Mouse NOD/ShiLtJ',
        scientific_name: 'Mus musculus',
        subtype: null,
        matched_substrings: [
          {
            length: 3,
            offset: 0,
            match: 'common_name'
          }
        ]
      },
      {
        production_name: 'mus_musculus_13', // <-- should be unique
        reference_species_name: 'mus_musculus',
        common_name: 'Mouse NZO/HlLtJ',
        scientific_name: 'Mus musculus',
        subtype: null,
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
