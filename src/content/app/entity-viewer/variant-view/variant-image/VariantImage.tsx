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

import {
  getReferenceAndAltAlleles,
  getMostSevereVariantConsequence
} from 'src/shared/helpers/variantHelpers';

import useVariantImageData from './useVariantImageData';

import FlankingSequence from './flanking-sequence/FlankingSequence';
import ReferenceSequenceAllele from './reference-sequence-allele/ReferenceSequenceAllele';
import AlternativeAlleles from './alternative-alleles/AlternativeAlleles';
import Chevron from 'src/shared/components/chevron/Chevron';

import type { VariantDetails } from 'src/content/app/entity-viewer/state/api/queries/variantDefaultQuery';

import styles from './VariantImage.module.css';

type Props = {
  genomeId: string;
  variantId: string;
  activeAlleleId: string;
  onAlleleChange: (alleleId: string) => void;
};

const VariantImage = (props: Props) => {
  const { genomeId, variantId, activeAlleleId, onAlleleChange } = props;

  const { currentData } = useVariantImageData({
    genomeId,
    variantId
  });

  if (!currentData) {
    return null;
  }

  const {
    referenceSequence,
    variant,
    regionLength,
    regionName,
    regionSliceStart,
    regionSliceEnd,
    variantStart, // accounts for anchor base in appropriate variant types
    variantEnd,
    variantLength, // accounts for anchor base in appropriate variant types
    hasAnchorBase
  } = currentData;

  const { referenceAllele, alternativeAlleles } = getReferenceAndAltAlleles(
    variant.alleles
  );
  const mostSevereConsequence = getMostSevereVariantConsequence(variant);

  const distanceToVariantStart = variantStart - regionSliceStart;

  const containerStyles = {
    ['--nucleotides-offset' as string]: `${distanceToVariantStart}`
  };

  return (
    <div className={styles.container} style={containerStyles}>
      <ReferenceSequence
        referenceSequence={referenceSequence}
        regionSliceStart={regionSliceStart}
        regionSliceEnd={regionSliceEnd}
        variantStart={variantStart}
        variantEnd={variantEnd}
        variantLength={variantLength}
        hasAnchorBase={hasAnchorBase}
        regionName={regionName}
        regionLength={regionLength}
        variant={variant}
        referenceAllele={referenceAllele as VariantDetails['alleles'][number]}
        activeAlleleId={activeAlleleId}
        mostSevereConsequence={mostSevereConsequence}
        onAlleleClick={() => onAlleleChange(referenceAllele?.urlId || '')}
      />
      <AlternativeAlleles
        alleles={alternativeAlleles}
        variantLength={variantLength}
        regionSliceStart={regionSliceStart}
        hasAnchorBase={hasAnchorBase}
        variantStart={variantStart}
        activeAlleleId={activeAlleleId}
        mostSevereConsequence={mostSevereConsequence}
        onAlleleClick={onAlleleChange}
      />
    </div>
  );
};

const ReferenceSequence = (props: {
  referenceSequence: string;
  regionSliceStart: number;
  regionSliceEnd: number;
  variantStart: number;
  variantEnd: number;
  variantLength: number;
  hasAnchorBase: boolean;
  regionName: string;
  regionLength: number;
  variant: VariantDetails;
  referenceAllele: VariantDetails['alleles'][number];
  activeAlleleId: string;
  mostSevereConsequence: string;
  onAlleleClick: () => void;
}) => {
  const {
    referenceSequence,
    regionSliceStart,
    regionSliceEnd,
    variantStart, // accounts for anchor base in appropriate variant types
    variantLength, // accounts for anchor base in appropriate variant types
    regionName,
    regionLength,
    hasAnchorBase,
    variant,
    referenceAllele,
    activeAlleleId,
    mostSevereConsequence,
    onAlleleClick
  } = props;

  const {
    name: variantName,
    allele_type: { value: variantType },
    slice: {
      location: { start: variantLocationStart }
    }
  } = variant;

  const isSelectedAllele = referenceAllele.urlId === activeAlleleId;

  const distanceToVariantStart = variantStart - regionSliceStart;
  const leftFlankingSequence = referenceSequence.slice(
    0,
    distanceToVariantStart
  );
  const hasEllipsisAtStart = regionSliceStart > 1;

  const rightFlankingSequence = referenceSequence.slice(
    distanceToVariantStart + variantLength
  );
  const hasEllipsisAtEnd = regionSliceEnd < regionLength;

  return (
    <div className={styles.referenceSequenceBlock}>
      <div className={styles.variantStartLabel}>
        {`${regionName}:${variantLocationStart}`}
      </div>
      <div className={styles.referenceSequenceLabel}>Reference sequence</div>
      <div className={styles.variantInfo}>
        <div>
          <span className={styles.variantName}>{variantName}</span>
          <span className={styles.variantType}>{variantType}</span>
        </div>
      </div>
      <div className={styles.strandLabel}>forward strand</div>
      <ForwardStrandChevrons />
      <div className={styles.referenceSequence}>
        <FlankingSequence
          sequence={leftFlankingSequence}
          hasEllipsisAtStart={hasEllipsisAtStart}
        />
        <ReferenceSequenceAllele
          sequence={referenceSequence}
          regionSliceStart={regionSliceStart}
          variantStart={variantStart}
          variantLength={variantLength}
          variantType={variantType}
          mostSevereConsequence={mostSevereConsequence}
          hasAnchorBase={hasAnchorBase}
          isSelectedAllele={isSelectedAllele}
          onClick={onAlleleClick}
        />
        <FlankingSequence
          sequence={rightFlankingSequence}
          hasEllipsisAtEnd={hasEllipsisAtEnd}
        />
      </div>
    </div>
  );
};

const ForwardStrandChevrons = () => {
  const chevrons = [...Array(5)].map((_, index) => (
    <Chevron key={index} direction="right" />
  ));

  return <div className={styles.chevrons}>{chevrons}</div>;
};

export default VariantImage;
