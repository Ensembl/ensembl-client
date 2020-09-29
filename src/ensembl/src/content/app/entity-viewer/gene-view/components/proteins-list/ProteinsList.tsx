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

import ProteinsListItem from './proteins-list-item/ProteinsListItem';

import {
  getLongestProteinLength,
  isProteinCodingTranscript
} from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import { defaultSort } from 'src/content/app/entity-viewer/shared/helpers/transcripts-sorter';

import { Gene } from 'src/content/app/entity-viewer/types/gene';

import styles from './ProteinsList.scss';

type ProteinsListProps = {
  gene: Gene;
};

type ProteinsListWithDataProps = {
  gene: Gene;
};

const ProteinsList = (props: ProteinsListProps) => {
  // TODO: either consider making the graphql request directly from here,
  // or merge ProteinsList with ProteinsListWithData into a single component
  return <ProteinsListWithData gene={props.gene} />;
};

const ProteinsListWithData = (props: ProteinsListWithDataProps) => {
  const sortedTranscripts = defaultSort(props.gene.transcripts);
  const proteinCodingTranscripts = sortedTranscripts.filter(
    isProteinCodingTranscript
  );

  const longestProteinLength = getLongestProteinLength(props.gene);

  return (
    <div className={styles.proteinsList}>
      {proteinCodingTranscripts.map((transcript) => (
        <ProteinsListItem
          key={transcript.stable_id}
          transcript={transcript}
          trackLength={longestProteinLength}
        />
      ))}
    </div>
  );
};

export default ProteinsList;
