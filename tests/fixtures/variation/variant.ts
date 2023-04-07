/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { Variant } from 'src/shared/types/variation-api/variant';

export const variantRs699 = {
  name: 'rs699',
  alternative_names: [],
  primary_source: {
    id: '1',
    name: 'dbSNP',
    description: 'NCBI db of human variants',
    url: 'https://www.ncbi.nlm.nih.gov/snp/',
    release: '154'
  },
  type: 'Variant',
  prediction_results: [
    {
      score: null,
      result: 'G',
      // "classification": {},
      analysis_method: {
        tool: 'AncestralAllele',
        version: '108',
        qualifier: '',
        reference_data: []
      }
    },
    {
      score: -2.88,
      result: null,
      // "classification": {},
      analysis_method: {
        tool: 'GERP',
        version: '',
        qualifier: '',
        reference_data: [
          {
            id: '90_mamals.gerp_conservation_score',
            name: '90_mamals.gerp_conservation_score',
            description: null,
            url: null,
            release: null
          }
        ]
      }
    },
    {
      score: null,
      result: 'missense_variant',
      // "classification": {},
      analysis_method: {
        tool: 'Ensembl VEP',
        qualifier: 'most severe  consequence',
        version: '108',
        reference_data: [
          {
            id: 'Ensembl 108',
            name: 'Ensembl 108',
            description: null,
            url: null,
            release: null
          }
        ]
      }
    }
  ],
  alleles: [
    {
      type: 'VariantAllele',
      name: 'NC_000001.1:230710048:A:G',
      allele_type: {
        accession_id: 'SO:0001483',
        value: 'SNV',
        url: 'www.sequenceontology.org/browser/current_release/term/SO:0000147',
        source: {
          id: '...',
          name: 'Sequence Ontology',
          url: 'www.sequenceontology.org'
        }
      },
      slice: {
        location: {
          start: 230710048,
          end: 230710048,
          length: 1
        },
        region: {
          name: '1',
          code: 'chromosome',
          topology: 'linear',
          // "so_term": "SO:0001217",
          length: 1
        },
        strand: {
          code: 'forward',
          value: 1
        }
      },
      allele_sequence: 'G',
      reference_sequence: 'A',
      alternative_names: [
        {
          accession_id: 'VCV000018068',
          name: 'VCV000018068',
          description: null,
          assignment_method: {
            type: 'DIRECT',
            description: 'A reference made by external source to a dbSNP rsid'
          },
          url: 'http://www.ncbi.nlm.nih.gov/clinvar/variation/VCV000018068',
          source: {
            id: 'ClinVar',
            name: 'ClinVar',
            description: null,
            url: 'http://www.ncbi.nlm.nih.gov/clinvar/',
            release: '202201'
          }
        },
        {
          accession_id: '106150.0001',
          name: '106150.0001',
          description: null,
          assignment_method: {
            type: 'DIRECT',
            description: 'A reference made by external source to a dbSNP rsid'
          },
          url: 'http://www.omim.org/106150#0001',
          source: {
            id: 'OMIM',
            name: 'OMIM',
            description: null,
            url: 'http://www.omim.org/',
            release: '202201'
          }
        },
        {
          accession_id: 'PA166153539',
          name: 'PA166153539',
          description: null,
          assignment_method: {
            type: 'DIRECT',
            description: 'A reference made by external source to a dbSNP rsid'
          },
          url: 'https://www.pharmgkb.org/rsid/rs699',
          source: {
            id: 'PharmGKB',
            name: 'PharmGKB',
            description: null,
            url: 'https://www.pharmgkb.org/',
            release: '20210202'
          }
        },
        {
          accession_id: 'VAR_007096',
          name: 'VAR_007096',
          description: null,
          assignment_method: {
            type: 'DIRECT',
            description: 'A reference made by external source to a dbSNP rsid'
          },
          url: '',
          source: {
            id: 'UniProt',
            name: 'UniProt',
            // "description": null,
            url: 'https://www.uniprot.org/',
            release: '20220211'
          }
        },
        {
          accession_id: 'CA127784',
          name: 'CA127784',
          // "description": null,
          assignment_method: {
            type: 'DIRECT',
            description: 'A reference made by external source to a dbSNP rsid'
          },
          url: 'http://reg.clinicalgenome.org/redmine/projects/registry/genboree_registry/by_caid?caid=CA127784',
          source: {
            id: 'ClinGen Allele Registry',
            name: 'ClinGen Allele Registry',
            description: null,
            url: 'http://reg.clinicalgenome.org/',
            release: '20220211'
          }
        }
      ],
      prediction_results: [
        {
          score: 0.347,
          result: null,
          classification: {},
          analysis_method: {
            tool: 'CADD',
            version: '1.6',
            qualifier: '',
            reference_data: [
              {
                id: 'CADD_GRCh38_1.6_whole_genome_SNVs.tsv.gz',
                name: 'CADD_GRCh38_1.6_whole_genome_SNVs.tsv.gz',
                description: null,
                url: null,
                release: null
              }
            ]
          }
        }
      ],
      population_frequencies: [
        {
          population: {
            name: '1000GENOMES:phase_3:ALL',
            size: 2504,
            description: 'All phase 3 individuals',
            type: {
              // "accession_id": "population_type.1000GENOMES:phase_3",
              value: 'ALL',
              label: 'ALL',
              definition: 'ALL populations in 1000 genomes'
              // "description": ""
            },
            global: true,
            is_from_genotypes: true,
            display_group_name: '1000Genomes Phase 3',
            sub_populations: [
              {
                name: '1000GENOMES:phase_3:AFR',
                type: {
                  // "accession_id": "population_type.1000GENOMES:phase_3",
                  value: 'AFR',
                  label: 'AFR',
                  definition: 'AFR population in 1000 genomes'
                  // "description": ""
                },
                sub_populations: [
                  {
                    name: '1000GENOMES:phase_3:ACB',
                    type: {
                      // "accession_id": "population_type.1000GENOMES:phase_3",
                      value: 'ACB',
                      label: 'ACB',
                      definition: 'ACB population in 1000 genomes'
                      // "description": ""
                    }
                  }
                ]
              },
              {
                name: '1000GENOMES:phase_3:AMR',
                type: {
                  // "accession_id": "population_type.1000GENOMES:phase_3",
                  value: 'AMR',
                  label: 'AMR',
                  definition: 'AMR population in 1000 genomes'
                  // "description": ""
                }
              }
            ]
          },
          allele_count: 1477,
          allele_number: 5008,
          allele_frequency: 0.295,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {
            // "accession_id": "population_allele_frequency.qc_filter",
            value: 'PASS',
            label: 'PASS',
            definition: 'Frequency dataset for which qc_filter is PASS'
            // "description": ""
          },
          is_minor_allele: true,
          is_hpmaf: true
        }
      ],
      phenotype_assertions: [
        {
          feature: 'NC_000001.1:230710048A:G',
          feature_type: 'VariantAllele',
          phenotype: {
            term: 'Coronary Artery Disease'
          },
          evidence: [
            {
              source: {
                id: '2',
                name: 'NHGRI-EBI GWAS catalog',
                description: null,
                url: null,
                release: '2021-07-01'
              },
              citations: [],
              attributes: [
                {
                  type: 'beta_coefficient',
                  value: '0.036 unitdecrease'
                },
                {
                  type: 'associated_gene',
                  value: 'AGT'
                },
                {
                  type: 'pvalue',
                  value: '2.00e-8'
                }
              ],
              assertion: {}
            }
          ]
        },
        {
          feature: 'NC_000001.1:.230710048A:G',
          feature_type: 'VariantAllele',
          phenotype: {
            term: 'Preeclampsia'
          },
          evidence: [
            {
              source: {
                name: 'ClinVar',
                version: '2021-07-07'
              },
              citations: [],
              attributes: [
                {
                  type: 'review status',
                  value: 'expert panel'
                },
                {
                  type: 'associated_gene',
                  value: 'AGT'
                },
                {
                  type: 'external identifier',
                  value: 'MIM:106150'
                }
              ],
              assertion: {
                accession_id: 'evidence.assertion',
                value: 'risk_factor',
                label: 'risk factor',
                definition: 'Review status: no assertion criteria provided',
                description: ''
              }
            }
          ]
        }
      ]
    }
  ],
  citations: []
} as unknown as Variant;
