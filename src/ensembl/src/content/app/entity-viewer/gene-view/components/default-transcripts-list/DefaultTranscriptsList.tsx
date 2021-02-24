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

import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { Pick2, Pick3 } from 'ts-multipick';

import { getFeatureCoordinates } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import {
  transcriptSortingFunctions,
  defaultSort
} from 'src/content/app/entity-viewer/shared/helpers/transcripts-sorter';

import { filterTranscriptsBySOTerm } from 'src/content/app/entity-viewer/shared/helpers/transcripts-filter';

import {
  getExpandedTranscriptIds,
  getExpandedTranscriptDownloadIds,
  getFilters,
  getSortingRule
} from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSelectors';
import {
  toggleTranscriptInfo,
  SortingRule
} from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';

import DefaultTranscriptsListItem, {
  DefaultTranscriptListItemProps
} from './default-transcripts-list-item/DefaultTranscriptListItem';
import TranscriptsFilter from 'src/content/app/entity-viewer/gene-view/components/transcripts-filter/TranscriptsFilter';

import { TicksAndScale } from 'src/content/app/entity-viewer/gene-view/components/base-pairs-ruler/BasePairsRuler';
import { FullGene } from 'src/shared/types/thoas/gene';
import { FullTranscript } from 'src/shared/types/thoas/transcript';
import { FullProductGeneratingContext } from 'src/shared/types/thoas/productGeneratingContext';
import { FullCDS } from 'src/shared/types/thoas/cds';
import { SplicedExon } from 'src/shared/types/thoas/exon';
import { Slice } from 'src/shared/types/thoas/slice';

import { ReactComponent as ChevronDown } from 'static/img/shared/chevron-down.svg';

import styles from './DefaultTranscriptsList.scss';

type ProductGeneratingContext = {
  product_type: FullProductGeneratingContext['product_type'];
  cds: Pick<FullCDS, 'relative_start' | 'relative_end'>;
};
type Transcript = DefaultTranscriptListItemProps['transcript'] & {
  so_term: FullTranscript['so_term'];
  product_generating_contexts: ProductGeneratingContext[];
} & {
  spliced_exons: Array<Pick3<SplicedExon, 'exon', 'slice', 'location'>>;
} & Pick2<FullTranscript, 'slice', 'location'>;
type Gene = DefaultTranscriptListItemProps['gene'] & {
  stable_id: FullGene['stable_id'];
  transcripts: Array<Transcript>;
  slice: Pick2<Slice, 'location', 'start' | 'end'>;
};

export type Props = {
  gene: Gene;
  rulerTicks: TicksAndScale;
};

const DefaultTranscriptslist = (props: Props) => {
  const expandedTranscriptIds = useSelector(getExpandedTranscriptIds);
  const expandedTranscriptDownloadIds = useSelector(
    getExpandedTranscriptDownloadIds
  );
  const sortingRule = useSelector(getSortingRule);
  const filters = useSelector(getFilters);
  const dispatch = useDispatch();

  const { gene } = props;

  //Using this to get the default order of transcripts in which the first one is selected, this might change later with the data coming directly from thoas
  const defaultTranscriptId = useMemo(() => {
    const sortedTranscripts = defaultSort(gene.transcripts);
    return sortedTranscripts[0].stable_id;
  }, [gene.stable_id]);

  const sortingFunction = transcriptSortingFunctions[sortingRule];
  const sortedTranscripts = sortingFunction(gene.transcripts) as Transcript[];
  const filteredTranscripts = Object.values(filters).some(Boolean)
    ? (filterTranscriptsBySOTerm(sortedTranscripts, filters) as Transcript[])
    : sortedTranscripts;

  const [isFilterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const hasExpandedTranscripts = !!expandedTranscriptIds.length;

    // Expand the first transcript by default
    if (!hasExpandedTranscripts) {
      dispatch(toggleTranscriptInfo(filteredTranscripts[0].stable_id));
    }
  }, []);

  const shouldShowFilterIndicator =
    sortingRule !== SortingRule.DEFAULT || Object.values(filters).some(Boolean);

  const filterLabel = (
    <span
      className={classNames({
        [styles.labelWithActivityIndicator]: shouldShowFilterIndicator
      })}
    >
      Filter & sort
    </span>
  );

  const toggleFilter = () => {
    setFilterOpen(!isFilterOpen);
  };

  return (
    <div>
      <div className={styles.header}>
        {isFilterOpen && (
          <TranscriptsFilter
            label={filterLabel}
            toggleFilter={toggleFilter}
            transcripts={filteredTranscripts}
          />
        )}
        <div className={styles.row}>
          {gene.transcripts.length > 5 && !isFilterOpen && (
            <div className={styles.filterLabel} onClick={toggleFilter}>
              {filterLabel}
              <ChevronDown className={styles.chevron} />
            </div>
          )}
          <div className={styles.right}>Transcript ID</div>
        </div>
      </div>
      <div className={styles.content}>
        <StripedBackground {...props} />
        {filteredTranscripts.map((transcript, index) => {
          const expandTranscript = expandedTranscriptIds.includes(
            transcript.stable_id
          );
          const expandDownload = expandedTranscriptDownloadIds.includes(
            transcript.stable_id
          );

          return (
            <DefaultTranscriptsListItem
              key={index}
              isDefault={transcript.stable_id === defaultTranscriptId}
              gene={gene}
              transcript={transcript}
              rulerTicks={props.rulerTicks}
              expandTranscript={expandTranscript}
              expandDownload={expandDownload}
            />
          );
        })}
      </div>
    </div>
  );
};

const StripedBackground = (props: Props) => {
  const { scale, ticks } = props.rulerTicks;
  const { start: geneStart, end: geneEnd } = getFeatureCoordinates(props.gene);
  const geneLength = geneEnd - geneStart; // FIXME should use gene length property
  const extendedTicks = [1, ...ticks, geneLength];

  const stripes = extendedTicks.map((tick) => {
    const x = Math.floor(scale(tick) as number);
    const style = { left: `${x}px` };
    return <span key={x} className={styles.stripe} style={style} />;
  });

  return <div className={styles.stripedBackground}>{stripes}</div>;
};

export default DefaultTranscriptslist;
