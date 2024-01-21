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

import React from 'react';
import type { Pick2 } from 'ts-multipick';

import VariantColour from 'src/content/app/genome-browser/components/drawer/components/variant-colour/VariantColour';

import type { Variant } from 'src/shared/types/variation-api/variant';

import styles from './VariantConsequence.module.css';

type MinimumPredictionResultData = Pick<
  Variant['prediction_results'][number],
  'result'
> &
  Pick2<Variant['prediction_results'][number], 'analysis_method', 'tool'>;

type Props = {
  variant: {
    prediction_results: MinimumPredictionResultData[];
  };
  withColour?: boolean;
};

const VariantConsequence = (props: Props) => {
  const { variant, withColour = true } = props;

  const variantConsequence = getMostSevereVariantConsequence(variant);

  if (!variantConsequence) {
    return null;
  }

  return (
    <>
      {withColour ? (
        <div className={styles.variantConsequence}>
          <VariantColour variantType={variantConsequence} />
          <span>{variantConsequence}</span>
        </div>
      ) : (
        <span>{variantConsequence}</span>
      )}
    </>
  );
};

export default VariantConsequence;

export const getMostSevereVariantConsequence = ({
  prediction_results: predictionResults
}: Props['variant']) => {
  const consequencePrediction = predictionResults.find(
    ({ analysis_method }) => analysis_method.tool === 'Ensembl VEP'
  );

  return consequencePrediction?.result;
};
