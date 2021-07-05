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

import React, { useEffect, useMemo } from 'react';
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
import {
  getTranscriptSortingFunction,
  defaultSort
} from 'src/content/app/entity-viewer/shared/helpers/transcripts-sorter';
import { filterTranscripts } from 'src/content/app/entity-viewer/shared/helpers/transcripts-filter';

import { toggleExpandedProtein } from 'src/content/app/entity-viewer/state/gene-view/proteins/geneViewProteinsSlice';
import { getExpandedTranscriptIds } from 'src/content/app/entity-viewer/state/gene-view/proteins/geneViewProteinsSelectors';
import {
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

type Gene = Pick<FullGene, 'stable_id'> & {
  transcripts: Transcript[];
};

export type ProteinsListProps = {
  gene: Gene;
};

const ProteinsList = (props: ProteinsListProps) => {
  const expandedTranscriptIds = useSelector(getExpandedTranscriptIds);
  const dispatch = useDispatch();
  const { search } = useLocation();
  const proteinIdToFocus = new URLSearchParams(search).get('protein_id');
  const defaultTranscriptId = useMemo(() => {
    const defaultTranscripts = defaultSort(props.gene.transcripts);
    return defaultTranscripts[0].stable_id;
  }, [props.gene.stable_id]);

  const sortingRule = useSelector(getSortingRule);

  const filters = useSelector(getFilters);
  const filteredTranscripts = Object.values(filters).some(Boolean)
    ? (filterTranscripts(props.gene.transcripts, filters) as Transcript[])
    : props.gene.transcripts;

  const sortingFunction = getTranscriptSortingFunction<Transcript>(sortingRule);
  const sortedTranscripts = sortingFunction(filteredTranscripts);

  const proteinCodingTranscripts = sortedTranscripts.filter(
    isProteinCodingTranscript
  ) as Transcript[];

  useEffect(() => {
    if (!proteinCodingTranscripts.length) {
      return;
    }
    const hasExpandedTranscripts = !!expandedTranscriptIds.length;
    const firstProteinId =
      proteinCodingTranscripts[0].product_generating_contexts[0].product
        .stable_id;
    // Expand the first transcript by default
    if (!hasExpandedTranscripts && !proteinIdToFocus) {
      dispatch(toggleExpandedProtein(firstProteinId));
    }
  }, []);

  const longestProteinLength = getLongestProteinLength(props.gene);

  return !proteinCodingTranscripts.length ? (
    <div>No transcripts to show with the filters selected</div>
  ) : (
    <div className={styles.proteinsList}>
      {proteinCodingTranscripts.map((transcript) => (
        <ProteinsListItem
          key={transcript.stable_id}
          isDefault={transcript.stable_id === defaultTranscriptId}
          transcript={transcript}
          trackLength={longestProteinLength}
        />
      ))}
    </div>
  );
};

export default ProteinsList;
