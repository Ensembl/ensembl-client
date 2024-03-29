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

const rs699 = {
  name: 'rs699',
  alternative_names: [],
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
      so_term: 'SO:0001217',
      length: 1
    },
    strand: {
      code: 'forward',
      value: 1
    }
  },
  allele_type: {
    accession_id: 'SO:0001483',
    value: 'SNV',
    url: 'www.sequenceontology.org/browser/current_release/term/SO:0001483',
    source: {
      id: '...',
      name: 'Sequence Ontology',
      url: 'www.sequenceontology.org',
      description: 'The Sequence Ontology...'
    }
  },
  primary_source: {
    id: 'dbSNP',
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
      name: 'NC_000001.1:230710048:A:G',
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
          length: 1
        },
        strand: {
          code: 'forward',
          value: 1
        }
      },
      allele_sequence: 'G',
      reference_sequence: 'A',
      type: 'VariantAllele',
      allele_type: {
        accession_id: 'SO:0001483',
        value: 'SNV',
        url: 'www.sequenceontology.org/browser/current_release/term/SO:0001483',
        source: {
          id: '...',
          name: 'Sequence Ontology',
          url: 'www.sequenceontology.org',
          description: 'The Sequence Ontology...'
        }
      },
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
          url: null,
          source: {
            id: 'UniProt',
            name: 'UniProt',
            description: null,
            url: 'https://www.uniprot.org/',
            release: '20220211'
          }
        },
        {
          accession_id: 'CA127784',
          name: 'CA127784',
          description: null,
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
          population: '1000GENOMES:phase_3:ALL',
          allele_count: 3531,
          allele_number: 5008,
          allele_frequency: 0.705,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {
            accession_id: 'population_allele_frequency.qc_filter.pass',
            value: 'pass',
            label: 'PASS',
            definition: 'Frequency dataset for which qc_filter is PASS',
            description: ''
          },
          is_minor_allele: false,
          is_hpmaf: false
        }
      ],
      phenotype_assertions: [
        {
          feature: 'NC_000001.1:230710048:A:G',
          feature_type: 'VariantAllele',
          phenotype: {
            term: 'Hypertensive disorder'
          },
          evidence: [
            {
              source: {
                name: 'ClinVar',
                release: '2021-07-07'
              },
              citations: [],
              attributes: [],
              assertion: {
                accession_id: 'evidence.assertion.benign',
                value: 'benign',
                label: 'benign',
                definition: 'Clinical significance is benign',
                description: ''
              }
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
                release: '2021-07-07'
              },
              citations: [],
              attributes: [],
              assertion: {
                accession_id: 'evidence.assertion.risk_factor',
                value: 'risk_factor',
                label: 'risk factor',
                definition: 'Clinical significance is risk factor',
                description: ''
              }
            }
          ]
        }
      ]
    },
    {
      name: 'NC_000001.1:230710048:A:A',
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
          length: 1
        },
        strand: {
          code: 'forward',
          value: 1
        }
      },
      allele_sequence: 'A',
      reference_sequence: 'A',
      type: 'VariantAllele',
      allele_type: {
        accession_id: 'SO:0001411',
        value: 'biological_region',
        url: 'www.sequenceontology.org/browser/current_release/term/SO:0001411',
        source: {
          id: '...',
          name: 'Sequence Ontology',
          url: 'www.sequenceontology.org',
          description: 'The Sequence Ontology...'
        }
      },
      alternative_names: [],
      prediction_results: [],
      population_frequencies: [
        {
          population: '1000GENOMES:phase_3:ALL',
          allele_count: 1477,
          allele_number: 5008,
          allele_frequency: 0.295,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {
            accession_id: 'population_allele_frequency.qc_filter.pass',
            value: 'pass',
            label: 'PASS',
            definition: 'Frequency dataset for which qc_filter is PASS',
            description: ''
          },
          is_minor_allele: true,
          is_hpmaf: true
        }
      ],
      phenotype_assertions: []
    }
  ],
  citations: []
} as unknown as Variant;

export default rs699;
