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

import React, { type ReactNode } from 'react';

import AlternativeAllele from '../alternative-allele/AlternativeAllele';

import type { VariantDetails } from 'src/content/app/entity-viewer/state/api/queries/variantDefaultQuery';

import styles from './AlternativeAlleles.module.css';

type Props = {
  alleles: VariantDetails['alleles']; // a list of alternative alleles to render
  regionSliceStart: number;
  variantStart: number; // accounts for anchor base in appropriate variant types
  variantLength: number; // accounts for anchor base in appropriate variant types
  hasAnchorBase: boolean;
  activeAlleleId: string;
  mostSevereConsequence: string;
  onAlleleClick: (alleleId: string) => void;
};

const AlternativeAlleles = (props: Props) => {
  const {
    alleles,
    regionSliceStart,
    variantStart,
    variantLength,
    hasAnchorBase,
    activeAlleleId,
    mostSevereConsequence,
    onAlleleClick
  } = props;

  const offsetInNucleotides = variantStart - regionSliceStart;

  const getAlleleLength = (sequenceLength: number, alleleType: string) => {
    if (alleleType === 'deletion') {
      return 0;
    } else if (alleleType === 'insertion' || alleleType === 'indel') {
      return sequenceLength - 1; // subtract the first nucleotide, which is the anchor base
    } else {
      return sequenceLength;
    }
  };

  // FIXME: can this only be on the parent container?
  const gridStyles = {
    ['--nucleotides-offset' as string]: `${offsetInNucleotides}`
  };

  return (
    <div className={styles.grid} style={gridStyles}>
      {alleles.map((allele, index) => (
        <Row
          key={index}
          index={index}
          alleleLength={getAlleleLength(
            allele.allele_sequence.length,
            allele.allele_type.value
          )}
        >
          <AlternativeAllele
            key={index}
            allele={allele}
            regionSliceStart={regionSliceStart}
            variantStart={variantStart}
            variantLength={variantLength}
            hasAnchorBase={hasAnchorBase}
            mostSevereConsequence={mostSevereConsequence}
            activeAlleleId={activeAlleleId}
            onClick={onAlleleClick}
          />
        </Row>
      ))}
    </div>
  );
};

const Row = (props: {
  index: number;
  alleleLength: number;
  children: ReactNode;
}) => {
  const { index, alleleLength, children } = props;
  return (
    <>
      <div className={styles.left}>
        {index === 0 && (
          <span className={styles.label}>Alternative alleles</span>
        )}
        <span className={styles.alleleLength}>{alleleLength}</span>
      </div>
      {children}
    </>
  );
};

export default AlternativeAlleles;
