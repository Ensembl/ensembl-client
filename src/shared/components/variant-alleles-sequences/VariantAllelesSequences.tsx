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

import ShowHide from 'src/shared/components/show-hide/ShowHide';

import styles from './VariantAlleleSequences.scss';

const COMPACT_MAX_LENGTH = 18;

type Props = {
  isExpandable?: boolean;
  alleles: {
    allele_sequence: string;
    reference_sequence: string;
  }[];
};

// NOTE: the logic of this component will need to be significantly improved to handle multiple and/or longer sequences
const VariantAllelesSequences = (props: Props) => {
  const { isExpandable = false } = props;
  const { referenceSequence, alleleSequences, combinedString } =
    prepareSequenceData(props);

  const [isExpanded, setIsExpanded] = useState(false);

  const onToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (combinedString.length <= COMPACT_MAX_LENGTH) {
    return <span>{combinedString}</span>;
  }

  if (isExpandable) {
    return (
      <div>
        {isExpanded ? (
          <ExpandedView
            referenceSequence={referenceSequence}
            alleleSequences={alleleSequences}
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

  return <span>{trimmedSequence}</span>;
};

const ExpandedView = (props: {
  referenceSequence: string;
  alleleSequences: string[];
}) => {
  const { referenceSequence, alleleSequences } = props;

  return (
    <div className={styles.expanded}>
      <span>{referenceSequence}/</span>
      {alleleSequences.map((sequence, index) => (
        <span key={index}>
          {sequence}
          {index < alleleSequences.length - 1 && '/'}
        </span>
      ))}
    </div>
  );
};

// TODO: make sure not to include reference allele sequence in the list of alternative allele sequences
const prepareSequenceData = (props: Props) => {
  const referenceSequence = props.alleles[0].reference_sequence;
  const alleleSequences = props.alleles.map(
    ({ allele_sequence }) => allele_sequence
  );

  const combinedString = `${referenceSequence}/${alleleSequences.join('/')}`;

  return {
    referenceSequence,
    alleleSequences,
    combinedString
  };
};

export default VariantAllelesSequences;
