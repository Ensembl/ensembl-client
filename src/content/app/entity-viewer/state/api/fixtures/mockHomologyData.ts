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
        genome_id: '00d87371-57f1-4dc2-8f21-6bd825146a49',
        common_name: 'Cow',
        scientific_name: 'Bos taurus',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_002263795.2',
          name: 'ARS-UCD1.2',
          url: null
        }
      },
      target_gene: {
        stable_id: 'ENSBTAG00000000967.6',
        symbol: 'DET1',
        version: 6,
        unversioned_stable_id: 'ENSBTAG00000000967'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: '0de83847-786a-4e31-9aed-4be7b10ec75f',
        common_name: 'Dog',
        scientific_name: 'Canis lupus familiaris',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_014441545.1',
          name: 'ROS_Cfam_1.0',
          url: null
        }
      },
      target_gene: {
        stable_id: 'ENSCAFG00845003631.1',
        symbol: 'DET1',
        version: 1,
        unversioned_stable_id: 'ENSCAFG00845003631'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: '17318423-cb79-462f-a24f-d1a0d57d17cf',
        common_name: 'Chinese hamster CHOK1GS',
        scientific_name: 'Cricetulus griseus',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_900186095.1',
          name: 'CHOK1GS_HDv1',
          url: null
        }
      },
      target_gene: {
        stable_id: 'ENSCGRG00001015151.1',
        symbol: 'Det1',
        version: 1,
        unversioned_stable_id: 'ENSCGRG00001015151'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: '1c7f87d0-246c-4bad-9227-8d036259d868',
        common_name: 'Mexican tetra',
        scientific_name: 'Astyanax mexicanus',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000372685.2',
          name: 'Astyanax_mexicanus-2.0',
          url: null
        }
      },
      target_gene: {
        stable_id: 'ENSAMXG00000000376.2',
        symbol: 'det1',
        version: 2,
        unversioned_stable_id: 'ENSAMXG00000000376'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: '21c5a530-56b3-4929-af7e-61273298b4d2',
        common_name: 'Horse',
        scientific_name: 'Equus caballus',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_002863925.1',
          name: 'EquCab3.0',
          url: null
        }
      },
      target_gene: {
        stable_id: 'ENSECAG00000021247.4',
        symbol: 'DET1',
        version: 4,
        unversioned_stable_id: 'ENSECAG00000021247'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: '29981a48-c29d-4ec7-8ca6-67e8a2015d80',
        common_name: 'Macaque',
        scientific_name: 'Macaca mulatta',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_003339765.3',
          name: 'Mmul_10',
          url: null
        }
      },
      target_gene: {
        stable_id: 'ENSMMUG00000005758.4',
        symbol: 'DET1',
        version: 4,
        unversioned_stable_id: 'ENSMMUG00000005758'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: '359326eb-1ee5-499a-890b-08c383f90d20',
        common_name: 'Pig',
        scientific_name: 'Sus scrofa',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000003025.6',
          name: 'Sscrofa11.1',
          url: null
        }
      },
      target_gene: {
        stable_id: 'ENSSSCG00000005103.6',
        symbol: 'DET1',
        version: 6,
        unversioned_stable_id: 'ENSSSCG00000005103'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: '3c48f919-0dc9-4b20-8d9e-90744b7d7a32',
        common_name: 'Rabbit',
        scientific_name: 'Oryctolagus cuniculus',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000003625.1',
          name: 'OryCun2.0',
          url: null
        }
      },
      target_gene: {
        stable_id: 'ENSOCUG00000017555.4',
        symbol: 'DET1',
        version: 4,
        unversioned_stable_id: 'ENSOCUG00000017555'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: '3d9faa38-0913-4e54-8678-ed9773f76e60',
        common_name: 'Zebrafish',
        scientific_name: 'Danio rerio',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000002035.4',
          name: 'GRCz11',
          url: null
        }
      },
      target_gene: {
        stable_id: 'ENSDARG00000098247.2',
        symbol: 'det1',
        version: 2,
        unversioned_stable_id: 'ENSDARG00000098247'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: '44183b9a-e6c3-4fbe-bb46-c73b4a7b3c7e',
        common_name: 'Atlantic salmon',
        scientific_name: 'Salmo salar',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_905237065.2',
          name: 'Ssal_v3.1',
          url: null
        }
      },
      target_gene: {
        stable_id: 'ENSSSAG00000054657.2',
        symbol: 'DET1',
        version: 2,
        unversioned_stable_id: 'ENSSSAG00000054657'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: '49f32f73-df6b-49e9-8acb-45e8fe5ebbdf',
        common_name: 'Glycine max',
        scientific_name: 'Glycine max',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000004515.4',
          name: 'Glycine_max_v2.1',
          url: null
        }
      },
      target_gene: {
        stable_id: 'GLYMA_01G231700',
        symbol: null,
        version: null,
        unversioned_stable_id: 'GLYMA_01G231700'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: '4ad2a6aa-6cf5-4c2e-a324-cfbc95c2af8b',
        common_name: 'Chimpanzee',
        scientific_name: 'Pan troglodytes',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001515.5',
          name: 'Pan_tro_3.0',
          url: null
        }
      },
      target_gene: {
        stable_id: 'ENSPTRG00000007421.6',
        symbol: 'DET1',
        version: 6,
        unversioned_stable_id: 'ENSPTRG00000007421'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: '541201d9-635a-4349-81fc-fd0a2f1030b1',
        common_name: 'Zea mays',
        scientific_name: 'Zea mays',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_902167145.1',
          name: 'Zm-B73-REFERENCE-NAM-5.0',
          url: null
        }
      },
      target_gene: {
        stable_id: 'Zm00001eb341540',
        symbol: null,
        version: null,
        unversioned_stable_id: 'Zm00001eb341540'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
      stats: {
        query_percent_id: 23.0,
        query_percent_coverage: 94.4341,
        target_percent_id: 23.0,
        target_percent_coverage: 99.8039
      },
      alignment: null
    },
    {
      target_genome: {
        genome_id: '5ca8d1a1-3b42-40fc-bafe-5bc13d33382c',
        common_name: 'Goat',
        scientific_name: 'Capra hircus',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_001704415.1',
          name: 'ARS1',
          url: null
        }
      },
      target_gene: {
        stable_id: 'ENSCHIG00000010346.1',
        symbol: 'DET1',
        version: 1,
        unversioned_stable_id: 'ENSCHIG00000010346'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: '5d8fce33-6171-4755-8c31-984a57ba8244',
        common_name: 'Brassica oleracea',
        scientific_name: 'Brassica oleracea var. oleracea',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000695525.1',
          name: 'BOL',
          url: null
        }
      },
      target_gene: {
        stable_id: 'Bo3g044580',
        symbol: null,
        version: null,
        unversioned_stable_id: 'Bo3g044580'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: '63b9c430-329c-48bd-9165-ca830086f2c9',
        common_name: 'Cat',
        scientific_name: 'Felis catus',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000181335.4',
          name: 'Felis_catus_9.0',
          url: null
        }
      },
      target_gene: {
        stable_id: 'ENSFCAG00000014968.6',
        symbol: 'DET1',
        version: 6,
        unversioned_stable_id: 'ENSFCAG00000014968'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: '6f293c50-17a5-4801-aa8c-b4dba1f876ed',
        common_name: 'Sheep (texel)',
        scientific_name: 'Ovis aries',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000298735.1',
          name: 'Oar_v3.1',
          url: null
        }
      },
      target_gene: {
        stable_id: 'ENSOARG00000010954.1',
        symbol: null,
        version: 1,
        unversioned_stable_id: 'ENSOARG00000010954'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: '76c06dd6-5a7e-4656-b223-b1fdb63d567f',
        common_name: 'Arabidopsis thaliana',
        scientific_name: 'Arabidopsis thaliana',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001735.1',
          name: 'TAIR10',
          url: null
        }
      },
      target_gene: {
        stable_id: 'AT4G10180',
        symbol: 'DET1',
        version: null,
        unversioned_stable_id: 'AT4G10180'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: '88abdf6b-e16a-48fd-9767-3555b8b9b365',
        common_name: 'Aegilops tauschii',
        scientific_name: 'Aegilops tauschii subsp. strangulata',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_002575655.1',
          name: 'Aet v4.0',
          url: null
        }
      },
      target_gene: {
        stable_id: 'AET3Gv20472500',
        symbol: null,
        version: null,
        unversioned_stable_id: 'AET3Gv20472500'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: '8fe05926-0402-488f-b971-db4825c6d72e',
        common_name: 'Rat',
        scientific_name: 'Rattus norvegicus',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_015227675.2',
          name: 'mRatBN7.2',
          url: null
        }
      },
      target_gene: {
        stable_id: 'ENSRNOG00000018515.7',
        symbol: 'Det1',
        version: 7,
        unversioned_stable_id: 'ENSRNOG00000018515'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: '915ac71a-ecc9-49a6-add1-f739ecde2b90',
        common_name: 'Mouse',
        scientific_name: 'Mus musculus',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001635.9',
          name: 'GRCm39',
          url: null
        }
      },
      target_gene: {
        stable_id: 'ENSMUSG00000030610.14',
        symbol: 'Det1',
        version: 14,
        unversioned_stable_id: 'ENSMUSG00000030610'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: 'a7335667-93e7-11ec-a39d-005056b38ce3',
        common_name: 'Human',
        scientific_name: 'Homo sapiens',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001405.28',
          name: 'GRCh38.p13',
          url: null
        }
      },
      target_gene: {
        stable_id: 'ENSG00000140543.15',
        symbol: 'DET1',
        version: 15,
        unversioned_stable_id: 'ENSG00000140543'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: 'a73357ab-93e7-11ec-a39d-005056b38ce3',
        common_name: 'Triticum aestivum',
        scientific_name: 'Triticum aestivum',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_900519105.1',
          name: 'IWGSC',
          url: null
        }
      },
      target_gene: {
        stable_id: 'TraesCS3A02G194600',
        symbol: null,
        version: null,
        unversioned_stable_id: 'TraesCS3A02G194600'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: 'a8ddb817-82de-4230-897c-06384a8f01eb',
        common_name: 'Nile tilapia',
        scientific_name: 'Oreochromis niloticus',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_001858045.3',
          name: 'O_niloticus_UMD_NMBU',
          url: null
        }
      },
      target_gene: {
        stable_id: 'ENSONIG00000011104.2',
        symbol: 'det1',
        version: 2,
        unversioned_stable_id: 'ENSONIG00000011104'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: 'afaeb837-45a3-4a03-8ac4-c5e0118ca1cc',
        common_name: 'Hordeum vulgare',
        scientific_name: 'Hordeum vulgare subsp. vulgare',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_904849725.1',
          name: 'MorexV3_pseudomolecules_assembly',
          url: null
        }
      },
      target_gene: {
        stable_id: 'HORVU.MOREX.r3.3HG0262020',
        symbol: null,
        version: null,
        unversioned_stable_id: 'HORVU.MOREX.r3.3HG0262020'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: 'ba3074a6-b9de-45c7-be4c-3036990305d8',
        common_name: 'Vitis vinifera',
        scientific_name: 'Vitis vinifera',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_910591555.1',
          name: 'PN40024.v4',
          url: null
        }
      },
      target_gene: {
        stable_id: 'Vitvi15g00849',
        symbol: null,
        version: null,
        unversioned_stable_id: 'Vitvi15g00849'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: 'bc069fc1-f4b2-48af-997e-ea1fbb1429ea',
        common_name: 'Medicago truncatula',
        scientific_name: 'Medicago truncatula',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000219495.2',
          name: 'MedtrA17_4.0',
          url: null
        }
      },
      target_gene: {
        stable_id: 'MTR_5g008710',
        symbol: null,
        version: null,
        unversioned_stable_id: 'MTR_5g008710'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: 'c7550d32-923f-4597-80f6-e4a6c8a67db9',
        common_name: 'Chicken',
        scientific_name: 'Gallus gallus',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_016699485.1',
          name: 'bGalGal1.mat.broiler.GRCg7b',
          url: null
        }
      },
      target_gene: {
        stable_id: 'ENSGALG00010020199.1',
        symbol: 'DET1',
        version: 1,
        unversioned_stable_id: 'ENSGALG00010020199'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: 'd8223875-5f6e-4eed-980f-7d8dd53a58ba',
        common_name: 'Solanum tuberosum',
        scientific_name: 'Solanum tuberosum',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000226075.1',
          name: 'SolTub_3.0',
          url: null
        }
      },
      target_gene: {
        stable_id: 'PGSC0003DMG400031459',
        symbol: null,
        version: null,
        unversioned_stable_id: 'PGSC0003DMG400031459'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: 'ddc0e9cc-8453-4837-b9ba-3e86f5d5f420',
        common_name: 'Brassica napus',
        scientific_name: 'Brassica napus',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000751015.1',
          name: 'AST_PRJEB5043_v1',
          url: null
        }
      },
      target_gene: {
        stable_id: 'GSBRNA2T00151439001',
        symbol: 'BnaA03g24270D',
        version: null,
        unversioned_stable_id: 'GSBRNA2T00151439001'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: 'dedc3834-8dad-4b41-a03a-68719648cae4',
        common_name: 'Triticum turgidum',
        scientific_name: 'Triticum turgidum subsp. durum',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_900231445.1',
          name: 'svevo',
          url: null
        }
      },
      target_gene: {
        stable_id: 'TRITD3Av1G105180',
        symbol: null,
        version: null,
        unversioned_stable_id: 'TRITD3Av1G105180'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: 'e36e7b9d-3901-4d9f-bd44-853b200a8caf',
        common_name: 'Tropical clawed frog',
        scientific_name: 'Xenopus tropicalis',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000004195.4',
          name: 'UCB_Xtro_10.0',
          url: null
        }
      },
      target_gene: {
        stable_id: 'ENSXETG00000007591.5',
        symbol: 'det1',
        version: 5,
        unversioned_stable_id: 'ENSXETG00000007591'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: 'ea877d68-4819-43c4-8dee-157728cac494',
        common_name: 'Oryza sativa Japonica Group',
        scientific_name: 'Oryza sativa Japonica Group',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_001433935.1',
          name: 'IRGSP-1.0',
          url: null
        }
      },
      target_gene: {
        stable_id: 'Os01g0104600',
        symbol: 'OsDET1',
        version: null,
        unversioned_stable_id: 'Os01g0104600'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: 'eee9c096-9196-4bc1-a6ad-f1ff18d3fd89',
        common_name: 'Brassica rapa',
        scientific_name: 'Brassica rapa',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000309985.1',
          name: 'Brapa_1.0',
          url: null
        }
      },
      target_gene: {
        stable_id: 'Bra000702',
        symbol: null,
        version: null,
        unversioned_stable_id: 'Bra000702'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: 'f1756fce-9cab-48cb-826f-ed10afbb9bbb',
        common_name: 'Japanese medaka HdrR',
        scientific_name: 'Oryzias latipes',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_002234675.1',
          name: 'ASM223467v1',
          url: null
        }
      },
      target_gene: {
        stable_id: 'ENSORLG00000012676.2',
        symbol: 'det1',
        version: 2,
        unversioned_stable_id: 'ENSORLG00000012676'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
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
        genome_id: 'fdfbd78d-76bc-48ad-bb4d-135ed7ee9ab1',
        common_name: 'Sorghum bicolor',
        scientific_name: 'Sorghum bicolor',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000003195.3',
          name: 'Sorghum_bicolor_NCBIv3',
          url: null
        }
      },
      target_gene: {
        stable_id: 'SORBI_3007G058100',
        symbol: null,
        version: null,
        unversioned_stable_id: 'SORBI_3007G058100'
      },
      query_genome: {
        genome_id: '80e3e488-2977-4872-8d1a-21dff4dab8a8',
        common_name: 'Drosophila melanogaster (Fruit fly)',
        scientific_name: 'Drosophila melanogaster',
        genome_type: null,
        assembly: {
          accession_id: 'GCA_000001215.4',
          name: 'BDGP6.46',
          url: null
        }
      },
      query_gene: {
        stable_id: 'FBgn0000018',
        symbol: 'abo',
        version: null,
        unversioned_stable_id: 'FBgn0000018'
      },
      type: 'homology',
      subtype: {
        accession_id: 'homology_subtype.homolog_rbbh',
        label: 'RBBH',
        value: 'homolog_rbbh',
        definition: 'Reciprocal best BLAST hit homolog',
        description: null
      },
      release_version: 101.0,
      stats: {
        query_percent_id: 24.0,
        query_percent_coverage: 95.3618,
        target_percent_id: 24.0,
        target_percent_coverage: 100.0
      },
      alignment: null
    }
  ]
} as unknown as MockHomologiesResponse;

export default homologies;
