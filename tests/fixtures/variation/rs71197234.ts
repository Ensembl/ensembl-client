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

const rs71197234 = {
  name: 'rs71197234',
  alternative_names: [],
  slice: {
    location: {
      start: 57932522,
      end: 57932523,
      length: 2
    },
    region: {
      name: '13',
      code: 'chromosome',
      topology: 'linear',
      so_term: 'SO:0001217'
    },
    strand: {
      code: 'forward',
      value: 1
    }
  },
  allele_type: {
    accession_id: 'SO:0000667 ',
    value: 'insertion',
    url: 'http://www.sequenceontology.org/browser/current_svn/term/SO:0000667',
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
      result: 'ATATATATATATAT',
      classification: {},
      analysis_method: {
        tool: 'AncestralAllele',
        version: '109',
        qualifier: '',
        reference_data: []
      }
    },
    {
      score: -0.25,
      result: null,
      classification: {},
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
      result: 'intergenic_variant',
      classification: {},
      analysis_method: {
        tool: 'Ensembl VEP',
        qualifier: 'most severe  consequence',
        version: '109',
        reference_data: [
          {
            id: 'Ensembl 109',
            name: 'Ensembl 109',
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
      name: 'NC_000013.11:57932522::ATATATATATATACACATATATATATATAT',
      slice: {
        location: {
          start: 57932522,
          end: 57932523,
          length: 2
        },
        region: {
          name: '13',
          code: 'chromosome',
          topology: 'linear'
        },
        strand: {
          code: 'forward',
          value: 1
        }
      },
      allele_sequence: 'ATATATATATATACACATATATATATATAT',
      reference_sequence: '',
      type: 'VariantAllele',
      allele_type: {
        accession_id: 'SO:0000667 ',
        value: 'insertion',
        url: 'http://www.sequenceontology.org/browser/current_svn/term/SO:0000667',
        source: {
          id: '...',
          name: 'Sequence Ontology',
          url: 'www.sequenceontology.org',
          description: 'The Sequence Ontology...'
        }
      },
      alternative_names: [
        {
          accession_id: 'CA919281691',
          name: 'CA919281691',
          description: null,
          assignment_method: {
            type: 'DIRECT',
            description: 'A reference made by external source to a dbSNP rsid'
          },
          url: 'http://reg.clinicalgenome.org/redmine/projects/registry/genboree_registry/by_caid?caid=CA919281691',
          source: {
            id: 'ClinGen Allele Registry',
            name: 'ClinGen Allele Registry',
            description: null,
            url: 'http://reg.clinicalgenome.org/',
            release: '20220211'
          }
        }
      ],
      prediction_results: [],
      population_frequencies: [
        {
          population: 'ALFA:SAMN10492695',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492696',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492697',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492698',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492699',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492700',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492701',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492702',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492703',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492704',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492705',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN11605645',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'TOPMed',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
          feature: 'NC_000013.11:57932522::ATATATATATATACACATATATATATATAT',
          feature_type: 'VariantAllele',
          phenotype: {
            term: 'BREAST-OVARIAN CANCER, FAMILIAL, SUSCEPTIBILITY TO, 2'
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
                accession_id: 'evidence.assertion.pathogenic',
                value: 'pathogenic',
                label: 'pathogenic',
                definition: 'Clinical significance is pathogenic',
                description: ''
              }
            }
          ]
        },
        {
          feature: 'NC_000013.11:57932522::ATATATATATATACACATATATATATATAT',
          feature_type: 'VariantAllele',
          phenotype: {
            term: 'Hereditary breast ovarian cancer syndrome'
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
                accession_id: 'evidence.assertion.pathogenic',
                value: 'pathogenic',
                label: 'pathogenic',
                definition: 'Clinical significance is pathogenic',
                description: ''
              }
            }
          ]
        }
      ]
    },
    {
      name: 'NC_000013.11:57932522::ATACACATATATATATATAT',
      slice: {
        location: {
          start: 57932522,
          end: 57932523,
          length: 2
        },
        region: {
          name: '13',
          code: 'chromosome',
          topology: 'linear',
          so_term: 'SO:0001217'
        },
        strand: {
          code: 'forward',
          value: 1
        }
      },
      allele_sequence: 'ATACACATATATATATATAT',
      reference_sequence: '',
      type: 'VariantAllele',
      allele_type: {
        accession_id: 'SO:0000667 ',
        value: 'insertion',
        url: 'http://www.sequenceontology.org/browser/current_svn/term/SO:0000667',
        source: {
          id: '...',
          name: 'Sequence Ontology',
          url: 'www.sequenceontology.org',
          description: 'The Sequence Ontology...'
        }
      },
      alternative_names: [
        {
          accession_id: 'CA699412434',
          name: 'CA699412434',
          description: null,
          assignment_method: {
            type: 'DIRECT',
            description: 'A reference made by external source to a dbSNP rsid'
          },
          url: 'http://reg.clinicalgenome.org/redmine/projects/registry/genboree_registry/by_caid?caid=CA699412434',
          source: {
            id: 'ClinGen Allele Registry',
            name: 'ClinGen Allele Registry',
            description: null,
            url: 'http://reg.clinicalgenome.org/',
            release: '20220211'
          }
        }
      ],
      prediction_results: [],
      population_frequencies: [
        {
          population: 'ALFA:SAMN10492695',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492696',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492697',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492698',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492699',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492700',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492701',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492702',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492703',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492704',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492705',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN11605645',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'TOPMed',
          allele_count: null,
          allele_number: null,
          allele_frequency: 7.964e-6,
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
          feature: 'NC_000013.11:57932522::ATACACATATATATATATAT',
          feature_type: 'VariantAllele',
          phenotype: {
            term: 'Hereditary cancer-predisposing syndrome'
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
                accession_id: 'evidence.assertion.uncertain_significance',
                value: 'uncertain_significance',
                label: 'uncertain significance',
                definition: 'Clinical significance is uncertain significance',
                description: ''
              }
            }
          ]
        }
      ]
    },
    {
      name: 'NC_000013.11:57932522::ATATATATATACACATATATATATATAT',
      slice: {
        location: {
          start: 57932522,
          end: 57932523,
          length: 2
        },
        region: {
          name: '13',
          code: 'chromosome',
          topology: 'linear'
        },
        strand: {
          code: 'forward',
          value: 1
        }
      },
      allele_sequence: 'ATATATATATACACATATATATATATAT',
      reference_sequence: '',
      type: 'VariantAllele',
      allele_type: {
        accession_id: 'SO:0000667 ',
        value: 'insertion',
        url: 'http://www.sequenceontology.org/browser/current_svn/term/SO:0000667',
        source: {
          id: '...',
          name: 'Sequence Ontology',
          url: 'www.sequenceontology.org',
          description: 'The Sequence Ontology...'
        }
      },
      alternative_names: [
        {
          accession_id: 'CA699412453',
          name: 'CA699412453',
          description: null,
          assignment_method: {
            type: 'DIRECT',
            description: 'A reference made by external source to a dbSNP rsid'
          },
          url: 'http://reg.clinicalgenome.org/redmine/projects/registry/genboree_registry/by_caid?caid=CA699412453',
          source: {
            id: 'ClinGen Allele Registry',
            name: 'ClinGen Allele Registry',
            description: null,
            url: 'http://reg.clinicalgenome.org/',
            release: '20220211'
          }
        }
      ],
      prediction_results: [],
      population_frequencies: [
        {
          population: 'ALFA:SAMN10492695',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492696',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492697',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492698',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492699',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492700',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492701',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492702',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492703',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492704',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492705',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN11605645',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'TOPMed',
          allele_count: null,
          allele_number: null,
          allele_frequency: 7.964e-6,
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
          feature: 'NC_000013.11:57932522::ATATATATATACACATATATATATATAT',
          feature_type: 'VariantAllele',
          phenotype: {
            term: 'BREAST-OVARIAN CANCER, FAMILIAL, SUSCEPTIBILITY TO, 2'
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
                accession_id: 'evidence.assertion.pathogenic',
                value: 'pathogenic',
                label: 'pathogenic',
                definition: 'Clinical significance is pathogenic',
                description: ''
              }
            }
          ]
        },
        {
          feature: 'NC_000013.11:57932522::ATATATATATACACATATATATATATAT',
          feature_type: 'VariantAllele',
          phenotype: {
            term: 'Hereditary breast ovarian cancer syndrome'
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
                accession_id: 'evidence.assertion.pathogenic',
                value: 'pathogenic',
                label: 'pathogenic',
                definition: 'Clinical significance is pathogenic',
                description: ''
              }
            }
          ]
        }
      ]
    },
    {
      name: 'NC_000013.11:57932522::ATATATATATATATACACATATATATATATAT',
      slice: {
        location: {
          start: 57932522,
          end: 57932523,
          length: 2
        },
        region: {
          name: '13',
          code: 'chromosome',
          topology: 'linear'
        },
        strand: {
          code: 'forward',
          value: 1
        }
      },
      allele_sequence: 'ATATATATATATATACACATATATATATATAT',
      reference_sequence: '',
      type: 'VariantAllele',
      allele_type: {
        accession_id: 'SO:0000667 ',
        value: 'insertion',
        url: 'http://www.sequenceontology.org/browser/current_svn/term/SO:0000667',
        source: {
          id: '...',
          name: 'Sequence Ontology',
          url: 'www.sequenceontology.org',
          description: 'The Sequence Ontology...'
        }
      },
      alternative_names: [
        {
          accession_id: 'CA919281693',
          name: 'CA919281693',
          description: null,
          assignment_method: {
            type: 'DIRECT',
            description: 'A reference made by external source to a dbSNP rsid'
          },
          url: 'http://reg.clinicalgenome.org/redmine/projects/registry/genboree_registry/by_caid?caid=CA919281693',
          source: {
            id: 'ClinGen Allele Registry',
            name: 'ClinGen Allele Registry',
            description: null,
            url: 'http://reg.clinicalgenome.org/',
            release: '20220211'
          }
        }
      ],
      prediction_results: [],
      population_frequencies: [
        {
          population: 'ALFA:SAMN10492695',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492696',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492697',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492698',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492699',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492700',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492701',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492702',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492703',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492704',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492705',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN11605645',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'TOPMed',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
          feature: 'NC_000013.11:57932522::ATATATATATATATACACATATATATATATAT',
          feature_type: 'VariantAllele',
          phenotype: {
            term: 'Hereditary cancer-predisposing syndrome'
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
                accession_id: 'evidence.assertion.uncertain_significance',
                value: 'uncertain_significance',
                label: 'uncertain significance',
                definition: 'Clinical significance is uncertain significance',
                description: ''
              }
            }
          ]
        }
      ]
    },
    {
      name: 'NC_000013.11:57932522::ATACATATATATACACATATATATATATAT',
      slice: {
        location: {
          start: 57932522,
          end: 57932523,
          length: 2
        },
        region: {
          name: '13',
          code: 'chromosome',
          topology: 'linear'
        },
        strand: {
          code: 'forward',
          value: 1
        }
      },
      allele_sequence: 'ATACATATATATACACATATATATATATAT',
      reference_sequence: '',
      type: 'VariantAllele',
      allele_type: {
        accession_id: 'SO:0000667 ',
        value: 'insertion',
        url: 'http://www.sequenceontology.org/browser/current_svn/term/SO:0000667',
        source: {
          id: '...',
          name: 'Sequence Ontology',
          url: 'www.sequenceontology.org',
          description: 'The Sequence Ontology...'
        }
      },
      alternative_names: [
        {
          accession_id: 'CA919281690',
          name: 'CA919281690',
          description: null,
          assignment_method: {
            type: 'DIRECT',
            description: 'A reference made by external source to a dbSNP rsid'
          },
          url: 'http://reg.clinicalgenome.org/redmine/projects/registry/genboree_registry/by_caid?caid=CA919281690',
          source: {
            id: 'ClinGen Allele Registry',
            name: 'ClinGen Allele Registry',
            description: null,
            url: 'http://reg.clinicalgenome.org/',
            release: '20220211'
          }
        }
      ],
      prediction_results: [],
      population_frequencies: [
        {
          population: 'ALFA:SAMN10492695',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492696',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492697',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492698',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492699',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492700',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492701',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492702',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492703',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492704',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492705',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN11605645',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'TOPMed',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
      phenotype_assertions: []
    },
    {
      name: 'NC_000013.11:57932522::ATATACACATATATATATATAT',
      slice: {
        location: {
          start: 57932522,
          end: 57932523,
          length: 2
        },
        region: {
          name: '13',
          code: 'chromosome',
          topology: 'linear'
        },
        strand: {
          code: 'forward',
          value: 1
        }
      },
      allele_sequence: 'ATATACACATATATATATATAT',
      reference_sequence: '',
      type: 'VariantAllele',
      allele_type: {
        accession_id: 'SO:0000667 ',
        value: 'insertion',
        url: 'http://www.sequenceontology.org/browser/current_svn/term/SO:0000667',
        source: {
          id: '...',
          name: 'Sequence Ontology',
          url: 'www.sequenceontology.org',
          description: 'The Sequence Ontology...'
        }
      },
      alternative_names: [
        {
          accession_id: 'CA699412438',
          name: 'CA699412438',
          description: null,
          assignment_method: {
            type: 'DIRECT',
            description: 'A reference made by external source to a dbSNP rsid'
          },
          url: 'http://reg.clinicalgenome.org/redmine/projects/registry/genboree_registry/by_caid?caid=CA699412438',
          source: {
            id: 'ClinGen Allele Registry',
            name: 'ClinGen Allele Registry',
            description: null,
            url: 'http://reg.clinicalgenome.org/',
            release: '20220211'
          }
        }
      ],
      prediction_results: [],
      population_frequencies: [
        {
          population: 'ALFA:SAMN10492695',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492696',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492697',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492698',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492699',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492700',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492701',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492702',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492703',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492704',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492705',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN11605645',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'TOPMed',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.5928e-5,
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
      phenotype_assertions: []
    },
    {
      name: 'NC_000013.11:57932522::ACACACACACATATATATATATAT',
      slice: {
        location: {
          start: 57932522,
          end: 57932523,
          length: 2
        },
        region: {
          name: '13',
          code: 'chromosome',
          topology: 'linear'
        },
        strand: {
          code: 'forward',
          value: 1
        }
      },
      allele_sequence: 'ACACACACACATATATATATATAT',
      reference_sequence: '',
      type: 'VariantAllele',
      allele_type: {
        accession_id: 'SO:0000667 ',
        value: 'insertion',
        url: 'http://www.sequenceontology.org/browser/current_svn/term/SO:0000667',
        source: {
          id: '...',
          name: 'Sequence Ontology',
          url: 'www.sequenceontology.org',
          description: 'The Sequence Ontology...'
        }
      },
      alternative_names: [
        {
          accession_id: 'CA699412421',
          name: 'CA699412421',
          description: null,
          assignment_method: {
            type: 'DIRECT',
            description: 'A reference made by external source to a dbSNP rsid'
          },
          url: 'http://reg.clinicalgenome.org/redmine/projects/registry/genboree_registry/by_caid?caid=CA699412421',
          source: {
            id: 'ClinGen Allele Registry',
            name: 'ClinGen Allele Registry',
            description: null,
            url: 'http://reg.clinicalgenome.org/',
            release: '20220211'
          }
        }
      ],
      prediction_results: [],
      population_frequencies: [
        {
          population: 'ALFA:SAMN10492695',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492696',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492697',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492698',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492699',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492700',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492701',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492702',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492703',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492704',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492705',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN11605645',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'TOPMed',
          allele_count: null,
          allele_number: null,
          allele_frequency: 2.3891e-5,
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
      phenotype_assertions: []
    },
    {
      name: 'NC_000013.11:57932522::ATATATATATATACATATATATATATAT',
      slice: {
        location: {
          start: 57932522,
          end: 57932523,
          length: 2
        },
        region: {
          name: '13',
          code: 'chromosome',
          topology: 'linear'
        },
        strand: {
          code: 'forward',
          value: 1
        }
      },
      allele_sequence: 'ATATATATATATACATATATATATATAT',
      reference_sequence: '',
      type: 'VariantAllele',
      allele_type: {
        accession_id: 'SO:0000667 ',
        value: 'insertion',
        url: 'http://www.sequenceontology.org/browser/current_svn/term/SO:0000667',
        source: {
          id: '...',
          name: 'Sequence Ontology',
          url: 'www.sequenceontology.org',
          description: 'The Sequence Ontology...'
        }
      },
      alternative_names: [
        {
          accession_id: 'CA919281692',
          name: 'CA919281692',
          description: null,
          assignment_method: {
            type: 'DIRECT',
            description: 'A reference made by external source to a dbSNP rsid'
          },
          url: 'http://reg.clinicalgenome.org/redmine/projects/registry/genboree_registry/by_caid?caid=CA919281692',
          source: {
            id: 'ClinGen Allele Registry',
            name: 'ClinGen Allele Registry',
            description: null,
            url: 'http://reg.clinicalgenome.org/',
            release: '20220211'
          }
        }
      ],
      prediction_results: [],
      population_frequencies: [
        {
          population: 'ALFA:SAMN10492695',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492696',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492697',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492698',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492699',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492700',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492701',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492702',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492703',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492704',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492705',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN11605645',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'TOPMed',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
      phenotype_assertions: []
    },
    {
      name: 'NC_000013.11:57932522::ATACATATATATATATAT',
      slice: {
        location: {
          start: 57932522,
          end: 57932523,
          length: 2
        },
        region: {
          name: '13',
          code: 'chromosome',
          topology: 'linear'
        },
        strand: {
          code: 'forward',
          value: 1
        }
      },
      allele_sequence: 'ATACATATATATATATAT',
      reference_sequence: '',
      type: 'VariantAllele',
      allele_type: {
        accession_id: 'SO:0000667 ',
        value: 'insertion',
        url: 'http://www.sequenceontology.org/browser/current_svn/term/SO:0000667',
        source: {
          id: '...',
          name: 'Sequence Ontology',
          url: 'www.sequenceontology.org',
          description: 'The Sequence Ontology...'
        }
      },
      alternative_names: [
        {
          accession_id: 'CA699412432',
          name: 'CA699412432',
          description: null,
          assignment_method: {
            type: 'DIRECT',
            description: 'A reference made by external source to a dbSNP rsid'
          },
          url: 'http://reg.clinicalgenome.org/redmine/projects/registry/genboree_registry/by_caid?caid=CA699412432',
          source: {
            id: 'ClinGen Allele Registry',
            name: 'ClinGen Allele Registry',
            description: null,
            url: 'http://reg.clinicalgenome.org/',
            release: '20220211'
          }
        }
      ],
      prediction_results: [],
      population_frequencies: [
        {
          population: 'ALFA:SAMN10492695',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492696',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492697',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492698',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492699',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492700',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492701',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492702',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492703',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492704',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492705',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN11605645',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'TOPMed',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.002,
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
      phenotype_assertions: []
    },
    {
      name: 'NC_000013.11:57932522::ATATATACATATATATATATAT',
      slice: {
        location: {
          start: 57932522,
          end: 57932523,
          length: 2
        },
        region: {
          name: '13',
          code: 'chromosome',
          topology: 'linear'
        },
        strand: {
          code: 'forward',
          value: 1
        }
      },
      allele_sequence: 'ATATATACATATATATATATAT',
      reference_sequence: '',
      type: 'VariantAllele',
      allele_type: {
        accession_id: 'SO:0000667 ',
        value: 'insertion',
        url: 'http://www.sequenceontology.org/browser/current_svn/term/SO:0000667',
        source: {
          id: '...',
          name: 'Sequence Ontology',
          url: 'www.sequenceontology.org',
          description: 'The Sequence Ontology...'
        }
      },
      alternative_names: [
        {
          accession_id: 'CA699412445',
          name: 'CA699412445',
          description: null,
          assignment_method: {
            type: 'DIRECT',
            description: 'A reference made by external source to a dbSNP rsid'
          },
          url: 'http://reg.clinicalgenome.org/redmine/projects/registry/genboree_registry/by_caid?caid=CA699412445',
          source: {
            id: 'ClinGen Allele Registry',
            name: 'ClinGen Allele Registry',
            description: null,
            url: 'http://reg.clinicalgenome.org/',
            release: '20220211'
          }
        }
      ],
      prediction_results: [],
      population_frequencies: [
        {
          population: 'ALFA:SAMN10492695',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492696',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492697',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492698',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492699',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492700',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492701',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492702',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492703',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492704',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492705',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN11605645',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'TOPMed',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.5928e-5,
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
      phenotype_assertions: []
    },
    {
      name: 'NC_000013.11:57932522::ACACATATATATATATAT',
      slice: {
        location: {
          start: 57932522,
          end: 57932523,
          length: 2
        },
        region: {
          name: '13',
          code: 'chromosome',
          topology: 'linear'
        },
        strand: {
          code: 'forward',
          value: 1
        }
      },
      allele_sequence: 'ACACATATATATATATAT',
      reference_sequence: '',
      type: 'VariantAllele',
      allele_type: {
        accession_id: 'SO:0000667 ',
        value: 'insertion',
        url: 'http://www.sequenceontology.org/browser/current_svn/term/SO:0000667',
        source: {
          id: '...',
          name: 'Sequence Ontology',
          url: 'www.sequenceontology.org',
          description: 'The Sequence Ontology...'
        }
      },
      alternative_names: [
        {
          accession_id: 'CA699412419',
          name: 'CA699412419',
          description: null,
          assignment_method: {
            type: 'DIRECT',
            description: 'A reference made by external source to a dbSNP rsid'
          },
          url: 'http://reg.clinicalgenome.org/redmine/projects/registry/genboree_registry/by_caid?caid=CA699412419',
          source: {
            id: 'ClinGen Allele Registry',
            name: 'ClinGen Allele Registry',
            description: null,
            url: 'http://reg.clinicalgenome.org/',
            release: '20220211'
          }
        }
      ],
      prediction_results: [],
      population_frequencies: [
        {
          population: 'ALFA:SAMN10492695',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492696',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492697',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492698',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492699',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492700',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492701',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492702',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492703',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492704',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492705',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN11605645',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'TOPMed',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.000135385,
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
      phenotype_assertions: []
    },
    {
      name: 'NC_000013.11:57932522::ATATACATATATATATATAT',
      slice: {
        location: {
          start: 57932522,
          end: 57932523,
          length: 2
        },
        region: {
          name: '13',
          code: 'chromosome',
          topology: 'linear'
        },
        strand: {
          code: 'forward',
          value: 1
        }
      },
      allele_sequence: 'ATATACATATATATATATAT',
      reference_sequence: '',
      type: 'VariantAllele',
      allele_type: {
        accession_id: 'SO:0000667 ',
        value: 'insertion',
        url: 'http://www.sequenceontology.org/browser/current_svn/term/SO:0000667',
        source: {
          id: '...',
          name: 'Sequence Ontology',
          url: 'www.sequenceontology.org',
          description: 'The Sequence Ontology...'
        }
      },
      alternative_names: [
        {
          accession_id: 'CA699412435',
          name: 'CA699412435',
          description: null,
          assignment_method: {
            type: 'DIRECT',
            description: 'A reference made by external source to a dbSNP rsid'
          },
          url: 'http://reg.clinicalgenome.org/redmine/projects/registry/genboree_registry/by_caid?caid=CA699412435',
          source: {
            id: 'ClinGen Allele Registry',
            name: 'ClinGen Allele Registry',
            description: null,
            url: 'http://reg.clinicalgenome.org/',
            release: '20220211'
          }
        }
      ],
      prediction_results: [],
      population_frequencies: [
        {
          population: 'ALFA:SAMN10492695',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492696',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492697',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492698',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492699',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492700',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492701',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492702',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492703',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492704',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492705',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN11605645',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'TOPMed',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.00033448,
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
      phenotype_assertions: []
    },
    {
      name: 'NC_000013.11:57932522::ACATATATATATATAT',
      slice: {
        location: {
          start: 57932522,
          end: 57932523,
          length: 2
        },
        region: {
          name: '13',
          code: 'chromosome',
          topology: 'linear'
        },
        strand: {
          code: 'forward',
          value: 1
        }
      },
      allele_sequence: 'ACATATATATATATAT',
      reference_sequence: '',
      type: 'VariantAllele',
      allele_type: {
        accession_id: 'SO:0000667 ',
        value: 'insertion',
        url: 'http://www.sequenceontology.org/browser/current_svn/term/SO:0000667',
        source: {
          id: '...',
          name: 'Sequence Ontology',
          url: 'www.sequenceontology.org',
          description: 'The Sequence Ontology...'
        }
      },
      alternative_names: [
        {
          accession_id: 'CA699412410',
          name: 'CA699412410',
          description: null,
          assignment_method: {
            type: 'DIRECT',
            description: 'A reference made by external source to a dbSNP rsid'
          },
          url: 'http://reg.clinicalgenome.org/redmine/projects/registry/genboree_registry/by_caid?caid=CA699412410',
          source: {
            id: 'ClinGen Allele Registry',
            name: 'ClinGen Allele Registry',
            description: null,
            url: 'http://reg.clinicalgenome.org/',
            release: '20220211'
          }
        }
      ],
      prediction_results: [],
      population_frequencies: [
        {
          population: 'ALFA:SAMN10492695',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492696',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492697',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492698',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492699',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492700',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492701',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492702',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492703',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492704',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN10492705',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'ALFA:SAMN11605645',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
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
        },
        {
          population: 'TOPMed',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.003,
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
    },
    {
      name: 'NC_000013.11:57932509:ATATATATATATAT:ATATATATATATAT',
      slice: {
        location: {
          start: 57932509,
          end: 57932522,
          length: 13
        },
        region: {
          name: '13',
          code: 'chromosome',
          topology: 'linear'
        },
        strand: {
          code: 'forward',
          value: 1
        }
      },
      allele_sequence: '',
      reference_sequence: 'ATATATATATATAT',
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
          population: 'ALFA:SAMN10492695',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
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
        },
        {
          population: 'ALFA:SAMN10492696',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
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
        },
        {
          population: 'ALFA:SAMN10492697',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
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
        },
        {
          population: 'ALFA:SAMN10492698',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
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
        },
        {
          population: 'ALFA:SAMN10492699',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
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
        },
        {
          population: 'ALFA:SAMN10492700',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
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
        },
        {
          population: 'ALFA:SAMN10492701',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
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
        },
        {
          population: 'ALFA:SAMN10492702',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
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
        },
        {
          population: 'ALFA:SAMN10492703',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
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
        },
        {
          population: 'ALFA:SAMN10492704',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
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
        },
        {
          population: 'ALFA:SAMN10492705',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
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
        },
        {
          population: 'ALFA:SAMN11605645',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
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
        },
        {
          population: 'TOPMed',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.951,
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
      phenotype_assertions: []
    }
  ]
} as unknown as Variant;

export default rs71197234;
