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

import React, { useState } from 'react';

import { getReferenceAndAltAlleles } from 'src/shared/helpers/variantHelpers';

import ShowHide from 'src/shared/components/show-hide/ShowHide';

import styles from './VariantAllelesSequences.scss';

const COMPACT_MAX_LENGTH = 18;

type Props = {
  isExpandable?: boolean;
  alleles: {
    allele_sequence: string;
    reference_sequence: string;
    allele_type: {
      value: string;
    };
  }[];
};

const VariantAllelesSequences = (props: Props) => {
  const { isExpandable = false } = props;
  const { alleleSequences, combinedString } = prepareSequenceData(props);

  const [isExpanded, setIsExpanded] = useState(false);

  const onToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (combinedString.length <= COMPACT_MAX_LENGTH) {
    return <span className={styles.alleleSequence}>{combinedString}</span>;
  }

  if (isExpandable) {
    return (
      <div>
        {isExpanded ? (
          <ExpandedView alleleSequences={alleleSequences} />
        ) : (
          <div>
            <CompactView sequence={combinedString} />
          </div>
        )}
        <ShowHide
          label="Show all"
          onClick={onToggleExpanded}
          isExpanded={isExpanded}
        />
      </div>
    );
  } else {
    return <CompactView sequence={combinedString} />;
  }
};

const CompactView = (props: { sequence: string }) => {
  const { sequence } = props;
  const trimmedSequence = `${sequence.slice(0, COMPACT_MAX_LENGTH - 1)}…`;

  return <span className={styles.alleleSequence}>{trimmedSequence}</span>;
};

const ExpandedView = (props: { alleleSequences: string[] }) => {
  const { alleleSequences } = props;

  return (
    <div className={styles.expanded}>
      {alleleSequences.map((sequence, index) => (
        <span key={index}>
          {sequence}
          {index < alleleSequences.length - 1 && ','}
        </span>
      ))}
    </div>
  );
};

const prepareSequenceData = (props: Props) => {
  const { referenceAllele, alternativeAlleles } = getReferenceAndAltAlleles(
    props.alleles
  );

  const alleleSequences = alternativeAlleles.map(
    (allele) => allele.allele_sequence
  );

  if (referenceAllele) {
    // we expect reference allele to always exist in the data;
    // but no harm in checking
    alleleSequences.unshift(referenceAllele.reference_sequence);
  }

  const alleleSequencesCopy = alleleSequences.slice(0);
  const combinedString =
    alleleSequencesCopy.shift() + '  ' + alleleSequencesCopy.join(',');

  return {
    alleleSequences,
    combinedString
  };
};

export default VariantAllelesSequences;
