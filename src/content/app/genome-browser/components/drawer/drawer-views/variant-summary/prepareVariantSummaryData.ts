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

import memoize from 'lodash/memoize';

import type { VariantDetails } from 'src/content/app/genome-browser/state/api/queries/variantQuery';

export type PreparedVariantSummaryData = {
  ancestralAllele?: string;
  mostSevereConsequence?: string;
  minorAlleleFrequency?: {
    sequence: string;
    frequency: number;
  };
  highestMAF?: {
    sequence: string;
    frequency: number;
  };
  hasPhenotypeAssociations: boolean;
  caddScores: {
    sequence: string;
    score: number;
  }[];
  gerpScore?: number;
};

const prepareVariantSummaryData = (variant: VariantDetails) => {
  const variantSummaryData: Record<string, unknown> = {};

  addVariantPredictions(variant, variantSummaryData);

  for (const variantAllele of variant.alleles) {
    addVariantAllelePopulationFrequencyData(variantAllele, variantSummaryData); // iterates over population frequencies
    addVariantAllelePredictions(variantAllele, variantSummaryData); // iterates over prediction results

    if (!variantSummaryData.hasPhenotypeAssociations) {
      checkPhenotypeAssociations(variantAllele, variantSummaryData);
    }
  }

  return variantSummaryData as PreparedVariantSummaryData;
};

const checkPhenotypeAssociations = (
  variantAllele: VariantDetails['alleles'][number],
  store: Record<string, unknown>
) => {
  if (variantAllele.phenotype_assertions?.length) {
    store.hasPhenotypeAssociations = true;
  }
};

const addVariantPredictions = (
  variant: VariantDetails,
  store: Record<string, unknown>
) => {
  for (const prediction of variant.prediction_results) {
    if (prediction.analysis_method.tool === 'Ensembl VEP') {
      store.mostSevereConsequence = prediction.result;
    }
    if (prediction.analysis_method.tool === 'AncestralAllele') {
      store.ancestralAllele = prediction.result;
    }
    if (prediction.analysis_method.tool === 'GERP') {
      store.gerpScore = prediction.score;
    }
  }
};

// There could be 1-20 VariantAlleles and 0-50 PopulationAlleleFrequency records for each
const addVariantAllelePopulationFrequencyData = (
  variantAllele: VariantDetails['alleles'][number],
  store: Record<string, unknown>
) => {
  for (const populationFrequency of variantAllele.population_frequencies) {
    if (populationFrequency.is_minor_allele) {
      store.minorAlleleFrequency = {
        sequence: variantAllele.allele_sequence,
        frequency: populationFrequency.allele_frequency
      };
    }
    if (populationFrequency.is_hpmaf) {
      store.highestMAF = {
        sequence: variantAllele.allele_sequence,
        frequency: populationFrequency.allele_frequency
      };
    }
  }
};

const addVariantAllelePredictions = (
  variantAllele: VariantDetails['alleles'][number],
  store: Partial<PreparedVariantSummaryData>
) => {
  store.caddScores = store.caddScores ?? [];

  for (const predictionResult of variantAllele.prediction_results) {
    if (
      predictionResult.analysis_method.tool === 'CADD' &&
      predictionResult.score
    ) {
      store.caddScores.push({
        sequence: variantAllele.allele_sequence,
        score: predictionResult.score
      });
    }
  }
};

export default memoize(prepareVariantSummaryData);
