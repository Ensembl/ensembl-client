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

import type { VepResultsResponse } from 'src/content/app/tools/vep/types/vepResultsResponse';

const mockVepResults = {
  metadata: {
    pagination: {
      page: 2,
      per_page: 100,
      total: 85020
    }
  },
  variants: [
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 348526,
        end: 348527
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'T',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.486,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000264819.7',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000586994.7',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000587966.2',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000635755.1',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'nonsense_mediated_decay',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 348742,
        end: 348743
      },
      reference_allele: {
        allele_sequence: 'T'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.5633,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000264819.7',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000586994.7',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000587966.2',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000635755.1',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'nonsense_mediated_decay',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 348900,
        end: 348901
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.5811,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000264819.7',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000586994.7',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000587966.2',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000635755.1',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'nonsense_mediated_decay',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 348995,
        end: 348996
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'T',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.5811,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000264819.7',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000586994.7',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000587966.2',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000635755.1',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'nonsense_mediated_decay',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 349006,
        end: 349007
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'T',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.5367,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000264819.7',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000586994.7',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000587966.2',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000635755.1',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'nonsense_mediated_decay',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 349102,
        end: 349103
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.5617,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000264819.7',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000586994.7',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000587966.2',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000635755.1',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'nonsense_mediated_decay',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 349195,
        end: 349196
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'T',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.5803,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000264819.7',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000586994.7',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000587966.2',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000635755.1',
              gene_stable_id: 'ENSG00000105556',
              gene_symbol: 'MIER2',
              biotype: 'nonsense_mediated_decay',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'deletion',
      location: {
        region_name: '19',
        start: 349397,
        end: 349399
      },
      reference_allele: {
        allele_sequence: 'CT'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'DEL',
          representative_population_allele_frequency: null,
          predicted_molecular_consequences: []
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 352659,
        end: 352660
      },
      reference_allele: {
        allele_sequence: 'A'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.0853,
          predicted_molecular_consequences: [
            {
              feature_type: null,
              consequences: ['intergenic_variant']
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 352699,
        end: 352700
      },
      reference_allele: {
        allele_sequence: 'T'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.8077,
          predicted_molecular_consequences: [
            {
              feature_type: null,
              consequences: ['intergenic_variant']
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 354247,
        end: 354248
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'T',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.5579,
          predicted_molecular_consequences: [
            {
              feature_type: null,
              consequences: ['intergenic_variant']
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'insertion',
      location: {
        region_name: '19',
        start: 354491,
        end: 354492
      },
      reference_allele: {
        allele_sequence: 'A'
      },
      alternative_alleles: [
        {
          allele_sequence: 'ATT',
          allele_type: 'INS',
          representative_population_allele_frequency: null,
          predicted_molecular_consequences: []
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 355010,
        end: 355011
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.5431,
          predicted_molecular_consequences: [
            {
              feature_type: null,
              consequences: ['intergenic_variant']
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 355353,
        end: 355354
      },
      reference_allele: {
        allele_sequence: 'A'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.5561,
          predicted_molecular_consequences: [
            {
              feature_type: null,
              consequences: ['intergenic_variant']
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'deletion',
      location: {
        region_name: '19',
        start: 355621,
        end: 355623
      },
      reference_allele: {
        allele_sequence: 'CT'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'DEL',
          representative_population_allele_frequency: null,
          predicted_molecular_consequences: []
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 355758,
        end: 355759
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.7722,
          predicted_molecular_consequences: [
            {
              feature_type: null,
              consequences: ['intergenic_variant']
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 355837,
        end: 355838
      },
      reference_allele: {
        allele_sequence: 'A'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.7728,
          predicted_molecular_consequences: [
            {
              feature_type: null,
              consequences: ['intergenic_variant']
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 356002,
        end: 356003
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.5519,
          predicted_molecular_consequences: [
            {
              feature_type: null,
              consequences: ['intergenic_variant']
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 364070,
        end: 364071
      },
      reference_allele: {
        allele_sequence: 'T'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.5339,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['downstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 364115,
        end: 364116
      },
      reference_allele: {
        allele_sequence: 'A'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.38,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['downstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 364144,
        end: 364145
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.5369,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['downstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 365479,
        end: 365480
      },
      reference_allele: {
        allele_sequence: 'A'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.501,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['downstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 366054,
        end: 366055
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'T',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.0148,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['downstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 366411,
        end: 366412
      },
      reference_allele: {
        allele_sequence: 'A'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.5563,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['downstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 366612,
        end: 366613
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.0575,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['downstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 366773,
        end: 366774
      },
      reference_allele: {
        allele_sequence: 'T'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.0803,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['downstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 366803,
        end: 366804
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'T',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.2348,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['downstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 366839,
        end: 366840
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.0591,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['downstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 366845,
        end: 366846
      },
      reference_allele: {
        allele_sequence: 'T'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.4816,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['downstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 367088,
        end: 367089
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.0651,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['missense_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['missense_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['downstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['synonymous_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 367312,
        end: 367313
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.52,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['intron_variant', 'non_coding_transcript_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 367978,
        end: 367979
      },
      reference_allele: {
        allele_sequence: 'A'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.5282,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['intron_variant', 'non_coding_transcript_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 369287,
        end: 369288
      },
      reference_allele: {
        allele_sequence: 'A'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.1494,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['intron_variant', 'non_coding_transcript_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 369525,
        end: 369526
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'T',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.1817,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['intron_variant', 'non_coding_transcript_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 370246,
        end: 370247
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.9499,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['intron_variant', 'non_coding_transcript_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 370468,
        end: 370469
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.1895,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['intron_variant', 'non_coding_transcript_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 370590,
        end: 370591
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.1522,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['intron_variant', 'non_coding_transcript_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 370592,
        end: 370593
      },
      reference_allele: {
        allele_sequence: 'A'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.1647,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['intron_variant', 'non_coding_transcript_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 370601,
        end: 370602
      },
      reference_allele: {
        allele_sequence: 'A'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.9439,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['intron_variant', 'non_coding_transcript_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 370802,
        end: 370803
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'T',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.234,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['intron_variant', 'non_coding_transcript_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'deletion',
      location: {
        region_name: '19',
        start: 370865,
        end: 370867
      },
      reference_allele: {
        allele_sequence: 'AG'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'DEL',
          representative_population_allele_frequency: null,
          predicted_molecular_consequences: []
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 371175,
        end: 371176
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'T',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.0054,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['intron_variant', 'non_coding_transcript_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 371966,
        end: 371967
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.1967,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['intron_variant', 'non_coding_transcript_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 372347,
        end: 372348
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.2031,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['intron_variant', 'non_coding_transcript_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 372550,
        end: 372551
      },
      reference_allele: {
        allele_sequence: 'A'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.9395,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['intron_variant', 'non_coding_transcript_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 372866,
        end: 372867
      },
      reference_allele: {
        allele_sequence: 'T'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.9441,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['intron_variant', 'non_coding_transcript_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 372874,
        end: 372875
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'T',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.1853,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['intron_variant', 'non_coding_transcript_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'deletion',
      location: {
        region_name: '19',
        start: 373617,
        end: 373619
      },
      reference_allele: {
        allele_sequence: 'GC'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'DEL',
          representative_population_allele_frequency: null,
          predicted_molecular_consequences: []
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 374491,
        end: 374492
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.5717,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['5_prime_UTR_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 374546,
        end: 374547
      },
      reference_allele: {
        allele_sequence: 'T'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.2943,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['5_prime_UTR_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 374635,
        end: 374636
      },
      reference_allele: {
        allele_sequence: 'T'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.021,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 374703,
        end: 374704
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'T',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.252,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 375492,
        end: 375493
      },
      reference_allele: {
        allele_sequence: 'A'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.8916,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['intron_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 376007,
        end: 376008
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'T',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.3708,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['5_prime_UTR_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 376262,
        end: 376263
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.1591,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 378149,
        end: 378150
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.1326,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['upstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 378536,
        end: 378537
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'T',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.2879,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['upstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 379002,
        end: 379003
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'T',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.2732,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000342640.9',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000346878.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000528213.1',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000530711.3',
              gene_stable_id: 'ENSG00000105549',
              gene_symbol: 'SPMAP2',
              biotype: 'protein_coding',
              is_canonical: false,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['upstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 387594,
        end: 387595
      },
      reference_allele: {
        allele_sequence: 'A'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.1951,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 388962,
        end: 388963
      },
      reference_allele: {
        allele_sequence: 'T'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.2053,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 389016,
        end: 389017
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.2143,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 389038,
        end: 389039
      },
      reference_allele: {
        allele_sequence: 'A'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.2909,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 389087,
        end: 389088
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'T',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.4511,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 389133,
        end: 389134
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.4914,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 389283,
        end: 389284
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.4181,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 389285,
        end: 389286
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.4181,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 389288,
        end: 389289
      },
      reference_allele: {
        allele_sequence: 'T'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.4846,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 389289,
        end: 389290
      },
      reference_allele: {
        allele_sequence: 'T'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.4844,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 389396,
        end: 389397
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.3275,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 389610,
        end: 389611
      },
      reference_allele: {
        allele_sequence: 'T'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.2989,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 389614,
        end: 389615
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'T',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.394,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 389756,
        end: 389757
      },
      reference_allele: {
        allele_sequence: 'A'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.3894,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 390182,
        end: 390183
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'T',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.1849,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 390205,
        end: 390206
      },
      reference_allele: {
        allele_sequence: 'T'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.617,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 390318,
        end: 390319
      },
      reference_allele: {
        allele_sequence: 'T'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.4453,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 390626,
        end: 390627
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'T',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.6663,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 391104,
        end: 391105
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.1693,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 391105,
        end: 391106
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.1695,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 391124,
        end: 391125
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.1707,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 391295,
        end: 391296
      },
      reference_allele: {
        allele_sequence: 'T'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.4996,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 391485,
        end: 391486
      },
      reference_allele: {
        allele_sequence: 'T'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.4233,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 391568,
        end: 391569
      },
      reference_allele: {
        allele_sequence: 'T'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.4972,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 391618,
        end: 391619
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.1556,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000662087.1',
              gene_stable_id: 'ENSG00000286667',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 396947,
        end: 396948
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.6078,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000591757.2',
              gene_stable_id: 'ENSG00000267443',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['upstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 397312,
        end: 397313
      },
      reference_allele: {
        allele_sequence: 'A'
      },
      alternative_alleles: [
        {
          allele_sequence: 'T',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.1468,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000591757.2',
              gene_stable_id: 'ENSG00000267443',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['upstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 397530,
        end: 397531
      },
      reference_allele: {
        allele_sequence: 'T'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.5948,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000591757.2',
              gene_stable_id: 'ENSG00000267443',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['upstream_gene_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 397771,
        end: 397772
      },
      reference_allele: {
        allele_sequence: 'T'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.2292,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000591757.2',
              gene_stable_id: 'ENSG00000267443',
              gene_symbol: '',
              biotype: 'lncRNA',
              is_canonical: true,
              consequences: ['intron_variant', 'non_coding_transcript_variant'],
              strand: 'forward'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 405633,
        end: 405634
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'T',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.0795,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000332235.8',
              gene_stable_id: 'ENSG00000183186',
              gene_symbol: 'C2CD4C',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['3_prime_UTR_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 405928,
        end: 405929
      },
      reference_allele: {
        allele_sequence: 'T'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.7462,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000332235.8',
              gene_stable_id: 'ENSG00000183186',
              gene_symbol: 'C2CD4C',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['3_prime_UTR_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 406369,
        end: 406370
      },
      reference_allele: {
        allele_sequence: 'T'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.512,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000332235.8',
              gene_stable_id: 'ENSG00000183186',
              gene_symbol: 'C2CD4C',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['3_prime_UTR_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 406496,
        end: 406497
      },
      reference_allele: {
        allele_sequence: 'A'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.6308,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000332235.8',
              gene_stable_id: 'ENSG00000183186',
              gene_symbol: 'C2CD4C',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['3_prime_UTR_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 406723,
        end: 406724
      },
      reference_allele: {
        allele_sequence: 'A'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.625,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000332235.8',
              gene_stable_id: 'ENSG00000183186',
              gene_symbol: 'C2CD4C',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['3_prime_UTR_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 406738,
        end: 406739
      },
      reference_allele: {
        allele_sequence: 'A'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.5809,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000332235.8',
              gene_stable_id: 'ENSG00000183186',
              gene_symbol: 'C2CD4C',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['3_prime_UTR_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 406933,
        end: 406934
      },
      reference_allele: {
        allele_sequence: 'C'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.7069,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000332235.8',
              gene_stable_id: 'ENSG00000183186',
              gene_symbol: 'C2CD4C',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['3_prime_UTR_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 406990,
        end: 406991
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.8329,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000332235.8',
              gene_stable_id: 'ENSG00000183186',
              gene_symbol: 'C2CD4C',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['3_prime_UTR_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 407899,
        end: 407900
      },
      reference_allele: {
        allele_sequence: 'A'
      },
      alternative_alleles: [
        {
          allele_sequence: 'G',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.7428,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000332235.8',
              gene_stable_id: 'ENSG00000183186',
              gene_symbol: 'C2CD4C',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['synonymous_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 409976,
        end: 409977
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.7278,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000332235.8',
              gene_stable_id: 'ENSG00000183186',
              gene_symbol: 'C2CD4C',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 411848,
        end: 411849
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.3596,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000264554.11',
              gene_stable_id: 'ENSG00000129946',
              gene_symbol: 'SHC2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000332235.8',
              gene_stable_id: 'ENSG00000183186',
              gene_symbol: 'C2CD4C',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000587423.5',
              gene_stable_id: 'ENSG00000129946',
              gene_symbol: 'SHC2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['downstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000588376.5',
              gene_stable_id: 'ENSG00000129946',
              gene_symbol: 'SHC2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['downstream_gene_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 412083,
        end: 412084
      },
      reference_allele: {
        allele_sequence: 'T'
      },
      alternative_alleles: [
        {
          allele_sequence: 'C',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.6548,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000264554.11',
              gene_stable_id: 'ENSG00000129946',
              gene_symbol: 'SHC2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000332235.8',
              gene_stable_id: 'ENSG00000183186',
              gene_symbol: 'C2CD4C',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000587423.5',
              gene_stable_id: 'ENSG00000129946',
              gene_symbol: 'SHC2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['downstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000588376.5',
              gene_stable_id: 'ENSG00000129946',
              gene_symbol: 'SHC2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['downstream_gene_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    },
    {
      name: '.',
      allele_type: 'SNV',
      location: {
        region_name: '19',
        start: 412867,
        end: 412868
      },
      reference_allele: {
        allele_sequence: 'G'
      },
      alternative_alleles: [
        {
          allele_sequence: 'A',
          allele_type: 'SNV',
          representative_population_allele_frequency: 0.4744,
          predicted_molecular_consequences: [
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000264554.11',
              gene_stable_id: 'ENSG00000129946',
              gene_symbol: 'SHC2',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['downstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000332235.8',
              gene_stable_id: 'ENSG00000183186',
              gene_symbol: 'C2CD4C',
              biotype: 'protein_coding',
              is_canonical: true,
              consequences: ['upstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000587423.5',
              gene_stable_id: 'ENSG00000129946',
              gene_symbol: 'SHC2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['downstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000588376.5',
              gene_stable_id: 'ENSG00000129946',
              gene_symbol: 'SHC2',
              biotype: 'retained_intron',
              is_canonical: false,
              consequences: ['downstream_gene_variant'],
              strand: 'reverse'
            },
            {
              feature_type: 'transcript',
              stable_id: 'ENST00000590170.3',
              gene_stable_id: 'ENSG00000129946',
              gene_symbol: 'SHC2',
              biotype: 'nonsense_mediated_decay',
              is_canonical: false,
              consequences: ['downstream_gene_variant'],
              strand: 'reverse'
            }
          ]
        }
      ]
    }
  ]
} satisfies VepResultsResponse;

export default mockVepResults;
