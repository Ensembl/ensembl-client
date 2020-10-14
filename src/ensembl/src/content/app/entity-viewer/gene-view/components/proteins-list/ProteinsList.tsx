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

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router';

import { CircleLoader } from 'src/shared/components/loader/Loader';
import ProteinsListItem from './proteins-list-item/ProteinsListItem';

import {
  getLongestProteinLength,
  isProteinCodingTranscript
} from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import { defaultSort } from 'src/content/app/entity-viewer/shared/helpers/transcripts-sorter';

import { toggleExpandedProtein } from 'src/content/app/entity-viewer/state/gene-view/proteins/geneViewProteinsSlice';
import { getExpandedTranscriptIds } from 'src/content/app/entity-viewer/state/gene-view/proteins/geneViewProteinsSelectors';

import { Gene } from 'src/content/app/entity-viewer/types/gene';
import { RootState } from 'src/store';

import styles from './ProteinsList.scss';

type ProteinsListProps = {
  gene: Gene;
  expandedTranscriptIds: string[];
  toggleExpandedProtein: (id: string) => void;
};

const ProteinsList = (props: ProteinsListProps) => {
  const { search } = useLocation();
  const proteinIdToFocus = new URLSearchParams(search).get('protein_id');

  const sortedTranscripts = defaultSort(props.gene.transcripts);
  const proteinCodingTranscripts = sortedTranscripts.filter(
    isProteinCodingTranscript
  );

  useEffect(() => {
    const hasExpandedTranscripts = !!props.expandedTranscriptIds.length;
    // Expand the first transcript by default
    if (
      !hasExpandedTranscripts &&
      !proteinIdToFocus &&
      sortedTranscripts[0].product
    ) {
      props.toggleExpandedProtein(sortedTranscripts[0].product.stable_id);
    }
  }, []);

  const longestProteinLength = getLongestProteinLength(props.gene);

  return (
    <div className={styles.proteinsList}>
      {proteinCodingTranscripts ? (
        proteinCodingTranscripts.map((transcript) => (
          <ProteinsListItem
            key={transcript.stable_id}
            transcript={transcript}
            trackLength={longestProteinLength}
          />
        ))
      ) : (
        <div className={styles.proteinsListLoadingContainer}>
          <CircleLoader />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  expandedTranscriptIds: getExpandedTranscriptIds(state)
});

const mapDispatchToProps = {
  toggleExpandedProtein
};

export default connect(mapStateToProps, mapDispatchToProps)(ProteinsList);
