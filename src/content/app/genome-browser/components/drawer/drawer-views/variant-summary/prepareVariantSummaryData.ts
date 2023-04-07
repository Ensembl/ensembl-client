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

import type { Variant } from 'src/shared/types/variation-api/variant';

type PreparedVariantSummaryData = {
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
  clinicalSignificance: {
    sequence: string;
    significance: string;
  }[];
  caddScores: {
    sequence: string;
    score: number;
  }[];
  gerpScore?: number;
};

const prepareVariantSummaryData = (variant: Variant) => {
  const variantSummaryData: Record<string, unknown> = {};

  addVariantPredictions(variant, variantSummaryData);

  for (const variantAllele of variant.alleles) {
    addVariantAllelePopulationFrequencyData(variantAllele, variantSummaryData); // iterates over population frequencies
    addClinicalSignificance(variantAllele, variantSummaryData); // iterates over phenotype assertions
    addVariantAllelePredictions(variantAllele, variantSummaryData); // iterates over prediction results
  }

  return variantSummaryData as PreparedVariantSummaryData;
};

const addVariantPredictions = (
  variant: Variant,
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
  variantAllele: Variant['alleles'][0],
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

const addClinicalSignificance = (
  variantAllele: Variant['alleles'][0],
  store: Record<string, unknown>
) => {
  const clinicalSignificanceData: PreparedVariantSummaryData['clinicalSignificance'] =
    [];

  for (const phenotypeAssertion of variantAllele.phenotype_assertions) {
    for (const evidence of phenotypeAssertion.evidence) {
      for (const attribute of evidence.attributes) {
        if (attribute.type === 'clin_sig') {
          clinicalSignificanceData.push({
            sequence: variantAllele.allele_sequence,
            significance: attribute.value
          });
        }
      }
    }
  }

  store.clinicalSignificance = clinicalSignificanceData;
};

const addVariantAllelePredictions = (
  variantAllele: Variant['alleles'][0],
  store: Record<string, unknown>
) => {
  const caddScores: PreparedVariantSummaryData['caddScores'] = [];

  for (const predictionResult of variantAllele.prediction_results) {
    if (
      predictionResult.analysis_method.tool === 'CADD' &&
      predictionResult.score
    ) {
      caddScores.push({
        sequence: variantAllele.allele_sequence,
        score: predictionResult.score
      });
    }
  }

  store.caddScores = caddScores;
};

export default memoize(prepareVariantSummaryData);
