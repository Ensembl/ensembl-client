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

type AssemblyStatistics = {
  contig_n50: number;
  total_genome_length: number;
  total_coding_sequence_length: number;
  total_gap_length: number;
  spanned_gaps: number;
  chromosomes: number;
  toplevel_sequences: number;
  component_sequences: number;
  gc_percentage: number;
};

type CodingGeneStatistics = {
  coding_genes: number;
  average_genomic_span: number;
  average_sequence_length: number;
  average_cds_length: number;
  shortest_gene_length: number;
  longest_gene_length: number;
  total_transcripts: number;
  coding_transcripts: number;
  transcripts_per_gene: number;
  coding_transcripts_per_gene: number;
  total_exons: number;
  total_coding_exons: number;
  average_exon_length: number;
  average_coding_exon_length: number;
  average_exons_per_transcript: number;
  average_coding_exons_per_coding_transcript: number;
  total_introns: number;
  average_intron_length: number;
};

type NonCodingGeneStatistics = {
  non_coding_genes: number;
  small_non_coding_genes: number;
  long_non_coding_genes: number;
  misc_non_coding_genes: number;
  average_genomic_span: number;
  average_sequence_length: number;
  shortest_gene_length: number;
  longest_gene_length: number;
  total_transcripts: number;
  transcripts_per_gene: number;
  total_exons: number;
  average_exon_length: number;
  average_exons_per_transcript: number;
  total_introns: number;
  average_intron_length: number;
};

type PseudogeneStatistics = {
  pseudogenes: number;
  average_genomic_span: number;
  average_sequence_length: number;
  shortest_gene_length: number;
  longest_gene_length: number;
  total_transcripts: number;
  transcripts_per_gene: number;
  total_exons: number;
  average_exon_length: number;
  average_exons_per_transcript: number;
  total_introns: number;
  average_intron_length: number;
};

type HomologyStatistics = {
  coverage: number;
};

type VariationStatistics = {
  short_variants: number;
  structural_variants: number;
  short_variants_with_phenotype_assertions: number;
  short_variants_with_publications: number;
  short_variants_frequency_studies: number;
  structural_variants_with_phenotype_assertions: number;
};

export type RegulationStatistics = {
  enhancers: number;
  promoters: number;
  ctcf_count: number | null;
  tfbs_count: number | null;
  open_chromatin_count: number | null;
};

export type SpeciesStatistics = {
  assembly_stats: AssemblyStatistics;
  coding_stats: CodingGeneStatistics;
  non_coding_stats: NonCodingGeneStatistics;
  pseudogene_stats: PseudogeneStatistics;
  homology_stats: HomologyStatistics;
  variation_stats: VariationStatistics;
  regulation_stats: RegulationStatistics;
};

export type SpeciesStatsQueryParams = {
  genomeId: string;
};

export type SpeciesStatsResponse = {
  genome_stats: SpeciesStatistics;
};
