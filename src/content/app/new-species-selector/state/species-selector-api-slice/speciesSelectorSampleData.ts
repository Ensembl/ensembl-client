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

import { nanoid } from '@reduxjs/toolkit';

import type { PopularSpecies } from 'src/content/app/new-species-selector/types/popularSpecies';
import type { SpeciesSearchMatch } from 'src/content/app/new-species-selector/types/speciesSearchMatch';

export const popularSpecies: PopularSpecies[] = [
  {
    id: 1,
    name: 'Human',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/homo_sapiens_GCA_000001405_14.svg', // TODO: change this to updated human image
    members_count: 2,
    is_selected: false
  },
  {
    id: 2,
    name: 'Mouse',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/mus_musculus.svg',
    members_count: 16,
    is_selected: false
  },
  {
    id: 3,
    name: 'Zebrafish',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/danio_rerio.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 4,
    name: 'Wheat',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/triticum_aestivum.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 5,
    name: 'Rice',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/oryza_sativa.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 6,
    name: 'Thale cress',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/arabidopsis_thaliana.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 7,
    name: 'Cattle',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/bos_taurus.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 8,
    name: 'Rat',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/rattus_norvegicus.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 9,
    name: 'Pig',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/sus_scrofa.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 10,
    name: 'Maize',
    image: 'https://staging-2020.ensembl.org/static/genome_images/zea_mays.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 11,
    name: 'Chicken',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/gallus_gallus.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 12,
    name: 'Dog',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/canis_familiaris.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 13,
    name: 'Barley',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/hordeum_vulgare.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 14,
    name: 'Drosophila melanogaster',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/drosophila_melanogaster.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 15,
    name: 'Japanese rice fish',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/oryzias_latipes.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 16,
    name: 'Sheep',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/ovis_aries.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 17,
    name: 'Grape',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/vitis_vinifera.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 18,
    name: 'Tomato',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/solanum_lycopersicum.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 19,
    name: 'Horse',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/equus_caballus.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 20,
    name: 'Rapeseed',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/brassica_napus.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 21,
    name: 'Potato',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/solanum_tuberosum.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 22,
    name: 'Rabbit',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/oryctolagus_cuniculus.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 23,
    name: 'Saccharomyces cerevisiae',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/saccharomyces_cerevisiae.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 24,
    name: 'C. elegans',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/caenorhabditis_elegans.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 25,
    name: 'Cat',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/felis_catus.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 26,
    name: 'Macaque',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/macaca_mulatta.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 27,
    name: 'Mexican tetra',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/astyanax_mexicanus.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 28,
    name: 'Chimpanzee',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/pan_troglodytes.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 29,
    name: 'Nile tilapia',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/oreochromis_niloticus.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 30,
    name: 'Goat',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/capra_hircus.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 31,
    name: 'Brassica oleracea',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/brassica_oleracea.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 32,
    name: 'Tropical clawed frog',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/xenopus_tropicalis.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 33,
    name: 'Soybean',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/glycine_max.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 34,
    name: 'Chinese hamster',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/cricetulus_griseus.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 35,
    name: 'Medicago truncatula',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/medicago_truncatula.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 36,
    name: 'Brassica rapa',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/brassica_rapa.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 37,
    name: 'Sorghum bicolor',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/sorghum_bicolor.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 38,
    name: 'Atlantic salmon',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/salmo_salar.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 39,
    name: 'Aegilops tauschii',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/aegilops_tauschii.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 40,
    name: 'E. coli',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/escherichia_coli.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 41,
    name: 'Plasmodium falciparum',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/plasmodium_falciparum.svg',
    members_count: 1,
    is_selected: false
  },
  {
    id: 42,
    name: 'Durum wheat',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/triticum_aestivum.svg',
    members_count: 1,
    is_selected: false
  }
];

export const humanSearchMatches: SpeciesSearchMatch[] = [
  {
    genome_id: 'a7335667-93e7-11ec-a39d-005056b38ce3',
    genome_tag: 'grch38',
    common_name: 'Human',
    scientific_name: 'Homo sapiens',
    type: null,
    is_reference: true,
    assembly: {
      accession_id: 'GCA_000001405.28',
      name: 'GRCh38.p13',
      url: 'https://www.ebi.ac.uk/ena/data/view/GCA_000001405.28'
    },
    coding_genes_count: 20446,
    contig_n50: 56413054,
    has_variation: true,
    has_regulation: true,
    annotation_provider: 'Ensembl',
    annotation_method: 'Full genebuild',
    rank: 1
  },
  {
    genome_id: '704ceb1-948d-11ec-a39d-005056b38ce3',
    genome_tag: 'grch37',
    common_name: 'Human',
    scientific_name: 'Homo sapiens',
    type: null,
    is_reference: false,
    assembly: {
      accession_id: 'GCA_000001405.14',
      name: 'GRCh37.p13',
      url: 'https://www.ebi.ac.uk/ena/browser/view/GCA_000001405.14'
    },
    coding_genes_count: 20787,
    contig_n50: 38440852,
    has_variation: true,
    has_regulation: true,
    annotation_provider: 'Ensembl',
    annotation_method: 'Full genebuild',
    rank: 2
  }
];

// copied human pangenome information from project.ensembl.org
const humanPangenomeAssemblies = [
  {
    assembly_name: 'T2T-CHM13v2.0',
    assembly_accession_id: 'GCA_009914755.4',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_009914755.4',
    population: undefined
  },
  {
    assembly_name: 'HG02257.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018466835.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018466835.1',
    population: 'African Caribbean In Barbados'
  },
  {
    assembly_name: 'HG02257.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018466845.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018466845.1',
    population: 'African Caribbean In Barbados'
  },
  {
    assembly_name: 'HG02559.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018466855.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018466855.1',
    population: 'African Caribbean In Barbados'
  },
  {
    assembly_name: 'HG02559.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018466985.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018466985.1',
    population: 'African Caribbean In Barbados'
  },
  {
    assembly_name: 'HG02486.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018467005.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018467005.1',
    population: 'African Caribbean In Barbados'
  },
  {
    assembly_name: 'HG02486.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018467015.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018467015.1',
    population: 'African Caribbean In Barbados'
  },
  {
    assembly_name: 'HG01891.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018467155.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018467155.1',
    population: 'African Caribbean In Barbados'
  },
  {
    assembly_name: 'HG01891.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018467165.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018467165.1',
    population: 'African Caribbean In Barbados'
  },
  {
    assembly_name: 'HG01258.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018469405.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018469405.1',
    population: 'Colombian In Medellin, Colombia'
  },
  {
    assembly_name: 'HG03516.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018469415.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018469415.1',
    population: 'Esan In Nigeria'
  },
  {
    assembly_name: 'HG03516.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018469425.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018469425.1',
    population: 'Esan In Nigeria'
  },
  {
    assembly_name: 'HG01123.pri.mat.f1_v2.1',
    assembly_accession_id: 'GCA_018469665.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018469665.1',
    population: 'Colombian In Medellin, Colombia'
  },
  {
    assembly_name: 'HG01258.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018469675.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018469675.1',
    population: 'Colombian In Medellin, Colombia'
  },
  {
    assembly_name: 'HG01361.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018469685.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018469685.1',
    population: 'Colombian In Medellin, Colombia'
  },
  {
    assembly_name: 'HG01123.alt.pat.f1_v2.1',
    assembly_accession_id: 'GCA_018469695.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018469695.1',
    population: 'Colombian In Medellin, Colombia'
  },
  {
    assembly_name: 'HG01361.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018469705.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018469705.1',
    population: 'Colombian In Medellin, Colombia'
  },
  {
    assembly_name: 'HG01358.pri.mat.f1_v2.1',
    assembly_accession_id: 'GCA_018469865.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018469865.1',
    population: 'Colombian In Medellin, Colombia'
  },
  {
    assembly_name: 'HG02622.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018469875.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018469875.1',
    population: 'Gambian In Western Division, The Gambia'
  },
  {
    assembly_name: 'HG02622.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018469925.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018469925.1',
    population: 'Gambian In Western Division, The Gambia'
  },
  {
    assembly_name: 'HG02717.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018469935.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018469935.1',
    population: 'Gambian In Western Division, The Gambia'
  },
  {
    assembly_name: 'HG02630.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018469945.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018469945.1',
    population: 'Gambian In Western Division, The Gambia'
  },
  {
    assembly_name: 'HG02630.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018469955.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018469955.1',
    population: 'Gambian In Western Division, The Gambia'
  },
  {
    assembly_name: 'HG01358.alt.pat.f1_v2.1',
    assembly_accession_id: 'GCA_018469965.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018469965.1',
    population: 'Colombian In Medellin, Colombia'
  },
  {
    assembly_name: 'HG02717.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018470425.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018470425.1',
    population: 'Gambian In Western Division, The Gambia'
  },
  {
    assembly_name: 'HG02572.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018470435.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018470435.1',
    population: 'Gambian In Western Division, The Gambia'
  },
  {
    assembly_name: 'HG02572.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018470445.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018470445.1',
    population: 'Gambian In Western Division, The Gambia'
  },
  {
    assembly_name: 'HG02886.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018470455.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018470455.1',
    population: 'Gambian In Western Division, The Gambia'
  },
  {
    assembly_name: 'HG02886.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018470465.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018470465.1',
    population: 'Gambian In Western Division, The Gambia'
  },
  {
    assembly_name: 'HG01175.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018471065.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018471065.1',
    population: 'Puerto Rican In Puerto Rico'
  },
  {
    assembly_name: 'HG01106.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018471075.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018471075.1',
    population: 'Puerto Rican In Puerto Rico'
  },
  {
    assembly_name: 'HG01175.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018471085.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018471085.1',
    population: 'Puerto Rican In Puerto Rico'
  },
  {
    assembly_name: 'HG00741.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018471095.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018471095.1',
    population: 'Puerto Rican In Puerto Rico'
  },
  {
    assembly_name: 'HG00741.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018471105.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018471105.1',
    population: 'Puerto Rican In Puerto Rico'
  },
  {
    assembly_name: 'HG01106.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018471345.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018471345.1',
    population: 'Puerto Rican In Puerto Rico'
  },
  {
    assembly_name: 'HG00438.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018471515.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018471515.1',
    population: 'Han Chinese South'
  },
  {
    assembly_name: 'HG02148.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018471525.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018471525.1',
    population: 'Peruvian In Lima, Peru'
  },
  {
    assembly_name: 'HG02148.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018471535.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018471535.1',
    population: 'Peruvian In Lima, Peru'
  },
  {
    assembly_name: 'HG01952.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018471545.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018471545.1',
    population: 'Peruvian In Lima, Peru'
  },
  {
    assembly_name: 'HG01952.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018471555.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018471555.1',
    population: 'Peruvian In Lima, Peru'
  },
  {
    assembly_name: 'HG00673.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018472565.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018472565.1',
    population: 'Han Chinese South'
  },
  {
    assembly_name: 'HG00621.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018472575.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018472575.1',
    population: 'Han Chinese South'
  },
  {
    assembly_name: 'HG00673.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018472585.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018472585.1',
    population: 'Han Chinese South'
  },
  {
    assembly_name: 'HG00438.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018472595.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018472595.1',
    population: 'Han Chinese South'
  },
  {
    assembly_name: 'HG00621.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018472605.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018472605.1',
    population: 'Han Chinese South'
  },
  {
    assembly_name: 'HG01071.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018472685.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018472685.1',
    population: 'Puerto Rican In Puerto Rico'
  },
  {
    assembly_name: 'HG01928.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018472695.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018472695.1',
    population: 'Peruvian In Lima, Peru'
  },
  {
    assembly_name: 'HG01928.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018472705.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018472705.1',
    population: 'Peruvian In Lima, Peru'
  },
  {
    assembly_name: 'HG00735.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018472715.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018472715.1',
    population: 'Puerto Rican In Puerto Rico'
  },
  {
    assembly_name: 'HG01071.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018472725.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018472725.1',
    population: 'Puerto Rican In Puerto Rico'
  },
  {
    assembly_name: 'HG00735.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018472765.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018472765.1',
    population: 'Puerto Rican In Puerto Rico'
  },
  {
    assembly_name: 'HG03579.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018472825.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018472825.1',
    population: 'Mende In Sierra Leone'
  },
  {
    assembly_name: 'HG03579.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018472835.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018472835.1',
    population: 'Mende In Sierra Leone'
  },
  {
    assembly_name: 'HG01978.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018472845.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018472845.1',
    population: 'Peruvian In Lima, Peru'
  },
  {
    assembly_name: 'HG03453.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018472855.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018472855.1',
    population: 'Mende In Sierra Leone'
  },
  {
    assembly_name: 'HG01978.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018472865.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018472865.1',
    population: 'Peruvian In Lima, Peru'
  },
  {
    assembly_name: 'HG03540.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018473295.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018473295.1',
    population: 'Gambian In Western Division, The Gambia'
  },
  {
    assembly_name: 'HG03453.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018473305.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018473305.1',
    population: 'Mende In Sierra Leone'
  },
  {
    assembly_name: 'HG03540.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018473315.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018473315.1',
    population: 'Gambian In Western Division, The Gambia'
  },
  {
    assembly_name: 'HG03486.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018503245.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018503245.1',
    population: 'Mende Of Sierra Leone'
  },
  {
    assembly_name: 'NA18906.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018503255.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018503255.1',
    population: 'Yoruban In Ibadan, Nigeria'
  },
  {
    assembly_name: 'NA19240.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018503265.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018503265.1',
    population: 'Yoruban'
  },
  {
    assembly_name: 'NA19240.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018503275.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018503275.1',
    population: 'Yoruban'
  },
  {
    assembly_name: 'NA18906.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018503285.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018503285.1',
    population: 'Yoruban In Ibadan, Nigeria'
  },
  {
    assembly_name: 'HG03486.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018503525.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018503525.1',
    population: 'Mende Of Sierra Leone'
  },
  {
    assembly_name: 'HG02818.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018503575.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018503575.1',
    population: 'Gambian In Western Division Of Gambia'
  },
  {
    assembly_name: 'HG02818.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018503585.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018503585.1',
    population: 'Gambian In Western Division Of Gambia'
  },
  {
    assembly_name: 'HG01243.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018504045.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018504045.1',
    population: 'Puerto Rican In Puerto Rico'
  },
  {
    assembly_name: 'HG02080.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018504055.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018504055.1',
    population: 'Vietnamese Kinh In Ho Chi Minh City, Vietnam'
  },
  {
    assembly_name: 'HG02723.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018504065.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018504065.1',
    population: 'Gambian In Western Division, The Gambia'
  },
  {
    assembly_name: 'HG02723.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018504075.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018504075.1',
    population: 'Gambian In Western Division, The Gambia'
  },
  {
    assembly_name: 'HG02080.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018504085.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018504085.1',
    population: 'Vietnamese Kinh In Ho Chi Minh City, Vietnam'
  },
  {
    assembly_name: 'HG01109.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018504365.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018504365.1',
    population: 'Puerto Rico'
  },
  {
    assembly_name: 'HG01243.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018504375.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018504375.1',
    population: 'Puerto Rican In Puerto Rico'
  },
  {
    assembly_name: 'NA20129.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018504625.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018504625.1',
    population: 'Southwest USA'
  },
  {
    assembly_name: 'NA20129.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018504635.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018504635.1',
    population: 'Southwest USA'
  },
  {
    assembly_name: 'HG01109.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018504645.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018504645.1',
    population: 'Puerto Rico'
  },
  {
    assembly_name: 'NA21309.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018504655.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018504655.1',
    population: 'Kinyawa, Kenya'
  },
  {
    assembly_name: 'NA21309.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018504665.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018504665.1',
    population: 'Kinyawa, Kenya'
  },
  {
    assembly_name: 'HG02109.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018505825.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018505825.1',
    population: 'African Ancestry From Barbados In The Caribbean'
  },
  {
    assembly_name: 'HG03492.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018505835.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018505835.1',
    population: 'Punjabi In Lahore, Pakistan'
  },
  {
    assembly_name: 'HG03492.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018505845.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018505845.1',
    population: 'Punjabi In Lahore, Pakistan'
  },
  {
    assembly_name: 'HG02055.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018505855.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018505855.1',
    population: 'Barbados'
  },
  {
    assembly_name: 'HG02109.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018505865.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018505865.1',
    population: 'African Ancestry From Barbados In The Caribbean'
  },
  {
    assembly_name: 'HG02055.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018506125.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018506125.1',
    population: 'Barbados'
  },
  {
    assembly_name: 'HG03098.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018506155.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018506155.1',
    population: 'Mende In Sierra Leone'
  },
  {
    assembly_name: 'HG03098.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018506165.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018506165.1',
    population: 'Mende In Sierra Leone'
  },
  {
    assembly_name: 'HG005.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018506945.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018506945.1',
    population: 'Asian'
  },
  {
    assembly_name: 'HG00733.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018506955.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018506955.1',
    population: 'Puerto Rican In Puerto Rico'
  },
  {
    assembly_name: 'HG005.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018506965.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018506965.1',
    population: 'Asian'
  },
  {
    assembly_name: 'HG00733.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018506975.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018506975.1',
    population: 'Puerto Rican In Puerto Rico'
  },
  {
    assembly_name: 'HG02145.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018852585.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018852585.1',
    population: 'African Ancestry From Barbados In The Caribbean'
  },
  {
    assembly_name: 'HG02145.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018852595.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018852595.1',
    population: 'African Ancestry From Barbados In The Caribbean'
  },
  {
    assembly_name: 'HG002.alt.pat.f1_v2',
    assembly_accession_id: 'GCA_018852605.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018852605.1',
    population: 'Caucasian'
  },
  {
    assembly_name: 'HG002.pri.mat.f1_v2',
    assembly_accession_id: 'GCA_018852615.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_018852615.1',
    population: 'Caucasian'
  },
  {
    assembly_name: 'HG002.pat.cur.20211005',
    assembly_accession_id: 'GCA_021950905.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_021950905.1',
    population: 'Caucasian'
  },
  {
    assembly_name: 'HG002.mat.cur.20211005',
    assembly_accession_id: 'GCA_021951015.1',
    assembly_link: 'https://www.ebi.ac.uk/ena/browser/view/GCA_021951015.1',
    population: 'Caucasian'
  }
];

// using the list of human pangenome assemblies, generate a list of search matches
export const createHumanPangenomeSearchMatches = () => {
  const humanSearchMatch = humanSearchMatches[0]; // our regular grch38

  return humanPangenomeAssemblies.map((assemblyData) => {
    const searchMatch = structuredClone(humanSearchMatch);
    searchMatch.genome_id = nanoid();
    searchMatch.assembly.accession_id = assemblyData.assembly_accession_id;
    searchMatch.assembly.name = assemblyData.assembly_name;
    searchMatch.assembly.url = assemblyData.assembly_link;
    searchMatch.is_reference = false;
    searchMatch.has_variation = false;
    searchMatch.has_regulation = false;

    if (assemblyData.population) {
      searchMatch.type = {
        kind: 'population',
        value: assemblyData.population
      };
    }

    return searchMatch;
  });
};
