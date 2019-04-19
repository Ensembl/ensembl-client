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
        production_name: 'homo_sapiens38',
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
        production_name: 'homo_sapiens37',
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
      },
      {
        production_name: 'humibacillus_sp_dsm_29435',
        reference_species_name: null,
        common_name: null,
        scientific_name: 'Humibacillus sp. DSM 29435',
        subtype: null,
        matched_substrings: [
          {
            length: 3,
            offset: 0,
            match: 'scientific_name'
          }
        ]
      }
    ],
    [
      {
        production_name: 'azospirillum_humicireducens',
        reference_species_name: null,
        common_name: null,
        scientific_name: 'Azospirillum humicireducens',
        subtype: null,
        matched_substrings: [
          {
            length: 3,
            offset: 13,
            match: 'scientific_name'
          }
        ]
      },
      {
        production_name: 'propionibacterium_humerusii_hl037pa3',
        reference_species_name: null,
        common_name: null,
        scientific_name: 'Propionibacterium humerusii HL037PA3',
        subtype: null,
        matched_substrings: [
          {
            length: 3,
            offset: 18,
            match: 'scientific_name'
          }
        ]
      },
      {
        production_name: 'propionibacterium_humerusii_hl037pa2',
        reference_species_name: null,
        common_name: null,
        scientific_name: 'Propionibacterium humerusii HL037PA2',
        subtype: null,
        matched_substrings: [
          {
            length: 3,
            offset: 18,
            match: 'scientific_name'
          }
        ]
      },
      {
        production_name: 'propionibacterium_humerusii_hl044pa1',
        reference_species_name: null,
        common_name: null,
        scientific_name: 'Propionibacterium humerusii HL044PA1',
        subtype: null,
        matched_substrings: [
          {
            length: 3,
            offset: 18,
            match: 'scientific_name'
          }
        ]
      },
      {
        production_name: 'propionibacterium_humerusii_p08',
        reference_species_name: null,
        common_name: null,
        scientific_name: 'Propionibacterium humerusii P08',
        subtype: null,
        matched_substrings: [
          {
            length: 3,
            offset: 18,
            match: 'scientific_name'
          }
        ]
      },
      {
        production_name: 'sinomonas_humi',
        reference_species_name: null,
        common_name: null,
        scientific_name: 'Sinomonas humi',
        subtype: null,
        matched_substrings: [
          {
            length: 3,
            offset: 10,
            match: 'scientific_name'
          }
        ]
      },
      {
        production_name: 'stenotrophomonas_humi',
        reference_species_name: null,
        common_name: null,
        scientific_name: 'Stenotrophomonas humi',
        subtype: null,
        matched_substrings: [
          {
            length: 3,
            offset: 17,
            match: 'scientific_name'
          }
        ]
      },
      {
        production_name: 'thauera_humireducens',
        reference_species_name: null,
        common_name: null,
        scientific_name: 'Thauera humireducens',
        subtype: null,
        matched_substrings: [
          {
            length: 3,
            offset: 8,
            match: 'scientific_name'
          }
        ]
      }
    ]
  ]
};
