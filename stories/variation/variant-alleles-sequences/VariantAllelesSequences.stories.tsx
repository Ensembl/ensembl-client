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
import classNames from 'classnames';

import VariantAllelesSequences from 'src/shared/components/variant-alleles-sequences/VariantAllelesSequences';

import { rs71197234Alleles, rs699Alleles } from './sampleData';

import styles from './VariantAllelesSequences.stories.module.css';

const CompactVariantAllelesSequencesStory = () => {
  return <VariantAllelesSequences alleles={rs71197234Alleles} />;
};

const ExpandableVariantAllelesSequencesStory = () => {
  const [isShortSequence, setIsShortSequence] = useState(false);
  const [isNarrowContainer, setIsNarrowContainer] = useState(false);

  const alleles = isShortSequence ? rs699Alleles : rs71197234Alleles;

  const wrapperStyles = classNames(
    styles.container,
    isNarrowContainer && styles.narrowContainer
  );

  return (
    <>
      <div className={wrapperStyles}>
        <VariantAllelesSequences alleles={alleles} isExpandable={true} />
      </div>
      <div className={styles.options}>
        <label>
          Variant with a short combined alleles sequence
          <input
            type="checkbox"
            checked={isShortSequence}
            onChange={() => setIsShortSequence(!isShortSequence)}
          />
        </label>
        <label>
          Container width is less than the length of a sequence
          <input
            type="checkbox"
            checked={isNarrowContainer}
            onChange={() => setIsNarrowContainer(!isNarrowContainer)}
          />
        </label>
      </div>
    </>
  );
};

export const ExportedCompactVariantAllelesSequencesStory = {
  name: 'compact',
  render: () => <CompactVariantAllelesSequencesStory />
};

export const ExportedExpandableVariantAllelesSequencesStory = {
  name: 'expandable',
  render: () => <ExpandableVariantAllelesSequencesStory />
};

export default {
  title: 'Components/Variation/VariantAllelesSequences'
};
