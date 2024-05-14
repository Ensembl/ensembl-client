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

/**
 * NOTE:
 * You will notice that the data described by the types declared below
 * sits in the `ensembl_website_display_data` field
 * of both the Variant type and the VariantAllele type.
 *
 * The reason for this is that the Variation team preferred to deprioritise
 * this data for other possible consumers of the variation api by indicating
 * that it only serves the needs of the website.
 *
 * Meanwhile, in the web context, having a type called EnsemblWebsiteDisplayData
 * is pretty meaningless; which is why, for the purposes of this codebase,
 * the types are named VariantSummaryStatistics and VariantAlleleSummaryStatistics.
 */

export type VariantSummaryStatistics = {
  count_citations: number;
};

export type VariantAlleleSummaryStatistics = {
  count_transcript_consequences: number;
  count_overlapped_genes: number;
  count_regulatory_consequences: number;
  count_variant_phenotypes: number;
  count_gene_phenotypes: number;
  representative_population_allele_frequency: number | null; // global population allele frequency according to one of the studies
};
