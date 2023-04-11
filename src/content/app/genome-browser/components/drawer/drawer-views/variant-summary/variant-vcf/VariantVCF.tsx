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

/**
 * NOTE:
 * - This component almost certainly will be reused enough to become a shared component
 * - This component will need to learn how to display VCF string for multiple long alleles.
 *   See example:
 *   - https://xd.adobe.com/view/b485e6c9-546a-4627-a5a6-0edf77651f09-e1d6/screen/973f8bb3-05c1-4cf8-9220-08009640c571?fullscreen
 * - Should the Copy component be part of VariantVCF component; or should VariantVCF component
 *   expose a method that a parent can use to get the VCF string from VariantVCF? The second
 *   options seems more composable.
 */

type MinimumVariantData = {
  name: string;
  alleles: {
    reference_sequence: string;
    allele_sequence: string;
    slice: {
      location: {
        start: number;
      };
      region: {
        name: string;
      };
    };
  }[];
};

type PropsWithVariant = {
  variant: MinimumVariantData;
};

type PropsWithSequence = {
  vcfSequence: string;
};

type Props = PropsWithVariant | PropsWithSequence;

const VariantVCF = (props: Props) => {
  const vcfSequence = arePropsWithVariant(props)
    ? getVCFSequence(props.variant)
    : props.vcfSequence;

  return <span>{vcfSequence}</span>;
};

const arePropsWithVariant = (props: Props): props is PropsWithVariant => {
  return 'variant' in props;
};

export const getVCFSequence = (variant: MinimumVariantData) => {
  const variantName = variant.name;
  const firstAllele = variant.alleles[0];
  const regionName = firstAllele.slice.region.name;
  const startCoordinate = firstAllele.slice.location.start;
  const referenceSequence = firstAllele.reference_sequence;
  const alleleSequences = variant.alleles
    .map((allele) => allele.allele_sequence)
    .join(',');

  return [
    regionName,
    startCoordinate,
    variantName,
    referenceSequence,
    alleleSequences
  ].join(' ');
};

export default React.memo(VariantVCF);
