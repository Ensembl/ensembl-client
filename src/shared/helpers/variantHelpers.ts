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

// FIXME: should move this to a file in the shared directory (probably a shared constant?)
import variantGroups from 'src/content/app/genome-browser/constants/variantGroups';

export const getReferenceAndAltAlleles = <
  T extends {
    allele_type: {
      value: string;
    };
  }
>(
  alleles: Array<T>
) => {
  let referenceAllele;
  const alternativeAlleles: T[] = [];

  for (const allele of alleles) {
    if (allele.allele_type.value === 'biological_region') {
      referenceAllele = allele;
    } else {
      alternativeAlleles.push(allele);
    }
  }

  return {
    referenceAllele,
    alternativeAlleles
  };
};

export const getMostSevereVariantConsequence = <
  T extends {
    analysis_method: {
      tool: string;
    };
    result: string | null;
  }
>(variant: {
  prediction_results: T[];
}) => {
  const { prediction_results: predictionResults } = variant;
  const consequencePrediction = predictionResults.find(
    ({ analysis_method }) => analysis_method.tool === 'Ensembl VEP'
  );

  // There should always be a valid most severe consequence in the variant data;
  // but in case there isn't, return a bogus fallback string.
  return consequencePrediction?.result || 'unknown';
};

/**
 * Given variant consequence (predicted by VEP),
 * return the id of the group that the variant belongs to
 */
export const getVariantGroupIdByConsequence = (variantConsequence: string) => {
  return variantConsequenceToGroupIdMap.get(variantConsequence);
};

/**
 * Given variant consequence (predicted by VEP),
 * return the CSS colour variable used to display this variant
 */
export const getVariantGroupCSSColour = (variantType: string) => {
  const variantGroupId = getVariantGroupIdByConsequence(variantType);
  return typeof variantGroupId === 'number'
    ? variantGroupIdToCSSColourMap.get(variantGroupId)
    : undefined;
};

const buildVariantConsequenceToGroupIdMap = () => {
  const colourMap = new Map<string, number>();

  for (const group of variantGroups) {
    for (const variantType of group.variant_types) {
      colourMap.set(variantType.label, group.id);
    }
  }

  return colourMap;
};

const variantConsequenceToGroupIdMap = buildVariantConsequenceToGroupIdMap();

const variantGroupIdToCSSColourMap = new Map([
  [1, 'var(--color-dark-pink)'],
  [2, 'var(--color-dark-yellow)'],
  [3, 'var(--color-lime)'],
  [4, 'var(--color-teal)'],
  [5, 'var(--color-duckegg-blue)']
]);
