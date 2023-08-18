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

import type { GeneHomology } from '../types/geneHomology';

export type MockHomologiesResponse = {
  homologies: GeneHomology[];
};

const homologies = {
  homologies: [
    {
      target_genome: {
        genome_id: 'aegilops_tauschii',
        common_name: 'aegilops_tauschii',
        scientific_name: 'aegilops_tauschii',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'AET3Gv20472500',
        symbol: null,
        version: 0,
        unversioned_stable_id: 'AET3Gv20472500'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 25.0,
        query_percent_coverage: 93.692,
        target_percent_id: 25.0,
        target_percent_coverage: 91.9854
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'arabidopsis_thaliana',
        common_name: 'arabidopsis_thaliana',
        scientific_name: 'arabidopsis_thaliana',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'AT4G10180',
        symbol: 'DET1',
        version: 0,
        unversioned_stable_id: 'AT4G10180'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 23.0,
        query_percent_coverage: 99.0724,
        target_percent_id: 23.0,
        target_percent_coverage: 98.3425
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'astyanax_mexicanus',
        common_name: 'astyanax_mexicanus',
        scientific_name: 'astyanax_mexicanus',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'ENSAMXG00000000376.2',
        symbol: 'det1',
        version: 2,
        unversioned_stable_id: 'ENSAMXG00000000376'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 27.0,
        query_percent_coverage: 100.0,
        target_percent_id: 27.0,
        target_percent_coverage: 99.1055
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'bos_taurus',
        common_name: 'bos_taurus',
        scientific_name: 'bos_taurus',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'ENSBTAG00000000967.6',
        symbol: 'DET1',
        version: 6,
        unversioned_stable_id: 'ENSBTAG00000000967'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 27.0,
        query_percent_coverage: 100.0,
        target_percent_id: 27.0,
        target_percent_coverage: 100.0
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'brassica_napus',
        common_name: 'brassica_napus',
        scientific_name: 'brassica_napus',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'GSBRNA2T00151439001',
        symbol: 'BnaA03g24270D',
        version: 0,
        unversioned_stable_id: 'GSBRNA2T00151439001'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 24.0,
        query_percent_coverage: 98.8868,
        target_percent_id: 24.0,
        target_percent_coverage: 99.2551
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'brassica_oleracea',
        common_name: 'brassica_oleracea',
        scientific_name: 'brassica_oleracea',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'Bo3g044580',
        symbol: null,
        version: 0,
        unversioned_stable_id: 'Bo3g044580'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 25.0,
        query_percent_coverage: 98.8868,
        target_percent_id: 25.0,
        target_percent_coverage: 99.4403
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'brassica_rapa',
        common_name: 'brassica_rapa',
        scientific_name: 'brassica_rapa',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'Bra000702',
        symbol: null,
        version: 0,
        unversioned_stable_id: 'Bra000702'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 24.0,
        query_percent_coverage: 98.8868,
        target_percent_id: 24.0,
        target_percent_coverage: 99.2551
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'canis_lupus_familiaris',
        common_name: 'canis_lupus_familiaris',
        scientific_name: 'canis_lupus_familiaris',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'ENSCAFG00845003631.1',
        symbol: 'DET1',
        version: 1,
        unversioned_stable_id: 'ENSCAFG00845003631'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 27.0,
        query_percent_coverage: 100.0,
        target_percent_id: 27.0,
        target_percent_coverage: 100.0
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'capra_hircus',
        common_name: 'capra_hircus',
        scientific_name: 'capra_hircus',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'ENSCHIG00000010346.1',
        symbol: 'DET1',
        version: 1,
        unversioned_stable_id: 'ENSCHIG00000010346'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 27.0,
        query_percent_coverage: 100.0,
        target_percent_id: 27.0,
        target_percent_coverage: 100.0
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'cricetulus_griseus_chok1gshd',
        common_name: 'cricetulus_griseus_chok1gshd',
        scientific_name: 'cricetulus_griseus_chok1gshd',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'ENSCGRG00001015151.1',
        symbol: 'Det1',
        version: 1,
        unversioned_stable_id: 'ENSCGRG00001015151'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 27.0,
        query_percent_coverage: 100.0,
        target_percent_id: 27.0,
        target_percent_coverage: 100.0
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'danio_rerio',
        common_name: 'danio_rerio',
        scientific_name: 'danio_rerio',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'ENSDARG00000098247.2',
        symbol: 'det1',
        version: 2,
        unversioned_stable_id: 'ENSDARG00000098247'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 27.0,
        query_percent_coverage: 100.0,
        target_percent_id: 27.0,
        target_percent_coverage: 99.1119
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'equus_caballus',
        common_name: 'equus_caballus',
        scientific_name: 'equus_caballus',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'ENSECAG00000021247.4',
        symbol: 'DET1',
        version: 4,
        unversioned_stable_id: 'ENSECAG00000021247'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 26.0,
        query_percent_coverage: 92.5788,
        target_percent_id: 26.0,
        target_percent_coverage: 87.6977
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'felis_catus',
        common_name: 'felis_catus',
        scientific_name: 'felis_catus',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'ENSFCAG00000014968.6',
        symbol: 'DET1',
        version: 6,
        unversioned_stable_id: 'ENSFCAG00000014968'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 27.0,
        query_percent_coverage: 100.0,
        target_percent_id: 27.0,
        target_percent_coverage: 100.0
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'gallus_gallus',
        common_name: 'gallus_gallus',
        scientific_name: 'gallus_gallus',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'ENSGALG00010020199.1',
        symbol: 'DET1',
        version: 1,
        unversioned_stable_id: 'ENSGALG00010020199'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 26.0,
        query_percent_coverage: 100.0,
        target_percent_id: 26.0,
        target_percent_coverage: 100.0
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'glycine_max',
        common_name: 'glycine_max',
        scientific_name: 'glycine_max',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'GLYMA_01G231700',
        symbol: null,
        version: 0,
        unversioned_stable_id: 'GLYMA_01G231700'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 22.0,
        query_percent_coverage: 96.475,
        target_percent_id: 22.0,
        target_percent_coverage: 97.0149
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'homo_sapiens',
        common_name: 'homo_sapiens',
        scientific_name: 'homo_sapiens',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'ENSG00000140543.15',
        symbol: 'DET1',
        version: 15,
        unversioned_stable_id: 'ENSG00000140543'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 27.0,
        query_percent_coverage: 100.0,
        target_percent_id: 27.0,
        target_percent_coverage: 100.0
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'hordeum_vulgare',
        common_name: 'hordeum_vulgare',
        scientific_name: 'hordeum_vulgare',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'HORVU.MOREX.r3.3HG0262020',
        symbol: null,
        version: 0,
        unversioned_stable_id: 'HORVU.MOREX.r3.3HG0262020'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 25.0,
        query_percent_coverage: 93.5065,
        target_percent_id: 25.0,
        target_percent_coverage: 98.6301
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'macaca_mulatta',
        common_name: 'macaca_mulatta',
        scientific_name: 'macaca_mulatta',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'ENSMMUG00000005758.4',
        symbol: 'DET1',
        version: 4,
        unversioned_stable_id: 'ENSMMUG00000005758'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 27.0,
        query_percent_coverage: 100.0,
        target_percent_id: 27.0,
        target_percent_coverage: 100.0
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'medicago_truncatula',
        common_name: 'medicago_truncatula',
        scientific_name: 'medicago_truncatula',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'MTR_5g008710',
        symbol: null,
        version: 0,
        unversioned_stable_id: 'MTR_5g008710'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 22.0,
        query_percent_coverage: 97.0315,
        target_percent_id: 22.0,
        target_percent_coverage: 97.0315
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'mus_musculus',
        common_name: 'mus_musculus',
        scientific_name: 'mus_musculus',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'ENSMUSG00000030610.14',
        symbol: 'Det1',
        version: 14,
        unversioned_stable_id: 'ENSMUSG00000030610'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 27.0,
        query_percent_coverage: 100.0,
        target_percent_id: 27.0,
        target_percent_coverage: 100.0
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'oreochromis_niloticus',
        common_name: 'oreochromis_niloticus',
        scientific_name: 'oreochromis_niloticus',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'ENSONIG00000011104.2',
        symbol: 'det1',
        version: 2,
        unversioned_stable_id: 'ENSONIG00000011104'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 28.0,
        query_percent_coverage: 100.0,
        target_percent_id: 28.0,
        target_percent_coverage: 96.0
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'oryctolagus_cuniculus',
        common_name: 'oryctolagus_cuniculus',
        scientific_name: 'oryctolagus_cuniculus',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'ENSOCUG00000017555.4',
        symbol: 'DET1',
        version: 4,
        unversioned_stable_id: 'ENSOCUG00000017555'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 27.0,
        query_percent_coverage: 100.0,
        target_percent_id: 27.0,
        target_percent_coverage: 100.0
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'oryza_sativa',
        common_name: 'oryza_sativa',
        scientific_name: 'oryza_sativa',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'Os01g0104600',
        symbol: 'OsDET1',
        version: 0,
        unversioned_stable_id: 'Os01g0104600'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 24.0,
        query_percent_coverage: 91.4657,
        target_percent_id: 24.0,
        target_percent_coverage: 96.4775
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'oryzias_latipes',
        common_name: 'oryzias_latipes',
        scientific_name: 'oryzias_latipes',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'ENSORLG00000012676.2',
        symbol: 'det1',
        version: 2,
        unversioned_stable_id: 'ENSORLG00000012676'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 28.0,
        query_percent_coverage: 100.0,
        target_percent_id: 28.0,
        target_percent_coverage: 98.7633
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'ovis_aries',
        common_name: 'ovis_aries',
        scientific_name: 'ovis_aries',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'ENSOARG00000010954.1',
        symbol: null,
        version: 1,
        unversioned_stable_id: 'ENSOARG00000010954'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 28.0,
        query_percent_coverage: 100.0,
        target_percent_id: 28.0,
        target_percent_coverage: 100.0
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'pan_troglodytes',
        common_name: 'pan_troglodytes',
        scientific_name: 'pan_troglodytes',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'ENSPTRG00000007421.6',
        symbol: 'DET1',
        version: 6,
        unversioned_stable_id: 'ENSPTRG00000007421'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 27.0,
        query_percent_coverage: 100.0,
        target_percent_id: 27.0,
        target_percent_coverage: 100.0
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'rattus_norvegicus',
        common_name: 'rattus_norvegicus',
        scientific_name: 'rattus_norvegicus',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'ENSRNOG00000018515.7',
        symbol: 'Det1',
        version: 7,
        unversioned_stable_id: 'ENSRNOG00000018515'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 27.0,
        query_percent_coverage: 100.0,
        target_percent_id: 27.0,
        target_percent_coverage: 100.0
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'salmo_salar',
        common_name: 'salmo_salar',
        scientific_name: 'salmo_salar',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'ENSSSAG00000054657.2',
        symbol: 'DET1',
        version: 2,
        unversioned_stable_id: 'ENSSSAG00000054657'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 27.0,
        query_percent_coverage: 100.0,
        target_percent_id: 27.0,
        target_percent_coverage: 100.0
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'solanum_lycopersicum',
        common_name: 'solanum_lycopersicum',
        scientific_name: 'solanum_lycopersicum',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'Solyc01g056340.3',
        symbol: 'DET1',
        version: 0,
        unversioned_stable_id: 'Solyc01g056340.3'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 22.0,
        query_percent_coverage: 94.4341,
        target_percent_id: 22.0,
        target_percent_coverage: 97.3231
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'solanum_tuberosum',
        common_name: 'solanum_tuberosum',
        scientific_name: 'solanum_tuberosum',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'PGSC0003DMG400031459',
        symbol: null,
        version: 0,
        unversioned_stable_id: 'PGSC0003DMG400031459'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 23.0,
        query_percent_coverage: 51.7625,
        target_percent_id: 23.0,
        target_percent_coverage: 93.9394
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'sorghum_bicolor',
        common_name: 'sorghum_bicolor',
        scientific_name: 'sorghum_bicolor',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'SORBI_3007G058100',
        symbol: null,
        version: 0,
        unversioned_stable_id: 'SORBI_3007G058100'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 24.0,
        query_percent_coverage: 95.3618,
        target_percent_id: 24.0,
        target_percent_coverage: 100.0
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'sus_scrofa',
        common_name: 'sus_scrofa',
        scientific_name: 'sus_scrofa',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'ENSSSCG00000005103.6',
        symbol: 'DET1',
        version: 6,
        unversioned_stable_id: 'ENSSSCG00000005103'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 27.0,
        query_percent_coverage: 100.0,
        target_percent_id: 27.0,
        target_percent_coverage: 100.0
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'triticum_aestivum',
        common_name: 'triticum_aestivum',
        scientific_name: 'triticum_aestivum',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'TraesCS3A02G194600',
        symbol: null,
        version: 0,
        unversioned_stable_id: 'TraesCS3A02G194600'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 25.0,
        query_percent_coverage: 93.692,
        target_percent_id: 25.0,
        target_percent_coverage: 98.8258
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'triticum_turgidum',
        common_name: 'triticum_turgidum',
        scientific_name: 'triticum_turgidum',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'TRITD3Av1G105180',
        symbol: null,
        version: 0,
        unversioned_stable_id: 'TRITD3Av1G105180'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 25.0,
        query_percent_coverage: 93.8775,
        target_percent_id: 25.0,
        target_percent_coverage: 98.8281
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'vitis_vinifera',
        common_name: 'vitis_vinifera',
        scientific_name: 'vitis_vinifera',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'Vitvi15g00849',
        symbol: null,
        version: 0,
        unversioned_stable_id: 'Vitvi15g00849'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 23.0,
        query_percent_coverage: 97.4026,
        target_percent_id: 23.0,
        target_percent_coverage: 98.8701
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'xenopus_tropicalis',
        common_name: 'xenopus_tropicalis',
        scientific_name: 'xenopus_tropicalis',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'ENSXETG00000007591.5',
        symbol: 'det1',
        version: 5,
        unversioned_stable_id: 'ENSXETG00000007591'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 27.0,
        query_percent_coverage: 100.0,
        target_percent_id: 27.0,
        target_percent_coverage: 100.0
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: 'zea_mays',
        common_name: 'zea_mays',
        scientific_name: 'zea_mays',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      target_gene: {
        stable_id: 'Zm00001eb341540',
        symbol: null,
        version: 0,
        unversioned_stable_id: 'Zm00001eb341540'
      },
      query_genome: {
        genome_id: 'drosophila_melanogaster',
        common_name: 'drosophila_melanogaster',
        scientific_name: 'drosophila_melanogaster',
        genome_type: 'reference',
        assembly: {
          accession_id: 'drosophila_melanogaster',
          name: 'drosophila_melanogaster',
          url: 'drosophila_melanogaster'
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: 0,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: 'homolog_rbbh',
      version: 100.0,
      stats: {
        query_percent_id: 23.0,
        query_percent_coverage: 94.4341,
        target_percent_id: 23.0,
        target_percent_coverage: 99.8039
      },
      alignment: null
    }
  ]
} as unknown as MockHomologiesResponse;

export default homologies;
