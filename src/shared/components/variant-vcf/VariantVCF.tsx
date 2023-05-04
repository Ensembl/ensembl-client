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
import classNames from 'classnames';

import Copy from 'src/shared/components/copy/Copy';

import styles from './VariantVCF.scss';

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

type Props = {
  variant: MinimumVariantData;
  withCopy?: boolean;
  className?: string;
};

const VariantVCF = (props: Props) => {
  const vcfSequenceParts = getVCFStringParts(props.variant);

  const componentClasses = classNames(styles.container, props.className);

  return (
    <div className={componentClasses}>
      <span className={styles.vcfString}>
        <span>{vcfSequenceParts.regionName}</span>
        <span>{vcfSequenceParts.startCoordinate}</span>
        <span>{vcfSequenceParts.variantName}</span>
        <span>{vcfSequenceParts.referenceAlleleSequence}</span>
        <span>{vcfSequenceParts.alternativeAlleleSequences.join(',')}</span>
      </span>
      <Copy value={vcfSequenceParts.vcfString} />
    </div>
  );
};

export const getVCFStringParts = (variant: MinimumVariantData) => {
  const variantName = variant.name;
  const firstAllele = variant.alleles[0];
  const regionName = firstAllele.slice.region.name;
  const startCoordinate = firstAllele.slice.location.start;
  const referenceAlleleSequence = firstAllele.reference_sequence;
  const alternativeAlleleSequences = variant.alleles.map(
    (allele) => allele.allele_sequence
  );

  const vcfString = [
    regionName,
    startCoordinate,
    variantName,
    referenceAlleleSequence,
    alternativeAlleleSequences.join(',')
  ].join(' ');

  return {
    variantName,
    regionName,
    startCoordinate,
    referenceAlleleSequence,
    alternativeAlleleSequences,
    vcfString
  };
};

export default React.memo(VariantVCF);
