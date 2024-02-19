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
  contig_n50: number | null;
  total_genome_length: number | null;
  total_coding_sequence_length: number | null;
  total_gap_length: number | null;
  spanned_gaps: number | null;
  chromosomes: number | null;
  toplevel_sequences: number | null;
  component_sequences: number | null;
  gc_percentage: number | null;
};

type CodingGeneStatistics = {
  coding_genes: number | null;
  average_genomic_span: number | null;
  average_sequence_length: number | null;
  average_cds_length: number | null;
  shortest_gene_length: number | null;
  longest_gene_length: number | null;
  total_transcripts: number | null;
  coding_transcripts: number | null;
  transcripts_per_gene: number | null;
  coding_transcripts_per_gene: number | null;
  total_exons: number | null;
  total_coding_exons: number | null;
  average_exon_length: number | null;
  average_coding_exon_length: number | null;
  average_exons_per_transcript: number | null;
  average_coding_exons_per_coding_transcript: number | null;
  total_introns: number | null;
  average_intron_length: number | null;
};

type NonCodingGeneStatistics = {
  non_coding_genes: number | null;
  small_non_coding_genes: number | null;
  long_non_coding_genes: number | null;
  misc_non_coding_genes: number | null;
  average_genomic_span: number | null;
  average_sequence_length: number | null;
  shortest_gene_length: number | null;
  longest_gene_length: number | null;
  total_transcripts: number | null;
  transcripts_per_gene: number | null;
  total_exons: number | null;
  average_exon_length: number | null;
  average_exons_per_transcript: number | null;
  total_introns: number | null;
  average_intron_length: number | null;
};

type PseudogeneStatistics = {
  pseudogenes: number | null;
  average_genomic_span: number | null;
  average_sequence_length: number | null;
  shortest_gene_length: number | null;
  longest_gene_length: number | null;
  total_transcripts: number | null;
  transcripts_per_gene: number | null;
  total_exons: number | null;
  average_exon_length: number | null;
  average_exons_per_transcript: number | null;
  total_introns: number | null;
  average_intron_length: number | null;
};

type HomologyStatistics = {
  coverage: number | null;
  reference_species_name: string | null;
};

type VariationStatistics = {
  short_variants: number | null;
  structural_variants: number | null;
  short_variants_with_phenotype_assertions: number | null;
  short_variants_with_publications: number | null;
  short_variants_frequency_studies: number | null;
  structural_variants_with_phenotype_assertions: number | null;
};

export type RegulationStatistics = {
  enhancers: number | null;
  promoters: number | null;
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

export type SpeciesFtpLinksResponse = {
  dataset: string;
  url: string;
}[];
