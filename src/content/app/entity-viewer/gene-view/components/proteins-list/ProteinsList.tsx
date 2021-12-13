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
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { Pick3 } from 'ts-multipick';

import ProteinsListItem, {
  Props as ProteinListItemProps
} from './proteins-list-item/ProteinsListItem';

import {
  getLongestProteinLength,
  isProteinCodingTranscript
} from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import { getTranscriptSortingFunction } from 'src/content/app/entity-viewer/shared/helpers/transcripts-sorter';
import { filterTranscripts } from 'src/content/app/entity-viewer/shared/helpers/transcripts-filter';

import { toggleTranscriptInfo } from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';
import {
  getExpandedTranscriptIds,
  getExpandedTranscriptsModified,
  getFilters,
  getSortingRule
} from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSelectors';

import { FullGene } from 'src/shared/types/thoas/gene';
import { FullTranscript } from 'src/shared/types/thoas/transcript';
import { Exon } from 'src/shared/types/thoas/exon';

import styles from './ProteinsList.scss';

type Transcript = ProteinListItemProps['transcript'] &
  Pick3<FullTranscript, 'slice', 'location', 'length'> & {
    spliced_exons: Array<{
      exon: Pick3<Exon, 'slice', 'location', 'length'>;
    }>;
  };

type Gene = Pick<FullGene, 'stable_id' | 'symbol'> & {
  transcripts: Transcript[];
};

export type ProteinsListProps = {
  gene: Gene;
};

const ProteinsList = (props: ProteinsListProps) => {
  const expandedProteinIds = useSelector(getExpandedTranscriptIds);
  const expandedTranscriptsModified = useSelector(
    getExpandedTranscriptsModified
  );
  const dispatch = useDispatch();
  const { search } = useLocation();
  const proteinIdToFocus = new URLSearchParams(search).get('protein_id');

  const sortingRule = useSelector(getSortingRule);

  const filters = useSelector(getFilters);
  const filteredTranscripts = filterTranscripts(
    props.gene.transcripts,
    filters
  );

  const sortingFunction = getTranscriptSortingFunction<Transcript>(sortingRule);
  const sortedTranscripts = sortingFunction(filteredTranscripts);

  const proteinCodingTranscripts = sortedTranscripts.filter(
    isProteinCodingTranscript
  ) as Transcript[];

  useEffect(() => {
    if (!proteinCodingTranscripts.length) {
      return;
    }
    const hasExpandedTranscripts = !!expandedProteinIds.length;
    // Expand the first transcript by default when the user hasnt interacted with the accordion
    if (
      !hasExpandedTranscripts &&
      !proteinIdToFocus &&
      !expandedTranscriptsModified
    ) {
      dispatch(toggleTranscriptInfo(proteinCodingTranscripts[0].stable_id));
    }
  }, []);

  const longestProteinLength = getLongestProteinLength(props.gene);

  return !proteinCodingTranscripts.length ? (
    <div>No transcripts to show with the filters selected</div>
  ) : (
    <div className={styles.proteinsList}>
      {proteinCodingTranscripts.map((transcript, index) => (
        <ProteinsListItem
          key={transcript.stable_id}
          gene={props.gene}
          transcript={transcript}
          trackLength={longestProteinLength}
          index={index}
        />
      ))}
    </div>
  );
};

export default ProteinsList;
