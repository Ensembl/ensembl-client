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

import { useState } from 'react';

import { getReferenceAndAltAlleles } from 'src/shared/helpers/variantHelpers';

import ShowHide from 'src/shared/components/show-hide/ShowHide';

import styles from './VariantAllelesSequences.module.css';

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
  const {
    referenceAlleleSequence,
    alternativeAlleleSequences,
    combinedString
  } = prepareSequenceData(props);

  const [isExpanded, setIsExpanded] = useState(false);

  const onToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (combinedString.length <= COMPACT_MAX_LENGTH) {
    return <span className={styles.trimmedSequence}>{combinedString}</span>;
  }

  if (isExpandable) {
    return (
      <div>
        {isExpanded ? (
          <ExpandedView
            referenceAlleleSequence={referenceAlleleSequence}
            alternativeAlleleSequences={alternativeAlleleSequences}
          />
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

  return <span className={styles.trimmedSequence}>{trimmedSequence}</span>;
};

const ExpandedView = (props: {
  referenceAlleleSequence: string;
  alternativeAlleleSequences: string[];
}) => {
  const { referenceAlleleSequence, alternativeAlleleSequences } = props;

  return (
    <div className={styles.expanded}>
      <span> {referenceAlleleSequence} </span>
      {alternativeAlleleSequences.map((sequence, index) => (
        <span key={index}>
          {sequence}
          {index < alternativeAlleleSequences.length - 1 && ','}
        </span>
      ))}
    </div>
  );
};

const prepareSequenceData = (props: Props) => {
  const { referenceAllele, alternativeAlleles } = getReferenceAndAltAlleles(
    props.alleles
  );

  // we expect reference allele to always exist in the data;
  // but default to an empty string to appease typescript
  const referenceAlleleSequence = referenceAllele?.reference_sequence ?? '';

  const alternativeAlleleSequences = alternativeAlleles.map(
    (allele) => allele.allele_sequence
  );

  const combinedString = `${referenceAlleleSequence}  ${alternativeAlleleSequences.join(
    ','
  )}`;

  return {
    referenceAlleleSequence,
    alternativeAlleleSequences,
    combinedString
  };
};

export default VariantAllelesSequences;
