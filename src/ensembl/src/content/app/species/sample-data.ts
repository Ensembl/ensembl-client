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

import { SpeciesStatsSection } from 'src/content/app/species/state/general/speciesGeneralHelper';

type RawSpeciesStats = {
  [genomeId: string]: {
    [key in SpeciesStatsSection]?: {
      [key: string]: string | number | null;
    };
  };
};

export const sampleData: RawSpeciesStats = {
  homo_sapiens_GCA_000001405_28: {
    assembly_stats: {
      contig_n50: 56413054,
      total_genome_length: 3272116950,
      total_coding_sequence_length: 34378305,
      total_gap_length: 161368351,
      spanned_gaps: 661,
      chromosomes: 25,
      toplevel_sequences: 640,
      component_sequences: 36734,
      gc_percentage: 38.87
    },
    coding_stats: {
      coding_genes: 20424,
      average_genomic_span: 67123.2,
      average_sequence_length: 3538.93,
      average_CDS_length: 1160.33,
      shortest_gene_length: 8,
      longest_gene_length: 2473539,
      total_transcripts: 162478,
      coding_transcripts: 106190,
      transcripts_per_gene: 7.96,
      coding_transcripts_per_gene: 5.2,
      total_exons: 1268315,
      total_coding_exons: 825666,
      average_exon_length: 246.94,
      average_coding_exon_length: 149.22,
      average_exons_per_transcript: 7.81,
      average_coding_exons_per_coding_transcript: 7.78,
      total_introns: 1105837,
      average_intron_length: 6237.5
    },
    non_coding_stats: {
      non_coding_genes: 23967,
      small_non_coding_genes: 4863,
      long_non_coding_genes: 16884,
      misc_non_coding_genes: 2220,
      average_genomic_span: 23077.19,
      average_sequence_length: 940.34,
      shortest_gene_length: 41,
      longest_gene_length: 1375317,
      total_transcripts: 54748,
      transcripts_per_gene: 2.28,
      total_exons: 184477,
      average_exon_length: 347.04,
      average_exons_per_transcript: 3.37,
      total_introns: 129729,
      average_intron_length: 15993.77
    },
    pseudogene_stats: {
      pseudogenes: 15217,
      average_genomic_span: 4218.48,
      average_sequence_length: 726.42,
      shortest_gene_length: 23,
      longest_gene_length: 909387,
      total_transcripts: 18617,
      transcripts_per_gene: 1.22,
      total_exons: 44532,
      average_exon_length: 353.34,
      average_exons_per_transcript: 2.39,
      total_introns: 25915,
      average_intron_length: 4372.89
    },
    homology_stats: {
      coverage: 86
    },
    variation_stats: {
      short_variants: 713749788,
      structural_variants: 32170052,
      short_variants_with_phenotype_assertions: 13365325,
      short_variants_with_publications: 429376,
      short_variant_frequency_studies: 8,
      structural_variants_with_phenotype_assertions: 320417
    },
    regulation_stats: {
      enhancers: 132592,
      promoters: 35191
    }
  },
  homo_sapiens_GCA_000001405_14: {
    assembly_stats: {
      contig_n50: 38440852,
      total_genome_length: 3234834689,
      total_coding_sequence_length: 33914472,
      total_gap_length: 243146473,
      spanned_gaps: 242,
      chromosomes: 25,
      toplevel_sequences: 297,
      component_sequences: null,
      gc_percentage: 37.81
    },
    coding_stats: {
      coding_genes: 20787,
      average_genomic_span: 63989.1,
      average_sequence_length: 3136.38,
      average_CDS_length: 1141.09,
      shortest_gene_length: 8,
      longest_gene_length: 2304638,
      total_transcripts: 146152,
      coding_transcripts: 95346,
      transcripts_per_gene: 7.03,
      coding_transcripts_per_gene: 4.59,
      total_exons: 1072753,
      total_coding_exons: 724218,
      average_exon_length: 231.84,
      average_coding_exon_length: 150.21,
      average_exons_per_transcript: 7.34,
      average_coding_exons_per_coding_transcript: 7.6,
      total_introns: 926601,
      average_intron_length: 6220.21
    },
    non_coding_stats: {
      non_coding_genes: 22948,
      small_non_coding_genes: 7050,
      long_non_coding_genes: 13860,
      misc_non_coding_genes: 2038,
      average_genomic_span: 15206.48,
      average_sequence_length: 712.2,
      shortest_gene_length: 35,
      longest_gene_length: 1536213,
      total_transcripts: 32971,
      transcripts_per_gene: 1.44,
      total_exons: 82828,
      average_exon_length: 289.17,
      average_exons_per_transcript: 2.51,
      total_introns: 49857,
      average_intron_length: 12156.05
    },
    pseudogene_stats: {
      pseudogenes: 14170,
      average_genomic_span: 3525.6,
      average_sequence_length: 809.46,
      shortest_gene_length: 23,
      longest_gene_length: 586570,
      total_transcripts: 17378,
      transcripts_per_gene: 1.23,
      total_exons: 40183,
      average_exon_length: 362.52,
      average_exons_per_transcript: 2.31,
      total_introns: 22805,
      average_intron_length: 3049.46
    },

    homology_stats: {
      coverage: 0
    },
    variation_stats: {
      structural_variants: 36348512,
      short_variants_with_phenotype_assertions: 10233814,
      short_variants_with_publications: 328161,
      short_variants_frequency_studies: 8,
      structural_variants_with_phenotype_assertions: 1682589
    },
    regulation_stats: {
      enhancers: 92264,
      promoters: 21822
    }
  },
  escherichia_coli_str_k_12_substr_mg1655_gca_000005845_GCA_000005845_2: {
    assembly_stats: {
      contig_n50: null,
      total_genome_length: 4641652,
      total_coding_sequence_length: 3977025,
      total_gap_length: 0,
      spanned_gaps: 0,
      chromosomes: 1,
      toplevel_sequences: 1,
      component_sequences: 1,
      gc_percentage: 50.79
    },
    coding_stats: {
      coding_genes: 4240,
      average_genomic_span: 939.92,
      average_sequence_length: 939.92,
      average_CDS_length: 938.55,
      shortest_gene_length: 42,
      longest_gene_length: 7077,
      total_transcripts: 4242,
      coding_transcripts: 4239,
      transcripts_per_gene: 1.0,
      coding_transcripts_per_gene: 1.0,
      total_exons: 4245,
      total_coding_exons: 4242,
      average_exon_length: 939.17,
      average_coding_exon_length: 937.89,
      average_exons_per_transcript: 1.0,
      average_coding_exons_per_coding_transcript: 1.0,
      total_introns: 3,
      average_intron_length: 1.67
    },
    non_coding_stats: {
      non_coding_genes: 179,
      small_non_coding_genes: 179,
      long_non_coding_genes: 0,
      misc_non_coding_genes: 0,
      average_genomic_span: 269.83,
      average_sequence_length: 269.83,
      shortest_gene_length: 53,
      longest_gene_length: 2905,
      total_transcripts: 179,
      transcripts_per_gene: 1.0,
      total_exons: 179,
      average_exon_length: 269.83,
      average_exons_per_transcript: 1.0,
      total_introns: 0,
      average_intron_length: null
    },
    pseudogene_stats: {
      pseudogenes: 115,
      average_genomic_span: 1103.18,
      average_sequence_length: 913.03,
      shortest_gene_length: 51,
      longest_gene_length: 8622,
      total_transcripts: 115,
      transcripts_per_gene: 1.0,
      total_exons: 134,
      average_exon_length: 783.57,
      average_exons_per_transcript: 1.17,
      total_introns: 19,
      average_intron_length: 1150.95
    },
    homology_stats: {
      coverage: 93.1
    }
  },
  caenorhabditis_elegans_GCA_000002985_3: {
    assembly_stats: {
      contig_n50: null,
      total_genome_length: 100272607,
      total_coding_sequence_length: 24880113,
      total_gap_length: 0,
      spanned_gaps: 0,
      chromosomes: 6,
      toplevel_sequences: 6,
      component_sequences: 3267,
      gc_percentage: 35.44
    },
    coding_stats: {
      coding_genes: 20191,
      average_genomic_span: 3149.75,
      average_sequence_length: 1402.22,
      average_CDS_length: 1425.34,
      shortest_gene_length: 30,
      longest_gene_length: 102626,
      total_transcripts: 34214,
      coding_transcripts: 33552,
      transcripts_per_gene: 1.69,
      coding_transcripts_per_gene: 1.66,
      total_exons: 240193,
      total_coding_exons: 225661,
      average_exon_length: 236.95,
      average_coding_exon_length: 211.92,
      average_exons_per_transcript: 7.02,
      average_coding_exons_per_coding_transcript: 6.73,
      total_introns: 205969,
      average_intron_length: 398.96
    },
    non_coding_stats: {
      non_coding_genes: 24791,
      small_non_coding_genes: 24515,
      long_non_coding_genes: 276,
      misc_non_coding_genes: 0,
      average_genomic_span: 81.87,
      average_sequence_length: 74.6,
      shortest_gene_length: 17,
      longest_gene_length: 14770,
      total_transcripts: 25279,
      transcripts_per_gene: 1.02,
      total_exons: 25763,
      average_exon_length: 72.63,
      average_exons_per_transcript: 1.02,
      total_introns: 484,
      average_intron_length: 401.85
    },
    pseudogene_stats: {
      pseudogenes: 1922,
      average_genomic_span: 1474.68,
      average_sequence_length: 899.83,
      shortest_gene_length: 63,
      longest_gene_length: 17899,
      total_transcripts: 1958,
      transcripts_per_gene: 1.02,
      total_exons: 7695,
      average_exon_length: 230.92,
      average_exons_per_transcript: 3.93,
      total_introns: 5737,
      average_intron_length: 203.57
    },
    homology_stats: {
      coverage: 87.3
    }
  },
  plasmodium_falciparum_GCA_000002765_2: {
    assembly_stats: {
      contig_n50: null,
      total_genome_length: 23292622,
      total_coding_sequence_length: 12309897,
      total_gap_length: 0,
      spanned_gaps: 0,
      chromosomes: 14,
      toplevel_sequences: 0,
      component_sequences: 14,
      gc_percentage: 19.34
    },
    coding_stats: {
      coding_genes: 5362,
      average_genomic_span: 2569.88,
      average_sequence_length: 2296.23,
      average_CDS_length: 2297.48,
      shortest_gene_length: 90,
      longest_gene_length: 30864,
      total_transcripts: 5362,
      coding_transcripts: 5358,
      transcripts_per_gene: 1.0,
      coding_transcripts_per_gene: 1.0,
      total_exons: 14146,
      total_coding_exons: 14139,
      average_exon_length: 870.38,
      average_coding_exon_length: 870.63,
      average_exons_per_transcript: 2.64,
      average_coding_exons_per_coding_transcript: 2.64,
      total_introns: 8784,
      average_intron_length: 167.04
    },
    non_coding_stats: {
      non_coding_genes: 252,
      small_non_coding_genes: 252,
      long_non_coding_genes: 0,
      misc_non_coding_genes: 0,
      average_genomic_span: 553.68,
      average_sequence_length: 553.68,
      shortest_gene_length: 68,
      longest_gene_length: 6175,
      total_transcripts: 252,
      transcripts_per_gene: 1.0,
      total_exons: 252,
      average_exon_length: 553.68,
      average_exons_per_transcript: 1.0,
      total_introns: 0,
      average_intron_length: null
    },
    pseudogene_stats: {
      pseudogenes: 153,
      average_genomic_span: 1665.66,
      average_sequence_length: 1568.01,
      shortest_gene_length: 72,
      longest_gene_length: 11291,
      total_transcripts: 153,
      transcripts_per_gene: 1.0,
      total_exons: 461,
      average_exon_length: 520.4,
      average_exons_per_transcript: 3.01,
      total_introns: 308,
      average_intron_length: 48.51
    },
    homology_stats: {
      coverage: 43.3
    }
  },
  saccharomyces_cerevisiae_GCA_000146045_2: {
    assembly_stats: {
      contig_n50: null,
      total_genome_length: 12071326,
      total_coding_sequence_length: 8762001,
      total_gap_length: 0,
      spanned_gaps: 0,
      chromosomes: 16,
      toplevel_sequences: 16,
      component_sequences: 16,
      gc_percentage: 38.15
    },
    coding_stats: {
      coding_genes: 6600,
      average_genomic_span: 1344.37,
      average_sequence_length: 1327.58,
      average_CDS_length: 1327.58,
      shortest_gene_length: 51,
      longest_gene_length: 14733,
      total_transcripts: 6600,
      coding_transcripts: 6600,
      transcripts_per_gene: 1.0,
      coding_transcripts_per_gene: 1.0,
      total_exons: 6913,
      total_coding_exons: 6913,
      average_exon_length: 1267.47,
      average_coding_exon_length: 1267.47,
      average_exons_per_transcript: 1.05,
      average_coding_exons_per_coding_transcript: 1.05,
      total_introns: 313,
      average_intron_length: 348.08
    },
    non_coding_stats: {
      non_coding_genes: 424,
      small_non_coding_genes: 424,
      long_non_coding_genes: 0,
      misc_non_coding_genes: 0,
      average_genomic_span: 208.59,
      average_sequence_length: 198.77,
      shortest_gene_length: 58,
      longest_gene_length: 5947,
      total_transcripts: 424,
      transcripts_per_gene: 1.0,
      total_exons: 491,
      average_exon_length: 171.64,
      average_exons_per_transcript: 1.16,
      total_introns: 67,
      average_intron_length: 62.18
    },
    pseudogene_stats: {
      pseudogenes: 12,
      average_genomic_span: 863.25,
      average_sequence_length: 863.25,
      shortest_gene_length: 228,
      longest_gene_length: 3147,
      total_transcripts: 12,
      transcripts_per_gene: 1.0,
      total_exons: 12,
      average_exon_length: 863.25,
      average_exons_per_transcript: 1.0,
      total_introns: 0,
      average_intron_length: null
    },
    variation_stats: {
      short_variants: 263537,
      structural_variants: 0,
      short_variants_with_phenotype_assertions: 0,
      short_variants_with_publications: 0,
      short_variant_frequency_studies: 0,
      structural_variants_with_phenotype_assertions: 0
    },
    homology_stats: {
      coverage: 57.7
    }
  },
  triticum_aestivum_GCA_900519105_1: {
    assembly_stats: {
      contig_n50: 51842,
      total_genome_length: 14547261565,
      total_coding_sequence_length: 133312441,
      total_gap_length: 275682619,
      spanned_gaps: 692976,
      chromosomes: 22,
      toplevel_sequences: 22,
      component_sequences: 22,
      gc_percentage: 45.18
    },
    coding_stats: {
      coding_genes: 107891,
      average_genomic_span: 3488.91,
      average_sequence_length: 1570.98,
      average_CDS_length: 1332.42,
      shortest_gene_length: 54,
      longest_gene_length: 124945,
      total_transcripts: 133744,
      coding_transcripts: 133346,
      transcripts_per_gene: 1.24,
      coding_transcripts_per_gene: 1.24,
      total_exons: 749233,
      total_coding_exons: 712204,
      average_exon_length: 303.33,
      average_coding_exon_length: 249.47,
      average_exons_per_transcript: 5.6,
      average_coding_exons_per_coding_transcript: 5.34,
      total_introns: 615489,
      average_intron_length: 491.21
    },
    non_coding_stats: {
      non_coding_genes: 12853,
      small_non_coding_genes: 12491,
      long_non_coding_genes: 362,
      misc_non_coding_genes: 0,
      average_genomic_span: 149.42,
      average_sequence_length: 149.42,
      shortest_gene_length: 42,
      longest_gene_length: 5792,
      total_transcripts: 12853,
      transcripts_per_gene: 1.0,
      total_exons: 12853,
      average_exon_length: 149.42,
      average_exons_per_transcript: 1.0,
      total_introns: 0,
      average_intron_length: null
    },
    pseudogene_stats: {
      pseudogenes: 0,
      average_genomic_span: null,
      average_sequence_length: null,
      shortest_gene_length: null,
      longest_gene_length: null,
      total_transcripts: null,
      transcripts_per_gene: null,
      total_exons: null,
      average_exon_length: null,
      average_exons_per_transcript: null,
      total_introns: null,
      average_intron_length: null
    },
    variation_stats: {
      short_variants: 18093911,
      structural_variants: 0,
      short_variant_frequency_studies: 1,
      short_variants_with_phenotype_assertions: 0,
      short_variants_with_publications: 0,
      structural_variants_with_phenotype_assertions: 0
    },
    homology_stats: {
      coverage: 98.8
    }
  },
  actinobacillus: {
    assembly_stats: {
      contig_n50: null,
      total_genome_length: 2274482,
      total_coding_sequence_length: 1964559,
      total_gap_length: 0,
      spanned_gaps: 0,
      chromosomes: 1,
      toplevel_sequences: 1,
      component_sequences: 1,
      gc_percentage: 41.3
    },
    coding_stats: {
      coding_genes: 2012,
      average_genomic_span: 976.42,
      average_sequence_length: 976.42,
      average_CDS_length: 976.42,
      shortest_gene_length: 114,
      longest_gene_length: 10044,
      total_transcripts: 2012,
      coding_transcripts: 2012,
      transcripts_per_gene: 1.0,
      coding_transcripts_per_gene: 1.0,
      total_exons: 2012,
      total_coding_exons: 2012,
      average_exon_length: 976.42,
      average_coding_exon_length: 976.42,
      average_exons_per_transcript: 1.0,
      average_coding_exons_per_coding_transcript: 1.0,
      total_introns: 0,
      average_intron_length: null
    },
    non_coding_stats: {
      non_coding_genes: 80,
      small_non_coding_genes: 80,
      long_non_coding_genes: 0,
      misc_non_coding_genes: 0,
      average_genomic_span: 412.6,
      average_sequence_length: 412.6,
      shortest_gene_length: 74,
      longest_gene_length: 2896,
      total_transcripts: 80,
      transcripts_per_gene: 1.0,
      total_exons: 80,
      average_exon_length: 412.6,
      average_exons_per_transcript: 1.0,
      total_introns: 0,
      average_intron_length: null
    },
    pseudogene_stats: {
      pseudogenes: 0,
      average_genomic_span: null,
      average_sequence_length: null,
      shortest_gene_length: null,
      longest_gene_length: null,
      total_transcripts: null,
      transcripts_per_gene: null,
      total_exons: null,
      average_exon_length: null,
      average_exons_per_transcript: null,
      total_introns: null,
      average_intron_length: null
    }
  }
};

type SpeciesSidebarData = {
  [genomeId: string]: SpeciesSidebarPayload;
};

export const sidebarData: SpeciesSidebarData = {
  homo_sapiens_GCA_000001405_28: {
    id: 'GCA_000001405.28',
    taxonomy_id: '9606',
    strain: null,
    database_version: '100.38',
    common_name: 'Human',
    scientific_name: 'Homo sapiens',
    gencode_version: 'GENCODE 34',
    assembly_name: 'GRCh38.p13',
    assembly_provider: {
      name: 'INSDC assembly',
      url: ''
    },
    annotation_provider: {
      name: 'Ensembl',
      url: 'http://www.ensembl.org'
    },
    assembly_level: 'complete genome',
    annotation_method: 'full genebuild',
    assembly_date: '2019-02-01',
    notes: [
      {
        heading: 'Pseudoautosomal regions',
        body: 'The Y chromosome in this assembly contains two psuedoautosomal regions (PARs) that were taken from the corresponding X chromosoles and are exact duplicates:\nchrX:10,000-2,781,479 = chrY:10,000-2,781,479\nchrX:155,701,382-156,030,895 = chrY:56,887,02-57,217,415'
      }
    ]
  },
  homo_sapiens_GCA_000001405_14: {
    id: 'GCA_000001405.14',
    taxonomy_id: '9606',
    strain: null,
    database_version: '101.37',
    common_name: 'Human',
    scientific_name: 'Homo sapiens',
    gencode_version: 'GENCODE 19',
    assembly_name: 'GRCh37.p13',
    assembly_provider: {
      name: 'INSDC assembly',
      url: ''
    },
    annotation_provider: {
      name: 'Ensembl',
      url: ''
    },
    assembly_level: 'complete genome',
    annotation_method: 'full genebuild',
    assembly_date: '2013-06-01',
    notes: []
  },
  escherichia_coli_str_k_12_substr_mg1655_gca_000005845_GCA_000005845_2: {
    id: 'GCA_000005845.2',
    taxonomy_id: '511145',
    strain: null,
    database_version: '101.1',
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
    assembly_date: '2013-09-01',
    notes: []
  },
  caenorhabditis_elegans_GCA_000002985_3: {
    id: 'GCA_000002985.3',
    taxonomy_id: '6239',
    strain: {
      type: 'Strain',
      value: 'N2'
    },
    database_version: '101.269',
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
    assembly_date: '2013-02-01',
    notes: []
  },
  plasmodium_falciparum_GCA_000002765_2: {
    id: 'GCA_000002765.2',
    taxonomy_id: '36329',
    strain: null,
    database_version: '101.1',
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
    assembly_date: '2016-04-01',
    notes: []
  },
  saccharomyces_cerevisiae_GCA_000146045_2: {
    id: 'GCA_000146045.2',
    taxonomy_id: '4932',
    strain: {
      type: 'Strain',
      value: 'S288C'
    },
    database_version: '101.4',
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
    assembly_date: '2014-12-01',
    notes: []
  },
  triticum_aestivum_GCA_900519105_1: {
    id: 'GCA_900519105.1',
    taxonomy_id: '4565',
    strain: {
      type: 'Cultivar',
      value: 'Chinese spring'
    },
    database_version: '101.4',
    common_name: 'Wheat',
    scientific_name: 'Triticum aestivum',
    gencode_version: null,
    assembly_name: 'IWGSC',
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
    assembly_date: '2018-08-01',
    notes: []
  }
};
