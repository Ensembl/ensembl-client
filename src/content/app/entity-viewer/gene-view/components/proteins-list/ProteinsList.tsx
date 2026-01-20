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

import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import {
  getLongestProteinLength,
  isProteinCodingTranscript
} from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import { getTranscriptSortingFunction } from 'src/content/app/entity-viewer/shared/helpers/transcripts-sorter';
import { filterTranscripts } from 'src/content/app/entity-viewer/shared/helpers/transcripts-filter';

import useExpandedDefaultTranscript from 'src/content/app/entity-viewer/gene-view/hooks/useExpandedDefaultTranscript';

import {
  getFilters,
  getSortingRule
} from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSelectors';

import ProteinsListItem from './proteins-list-item/ProteinsListItem';

import type {
  DefaultEntityViewerGene,
  DefaultEntityViewerTranscript
} from 'src/content/app/entity-viewer/state/api/queries/defaultGeneQuery';

import styles from './ProteinsList.module.css';

export type ProteinCodingTranscript = DefaultEntityViewerTranscript & {
  product_generating_contexts: {
    product: NonNullable<
      DefaultEntityViewerTranscript['product_generating_contexts'][number]['product']
    >;
  }[];
};

export type ProteinsListProps = {
  gene: DefaultEntityViewerGene;
};

const ProteinsList = (props: ProteinsListProps) => {
  const { search } = useLocation();
  const proteinIdToFocus = new URLSearchParams(search).get('protein_id');

  const sortingRule = useSelector(getSortingRule);

  const filters = useSelector(getFilters);
  const filteredTranscripts = filterTranscripts(
    props.gene.transcripts,
    filters
  );

  const sortingFunction =
    getTranscriptSortingFunction<DefaultEntityViewerTranscript>(sortingRule);
  const sortedTranscripts = sortingFunction(filteredTranscripts);

  const proteinCodingTranscripts = sortedTranscripts.filter(
    isProteinCodingTranscript
  ) as ProteinCodingTranscript[];

  useExpandedDefaultTranscript({
    geneStableId: props.gene.stable_id,
    transcripts: props.gene.transcripts,
    skip: Boolean(proteinIdToFocus)
  });

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
