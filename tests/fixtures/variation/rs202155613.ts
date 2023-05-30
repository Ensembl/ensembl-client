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

const rs202155613 = {
  name: 'rs202155613',
  alternative_names: [],
  slice: {
    location: {
      start: 32379902,
      end: 32379902,
      length: 1
    },
    region: {
      name: '13',
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
      result: 'C',
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
      result: 'stop_gained',
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
      name: 'NC_000013.11:32379901:C:A',
      slice: {
        location: {
          start: 32379902,
          end: 32379902,
          length: 1
        },
        region: {
          name: '13',
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
      reference_sequence: 'C',
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
          accession_id: 'CA025982',
          name: 'CA025982',
          description: null,
          assignment_method: {
            type: 'DIRECT',
            description: 'A reference made by external source to a dbSNP rsid'
          },
          url: 'http://reg.clinicalgenome.org/redmine/projects/registry/genboree_registry/by_caid?caid=CA025982',
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
          score: 27.2,
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
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:AFR',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:AMR',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:EAS',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:EUR',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:SAS',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:ACB',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:ASW',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:ESN',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:GWD',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:LWK',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:MSL',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:CLM',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:YRI',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:CLM',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:MXL',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:PEL',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:PUR',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:CDX',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:CHB',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:CHS',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:JPT',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:KHV',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:CEU',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:FIN',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:GBR',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:IBS',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:TSI',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:BEB',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:GIH',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:ITU',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:PJL',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:STU',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:ALL',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:afr',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:amr',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:asj',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:eas',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:fin',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:nfe',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:oth',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:sas',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        }
      ],
      phenotype_assertions: [
        {
          feature: 'NC_000013.11:32379901:C:A',
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
      name: 'NC_000013.11:32379901:C:G',
      slice: {
        location: {
          start: 32379902,
          end: 32379902,
          length: 1
        },
        region: {
          name: '13',
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
      reference_sequence: 'C',
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
          accession_id: 'CA025983',
          name: 'CA025983',
          description: null,
          assignment_method: {
            type: 'DIRECT',
            description: 'A reference made by external source to a dbSNP rsid'
          },
          url: 'http://reg.clinicalgenome.org/redmine/projects/registry/genboree_registry/by_caid?caid=CA025983',
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
          score: 24.8,
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
          population: '1000GENOMES:phase_3:ALL',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.000199680511182109,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: true,
          is_hpmaf: true
        },
        {
          population: '1000GENOMES:phase_3:AFR',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:AMR',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:EAS',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.001,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: true,
          is_hpmaf: true
        },
        {
          population: '1000GENOMES:phase_3:EUR',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:SAS',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:ACB',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:ASW',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:ESN',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:GWD',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:LWK',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:MSL',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:YRI',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:CLM',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:MXL',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:PEL',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:PUR',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:CDX',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:CHB',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0005,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:CHS',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:JPT',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:KHV',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:CEU',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:FIN',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:GBR',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:IBS',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:TSI',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:BEB',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:GIH',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:ITU',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:PJL',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:STU',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:ALL',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:afr',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:amr',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:asj',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:eas',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:fin',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:nfe',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:oth',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:sas',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        }
      ],
      phenotype_assertions: []
    },
    {
      name: 'NC_000013.11:32379901:C:T',
      slice: {
        location: {
          start: 32379902,
          end: 32379902,
          length: 1
        },
        region: {
          name: '13',
          code: 'chromosome',
          topology: 'linear',
          length: 1
        },
        strand: {
          code: 'forward',
          value: 1
        }
      },
      allele_sequence: 'T',
      reference_sequence: 'C',
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
          accession_id: ' CA10589547',
          name: 'CA10589547',
          description: null,
          assignment_method: {
            type: 'DIRECT',
            description: 'A reference made by external source to a dbSNP rsid'
          },
          url: 'http://reg.clinicalgenome.org/redmine/projects/registry/genboree_registry/by_caid?caid=CA10589547',
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
          score: 47,
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
          population: '1000GENOMES:phase_3:ALL',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:AFR',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:AMR',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:EAS',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:EUR',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:SAS',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:ACB',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:ASW',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:ESN',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:GWD',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:LWK',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:MSL',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:CLM',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:YRI',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:CLM',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:MXL',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:PEL',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:PUR',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:CDX',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:CHB',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:CHS',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:JPT',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:KHV',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:CEU',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:FIN',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:GBR',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:IBS',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:TSI',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:BEB',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:GIH',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:ITU',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:PJL',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:STU',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:ALL',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:afr',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:amr',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:asj',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:eas',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:fin',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:nfe',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:oth',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:sas',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        }
      ],
      phenotype_assertions: []
    },
    {
      name: 'NC_000013.11:32379901:C:C',
      slice: {
        location: {
          start: 32379902,
          end: 32379902,
          length: 1
        },
        region: {
          name: '13',
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
      allele_sequence: 'C',
      reference_sequence: 'C',
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
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.999800319488818,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:AFR',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:AMR',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:EAS',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.999,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:EUR',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:SAS',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:ACB',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:ASW',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:ESN',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:GWD',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:LWK',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:MSL',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:YRI',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:CLM',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:MXL',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:PEL',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:PUR',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:CDX',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:CHB',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.995,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:CHS',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:JPT',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:KHV',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:CEU',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:FIN',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:GBR',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:IBS',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:TSI',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:BEB',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:GIH',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:ITU',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:PJL',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: '1000GENOMES:phase_3:STU',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: '2.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:ALL',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:afr',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:amr',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:asj',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:eas',
          allele_count: null,
          allele_number: null,
          allele_frequency: 0.9995,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:fin',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:nfe',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:oth',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        },
        {
          population: ' gnomADe:sas',
          allele_count: null,
          allele_number: null,
          allele_frequency: 1.0,
          dataset: {
            version: 'r2.1.1',
            release_date: '2021-01-23',
            source: {}
          },
          qc_filter: {},
          is_minor_allele: false,
          is_hpmaf: false
        }
      ],
      phenotype_assertions: []
    }
  ]
} as unknown as Variant;

export default rs202155613;
