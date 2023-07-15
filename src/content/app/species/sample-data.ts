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

import { SpeciesSidebarPayload } from 'src/content/app/species/state/sidebar/speciesSidebarSlice';

type SpeciesSidebarData = {
  [genomeId: string]: SpeciesSidebarPayload;
};

export const sidebarData: SpeciesSidebarData = {
  'a7335667-93e7-11ec-a39d-005056b38ce3': {
    id: 'GCA_000001405.28',
    taxonomy_id: '9606',
    strain: null,
    database_version: '108.38',
    common_name: 'Human',
    scientific_name: 'Homo sapiens',
    gencode_version: 'GENCODE 34',
    assembly_name: 'GRCh38.p13',
    assembly_provider: {
      name: 'INSDC assembly',
      url: 'https://www.ebi.ac.uk/ena/data/view/GCA_000001405.28'
    },
    annotation_provider: {
      name: 'Ensembl',
      url: 'https://www.ensembl.org'
    },
    assembly_level: 'complete genome',
    annotation_method: 'full genebuild',
    assembly_date: '2019-02-28',
    notes: []
  },
  '3704ceb1-948d-11ec-a39d-005056b38ce3': {
    id: 'GCA_000001405.14',
    taxonomy_id: '9606',
    strain: null,
    database_version: '108.37',
    common_name: 'Human',
    scientific_name: 'Homo sapiens',
    gencode_version: 'GENCODE 19',
    assembly_name: 'GRCh37.p13',
    assembly_provider: {
      name: 'INSDC assembly',
      url: 'https://www.ebi.ac.uk/ena/browser/view/GCA_000001405.14'
    },
    annotation_provider: {
      name: 'Ensembl',
      url: 'https://www.ensembl.org'
    },
    assembly_level: 'complete genome',
    annotation_method: 'full genebuild',
    assembly_date: '2013-06-28',
    notes: []
  },
  'a73351f7-93e7-11ec-a39d-005056b38ce3': {
    id: 'GCA_000005845.2',
    taxonomy_id: '511145',
    strain: null,
    database_version: '108.1',
    common_name: null,
    scientific_name: 'Escherichia coli str. K-12 substr. MG1655',
    gencode_version: null,
    assembly_name: 'ASM584v2',
    assembly_provider: {
      name: 'INSDC assembly',
      url: ''
    },
    annotation_provider: {
      name: 'European Nucleotide Archive',
      url: 'http://www.ensembl.org'
    },
    assembly_level: 'complete genome',
    annotation_method: 'Generated from ENA annotation',
    assembly_date: '2013-09-26',
    notes: []
  },
  'a733550b-93e7-11ec-a39d-005056b38ce3': {
    id: 'GCA_000002985.3',
    taxonomy_id: '6239',
    strain: {
      type: 'Strain',
      value: 'N2'
    },
    database_version: '108.282',
    common_name: null,
    scientific_name: 'Caenorhabditis elegans',
    gencode_version: null,
    assembly_name: 'WBcel235',
    assembly_provider: {
      name: 'WormBase',
      url: 'http://www.wormbase.org'
    },
    annotation_provider: {
      name: 'WormBase',
      url: 'http://www.wormbase.org'
    },
    assembly_level: 'complete genome',
    annotation_method: 'Import',
    assembly_date: '2013-02-07',
    notes: []
  },
  'a73356e1-93e7-11ec-a39d-005056b38ce3': {
    id: 'GCA_000002765.2',
    taxonomy_id: '36329',
    strain: null,
    database_version: '108.1',
    common_name: null,
    scientific_name: 'Plasmodium falciparum 3D7',
    gencode_version: null,
    assembly_name: 'ASM276v2',
    assembly_provider: {
      name: 'Naval Medical Research Institute',
      url: 'http://www.ensembl.org'
    },
    annotation_provider: {
      name: '',
      url: ''
    },
    assembly_level: 'complete genome',
    annotation_method: 'Import',
    assembly_date: '2016-04-07',
    notes: []
  },
  'a733574a-93e7-11ec-a39d-005056b38ce3': {
    id: 'GCA_000146045.2',
    taxonomy_id: '559292',
    strain: {
      type: 'Strain',
      value: 'S288C'
    },
    database_version: '108.4',
    common_name: 'Brewers yeast',
    scientific_name: 'Saccharomyces cerevisiae',
    gencode_version: null,
    assembly_name: 'R64',
    assembly_provider: {
      name: 'Saccharomyces Genome Database',
      url: ''
    },
    annotation_provider: {
      name: 'Saccharomyces Genome Database',
      url: 'http://www.yeastgenome.org'
    },
    assembly_level: 'complete genome',
    annotation_method: 'Import',
    assembly_date: '2014-12-17',
    notes: []
  },
  'a73357ab-93e7-11ec-a39d-005056b38ce3': {
    id: 'GCA_900519105.1',
    taxonomy_id: '4565',
    strain: {
      type: 'Cultivar',
      value: 'Chinese Spring'
    },
    database_version: '108.4',
    common_name: 'Wheat',
    scientific_name: 'Triticum aestivum',
    gencode_version: null,
    assembly_name: 'IWGSC RefSeq v1.0',
    assembly_provider: {
      name: 'International Wheat Genome Sequencing Consortium',
      url: 'https://www.ebi.ac.uk/ena/data/view/GCA_900519105.1'
    },
    annotation_provider: {
      name: 'International Wheat Genome Sequencing Consortium',
      url: 'https://www.ebi.ac.uk/ena/data/view/GCA_900519105.1'
    },
    assembly_level: 'complete genome',
    annotation_method: 'Import',
    assembly_date: '2018-08-20',
    notes: []
  }
};
