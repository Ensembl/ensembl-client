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

import {
  getStatsForSection,
  speciesStatsSectionNames,
  type SpeciesStatsSection,
  type StatsSection
} from '../../state/general/speciesGeneralHelper';

import type { SpeciesStatistics } from 'src/content/app/species/state/api/speciesApiTypes';
import type { ExampleFocusObject } from 'src/shared/state/genome/genomeTypes';

/**
 * RULES FOR THE CLIENT FOR DISPLAYING STATISTICS IN THE EXPANDABLE SECTIONS
 *
 * - For assembly_stats: anything can be null except for chromosomes.
 *   If chromosomes are null, all fields in the section should be null.
 * - For coding_stats: anything can be null except for coding_genes.
 *   If coding_genes is null, all fields in the section should be null
 * - For non_coding_stats: anything can be null except for non_coding_genes.
 *   If non_coding_genes is null, all fields in the section should be null
 * - For pseudogene_stats, anything can be null except for pseudogenes.
 *   If pseudogenes field is null, all fields in the section should be null
 * - For variation_stats, anything can be null except for short_variants.
 *   If short_variants is null, all fields in the section should be null
 * - For homology_stats, both coverage and coverage_explanation
 *   should at the same time be either null or non-null
 * - For regulation_stats, anything can be null
 */
const curateSpeciesStatistics = (
  speciesStats: SpeciesStatistics
): SpeciesStatistics => {
  return {
    assembly_stats: curateAssemblyStatistics(speciesStats.assembly_stats),
    coding_stats: curateCodingGeneStatistics(speciesStats.coding_stats),
    non_coding_stats: curateNonCodingGeneStatistics(
      speciesStats.non_coding_stats
    ),
    pseudogene_stats: curatePseudogeneStatistics(speciesStats.pseudogene_stats),
    homology_stats: curateHomologyStats(speciesStats.homology_stats),
    variation_stats: curateVariationStats(speciesStats.variation_stats),
    regulation_stats: curateRegulationStats(
      speciesStats.regulation_stats
    ) as SpeciesStatistics['regulation_stats'] // this is a white lie; we are excluding unnecessary fields from regulation stats here
  };
};

/**
 * Make sure that if the chromosomes field happens to be set to null,
 * then there is no other field in the assembly statistics section that has data
 */
const curateAssemblyStatistics = (
  assemblyStats: SpeciesStatistics['assembly_stats']
) => {
  const chromosomeStats = assemblyStats.chromosomes;

  if (chromosomeStats !== null) {
    return assemblyStats;
  }

  const emptyStats = { ...assemblyStats };

  for (const key of Object.keys(emptyStats)) {
    emptyStats[key as keyof typeof emptyStats] = null;
  }

  return emptyStats;
};

/**
 * Make sure that if the coding_genes field happens to be set to null,
 * then there is no other field in the coding_stats section that has data
 */
const curateCodingGeneStatistics = (
  codingStats: SpeciesStatistics['coding_stats']
) => {
  const codingGenesCount = codingStats['coding_genes'];

  if (codingGenesCount !== null) {
    return codingStats;
  }

  const emptyStats = { ...codingStats };

  for (const key of Object.keys(emptyStats)) {
    emptyStats[key as keyof typeof emptyStats] = null;
  }

  return emptyStats;
};

/**
 * Make sure that if the non_coding_genes field happens to be set to null,
 * then there is no other field in the non_coding_stats section that has data
 */
const curateNonCodingGeneStatistics = (
  nonCodingStats: SpeciesStatistics['non_coding_stats']
) => {
  const nonCodingGenesCount = nonCodingStats['non_coding_genes'];

  if (nonCodingGenesCount !== null) {
    return nonCodingStats;
  }

  const emptyStats = { ...nonCodingStats };

  for (const key of Object.keys(emptyStats)) {
    emptyStats[key as keyof typeof emptyStats] = null;
  }

  return emptyStats;
};

/**
 * Make sure that if the non_coding_genes field happens to be set to null,
 * then there is no other field in the non_coding_stats section that has data
 */
const curatePseudogeneStatistics = (
  pseudogeneStats: SpeciesStatistics['pseudogene_stats']
) => {
  const pseudogenesCount = pseudogeneStats['pseudogenes'];

  if (pseudogenesCount !== null) {
    return pseudogeneStats;
  }

  const emptyStats = { ...pseudogeneStats };

  for (const key of Object.keys(emptyStats)) {
    emptyStats[key as keyof typeof emptyStats] = null;
  }

  return emptyStats;
};

/**
 * Make sure that both the coverage field and the reference_species_name field
 * are either null or non-null together
 */
const curateHomologyStats = (
  homologyStats: SpeciesStatistics['homology_stats']
) => {
  const isCoveragePresent = homologyStats['coverage'] !== null;
  const isReferenceSpeciesNamePresent =
    homologyStats['reference_species_name'] !== null;

  const isDataOk =
    (isCoveragePresent && isReferenceSpeciesNamePresent) ||
    (!isCoveragePresent && !isReferenceSpeciesNamePresent);

  if (isDataOk) {
    return homologyStats;
  }

  const emptyStats = { ...homologyStats };

  for (const key of Object.keys(emptyStats)) {
    emptyStats[key as keyof typeof emptyStats] = null;
  }

  return emptyStats;
};

/**
 * Make sure that if the short_variants field happens to be set to null,
 * then there is no other field in the variation_stats section that has data
 */
const curateVariationStats = (
  variationStats: SpeciesStatistics['variation_stats']
) => {
  const hasShortVariants = variationStats['short_variants'] !== null;

  if (hasShortVariants) {
    return variationStats;
  }

  const emptyStats = { ...variationStats };

  for (const key of Object.keys(emptyStats)) {
    emptyStats[key as keyof typeof emptyStats] = null;
  }

  return emptyStats;
};

/**
 * Only leave the fields that are intended for display on the species page
 */
const curateRegulationStats = (
  regulationStats: SpeciesStatistics['regulation_stats']
) => {
  return {
    enhancers: regulationStats.enhancers,
    promoters: regulationStats.promoters
  };
};

const prepareStatistics = ({
  statistics,
  genomeIdForUrl,
  exampleFocusObjects
}: {
  statistics: SpeciesStatistics;
  genomeIdForUrl: string;
  exampleFocusObjects: ExampleFocusObject[];
}) => {
  statistics = curateSpeciesStatistics(statistics);

  return speciesStatsSectionNames
    .map((section) =>
      getStatsForSection({
        allStats: statistics,
        genomeIdForUrl,
        section: section as SpeciesStatsSection,
        exampleFocusObjects
      })
    )
    .filter(Boolean) as StatsSection[];
};

export default prepareStatistics;
