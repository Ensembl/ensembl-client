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

import { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

export default [
  {
    genome_id: 'homo_sapiens38',
    genome_tag: 'grch38',
    common_name: 'Human',
    scientific_name: 'Homo sapiens',
    species_taxonomy_id: '9606',
    assembly: {
      accession_id: 'GCA_000001405.15',
      name: 'GRCh38'
    },
    release: {
      name: '2025-02',
      type: 'integrated'
    },
    type: null,
    is_reference: true,
    isEnabled: true,
    selectedAt: Date.now()
  },
  {
    genome_id: 'homo_sapiens37',
    genome_tag: 'grch37',
    common_name: 'Human',
    scientific_name: 'Homo sapiens',
    species_taxonomy_id: '9606',
    assembly: {
      accession_id: 'GCA_000001405.14',
      name: 'GRCh37.p13'
    },
    release: {
      name: '2025-02',
      type: 'integrated'
    },
    type: null,
    is_reference: false,
    isEnabled: true,
    selectedAt: Date.now()
  },
  {
    genome_id: 'bifidobacterium_longum_subsp_longum_cect_7347',
    genome_tag: null,
    common_name: null,
    scientific_name: 'Bifidobacterium longum subsp. longum CECT 7347',
    species_taxonomy_id: '1205679',
    assembly: {
      accession_id: 'GCA_001050555.1',
      name: 'ASM105055v1'
    },
    release: {
      name: '2025-02',
      type: 'integrated'
    },
    type: null,
    is_reference: false,
    isEnabled: true,
    selectedAt: Date.now()
  },
  {
    genome_id: 'arabidopsis_thaliana',
    genome_tag: null,
    common_name: 'Thale cress',
    scientific_name: 'Arabidopsis thaliana',
    species_taxonomy_id: '3702',
    assembly: {
      accession_id: 'GCA_000001735.2',
      name: 'TAIR10'
    },
    release: {
      name: '2025-02',
      type: 'integrated'
    },
    type: null,
    is_reference: false,
    isEnabled: true,
    selectedAt: Date.now()
  },
  {
    genome_id: 'drosophila_melanogaster',
    genome_tag: null,
    common_name: 'Fruit fly',
    scientific_name: 'Drosophila melanogaster',
    species_taxonomy_id: '7227',
    assembly: {
      accession_id: 'GCA_000001215.4',
      name: 'BDGP6.22'
    },
    release: {
      name: '2025-02',
      type: 'integrated'
    },
    type: null,
    is_reference: true,
    isEnabled: true,
    selectedAt: Date.now()
  },
  {
    genome_id: 'drosophila_yakuba',
    genome_tag: null,
    common_name: null,
    scientific_name: 'Drosophila yakuba',
    species_taxonomy_id: '7245',
    assembly: {
      accession_id: 'GCA_000005975.1',
      name: 'dyak_caf1'
    },
    release: {
      name: '2025-02',
      type: 'integrated'
    },
    type: null,
    is_reference: false,
    isEnabled: true,
    selectedAt: Date.now()
  },
  {
    genome_id: 'caenorhabditis_elegans',
    genome_tag: null,
    common_name: null,
    scientific_name: 'Caenorhabditis elegans',
    species_taxonomy_id: '6239',
    assembly: {
      accession_id: 'GCA_000002985.3',
      name: 'WBcel235'
    },
    release: {
      name: '2025-02',
      type: 'integrated'
    },
    type: null,
    is_reference: true,
    isEnabled: true,
    selectedAt: Date.now()
  },
  {
    genome_id: 'mus_musculus',
    genome_tag: null,
    common_name: 'Mouse',
    scientific_name: 'Mus musculus',
    species_taxonomy_id: '10090',
    assembly: {
      accession_id: 'GCA_000001635.9',
      name: 'WBcel235'
    },
    release: {
      name: '2025-02',
      type: 'integrated'
    },
    type: null,
    is_reference: true,
    isEnabled: true,
    selectedAt: Date.now()
  },
  {
    genome_id: 'canis_lupus_familiaris',
    genome_tag: null,
    common_name: 'Dog',
    scientific_name: 'Canis lupus familiaris',
    species_taxonomy_id: '9615',
    assembly: {
      accession_id: 'GCA_014441545.1',
      name: 'ROS_Cfam_1.0'
    },
    release: {
      name: '2025-02',
      type: 'integrated'
    },
    type: null,
    is_reference: true,
    isEnabled: true,
    selectedAt: Date.now()
  },
  {
    genome_id: 'zea_mays',
    genome_tag: null,
    common_name: 'Maize',
    scientific_name: 'Zea mays',
    species_taxonomy_id: '4577',
    assembly: {
      accession_id: 'GCA_000001635.9',
      name: 'B73_RefGen_v4'
    },
    release: {
      name: '2025-02',
      type: 'integrated'
    },
    type: null,
    is_reference: true,
    isEnabled: true,
    selectedAt: Date.now()
  },
  {
    genome_id: 'escherichia_coli',
    genome_tag: null,
    common_name: null,
    scientific_name: 'Escherichia coli O157:H7 str. EDL933',
    species_taxonomy_id: '83334',
    assembly: {
      accession_id: 'GCA_000006665',
      name: 'ASM666v1'
    },
    release: {
      name: '2025-02',
      type: 'integrated'
    },
    type: null,
    is_reference: true,
    isEnabled: true,
    selectedAt: Date.now()
  }
] satisfies CommittedItem[];
