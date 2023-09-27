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
import type { PopularSpecies } from 'src/content/app/new-species-selector/types/popularSpecies';
import type { SpeciesSearchMatch } from 'src/content/app/new-species-selector/types/speciesSearchMatch';

export const popularSpecies: PopularSpecies[] = [
  {
    species_taxonomy_id: 9606,
    name: 'human',
    image: 'https://beta.ensembl.org/static/genome_images/9606.svg',
    genomes_count: 99
  },
  {
    species_taxonomy_id: 10090,
    name: 'mouse',
    image: 'https://beta.ensembl.org/static/genome_images/10090.svg',
    genomes_count: 16
  },
  {
    species_taxonomy_id: 7955,
    name: 'zebrafish',
    image: 'https://beta.ensembl.org/static/genome_images/7955.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 4565,
    name: 'bread wheat',
    image: 'https://beta.ensembl.org/static/genome_images/4565.svg',
    genomes_count: 18
  },
  {
    species_taxonomy_id: 4530,
    name: 'Japanese rice',
    image: 'https://beta.ensembl.org/static/genome_images/4530.svg',
    genomes_count: 16
  },
  {
    species_taxonomy_id: 3702,
    name: 'thale-cress',
    image: 'https://beta.ensembl.org/static/genome_images/3702.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 9913,
    name: 'cattle',
    image: 'https://beta.ensembl.org/static/genome_images/9913.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 10116,
    name: 'Norway rat',
    image: 'https://beta.ensembl.org/static/genome_images/10116.svg',
    genomes_count: 4
  },
  {
    species_taxonomy_id: 9823,
    name: 'pig',
    image: 'https://beta.ensembl.org/static/genome_images/9823.svg',
    genomes_count: 13
  },
  {
    species_taxonomy_id: 4577,
    name: 'maize',
    image: 'https://beta.ensembl.org/static/genome_images/4577.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 9031,
    name: 'chicken',
    image: 'https://beta.ensembl.org/static/genome_images/9031.svg',
    genomes_count: 3
  },
  {
    species_taxonomy_id: 9612,
    name: 'dog',
    image: 'https://beta.ensembl.org/static/genome_images/9612.svg',
    genomes_count: 5
  },
  {
    species_taxonomy_id: 4513,
    name: 'domesticated barley',
    image: 'https://beta.ensembl.org/static/genome_images/4513.svg',
    genomes_count: 2
  },
  {
    species_taxonomy_id: 7227,
    name: 'Fruit fly',
    image: 'https://beta.ensembl.org/static/genome_images/7227.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 8090,
    name: 'Japanese medaka HdrR',
    image: 'https://beta.ensembl.org/static/genome_images/8090.svg',
    genomes_count: 15
  },
  {
    species_taxonomy_id: 9940,
    name: 'sheep',
    image: 'https://beta.ensembl.org/static/genome_images/9940.svg',
    genomes_count: 2
  },
  {
    species_taxonomy_id: 29760,
    name: 'wine grape',
    image: 'https://beta.ensembl.org/static/genome_images/29760.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 4081,
    name: 'tomato',
    image: 'https://beta.ensembl.org/static/genome_images/4081.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 9796,
    name: 'horse',
    image: 'https://beta.ensembl.org/static/genome_images/9796.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 3708,
    name: 'oilseed rape',
    image: 'https://beta.ensembl.org/static/genome_images/3708.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 4113,
    name: 'potato',
    image: 'https://beta.ensembl.org/static/genome_images/4113.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 9986,
    name: 'rabbit',
    image: 'https://beta.ensembl.org/static/genome_images/9986.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 4932,
    name: "baker's yeast",
    image: 'https://beta.ensembl.org/static/genome_images/4932.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 6239,
    name: 'Roundworm',
    image: 'https://beta.ensembl.org/static/genome_images/6239.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 9685,
    name: 'domestic cat',
    image: 'https://beta.ensembl.org/static/genome_images/9685.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 9544,
    name: 'Macaque',
    image: 'https://beta.ensembl.org/static/genome_images/9544.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 7994,
    name: 'Mexican tetra',
    image: 'https://beta.ensembl.org/static/genome_images/7994.svg',
    genomes_count: 6
  },
  {
    species_taxonomy_id: 4567,
    name: 'durum wheat',
    image: 'https://beta.ensembl.org/static/genome_images/4567.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 9598,
    name: 'chimpanzee',
    image: 'https://beta.ensembl.org/static/genome_images/9598.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 8128,
    name: 'Nile tilapia',
    image: 'https://beta.ensembl.org/static/genome_images/8128.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 9925,
    name: 'Goat',
    image: 'https://beta.ensembl.org/static/genome_images/9925.svg',
    genomes_count: 2
  },
  {
    species_taxonomy_id: 3712,
    name: 'wild cabbage',
    image: 'https://beta.ensembl.org/static/genome_images/3712.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 8364,
    name: 'tropical clawed frog',
    image: 'https://beta.ensembl.org/static/genome_images/8364.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 3847,
    name: 'soybeans',
    image: 'https://beta.ensembl.org/static/genome_images/3847.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 10029,
    name: 'Chinese hamster',
    image: 'https://beta.ensembl.org/static/genome_images/10029.svg',
    genomes_count: 3
  },
  {
    species_taxonomy_id: 3880,
    name: 'barrel medic',
    image: 'https://beta.ensembl.org/static/genome_images/3880.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 3711,
    name: 'field mustard',
    image: 'https://beta.ensembl.org/static/genome_images/3711.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 4558,
    name: 'sorghum',
    image: 'https://beta.ensembl.org/static/genome_images/4558.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 8030,
    name: 'Atlantic salmon',
    image: 'https://beta.ensembl.org/static/genome_images/8030.svg',
    genomes_count: 4
  },
  {
    species_taxonomy_id: 37682,
    name: "Tausch's goatgrass",
    image: 'https://beta.ensembl.org/static/genome_images/37682.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 562,
    name: 'Escherichia coli str. K-12 substr. MG1655 str. K12',
    image: 'https://beta.ensembl.org/static/genome_images/562.svg',
    genomes_count: 1
  },
  {
    species_taxonomy_id: 5833,
    name: 'Plasmodium falciparum 3D7',
    image: 'https://beta.ensembl.org/static/genome_images/5833.svg',
    genomes_count: 1
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
    searchMatch.genome_id = assemblyData.assembly_accession_id;
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
