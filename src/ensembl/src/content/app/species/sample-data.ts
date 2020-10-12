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

export const human38stats = {
  assembly_stats: {
    chromosome_count: 23,
    genome_size: 3096649726,
    total_sequence_length: 4537931177
  },
  coding_gene_stats: {
    total_count: 20440,
    readthrough_gene_count: 633,
    transcript_count: 127718
  },
  noncoding_gene_stats: {
    total_count: 23995,
    readthrough_gene_count: 306,
    small_non_coding_gene_count: 4867,
    long_non_coding_gene_count: 16907,
    other_non_coding_gene_count: 2221
  },
  pseudogene_stats: {
    total_count: 15222,
    readthrough_gene_count: 6
  },
  variation_stats: {
    short_variant_count: 677695965,
    structural_variant_count: 6638628
  }
};

type SpeciesSidebarData = {
  [genomeId: string]: SpeciesSidebarPayload;
};

export const sidebarData: SpeciesSidebarData = {
  homo_sapiens_GCA_000001405_28: {
    species: {
      display_name: 'Human',
      scientific_name: 'Homo sapiens'
    },
    assembly: {
      name: 'GRCh38.p13',
      source: {
        name: 'INSDC Assembly',
        id: 'GCA_000001405.28',
        url: ''
      },
      level: 'complete genome'
    },
    annotation: {
      provider: 'Ensembl',
      method: 'Full genebuild',
      last_updated_date: 'Feb 2019',
      gencode_version: 'GENCODE 34',
      database_version: '100.38',
      taxonomy_id: '9606'
    },
    psuedoautosomal_regions: {
      description: `The Y chromosome in this assembly contains two psuedoautosomal regions (PARs) that were taken from the corresponding X chromosoles and are exact duplicates:
        chrX:10,000-2,781,479 = chrY:10,000-2,781,479
        chrX:155,701,382-156,030,895 = chrY:56,887,02-57,217,415 `
    }
  }
};
