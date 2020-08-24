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
import { connect } from 'react-redux';

import { getFeatureCoordinates } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import { defaultSort } from 'src/content/app/entity-viewer/shared/helpers/transcripts-sorter';

import {
  getExpandedTranscriptIds,
  getExpandedTranscriptDownloadIds
} from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSelectors';

import DefaultTranscriptsListItem from './default-transcripts-list-item/DefaultTranscriptListItem';
import TranscriptsFilter from 'src/content/app/entity-viewer/gene-view/components/transcripts-filter/TranscriptsFilter';

import { TicksAndScale } from 'src/content/app/entity-viewer/gene-view/components/base-pairs-ruler/BasePairsRuler';
import { Gene } from 'src/content/app/entity-viewer/types/gene';
import { RootState } from 'src/store';

import { ReactComponent as ChevronDown } from 'static/img/shared/chevron-down.svg';

import styles from './DefaultTranscriptsList.scss';

type Props = {
  gene: Gene;
  rulerTicks: TicksAndScale;
  expandedTranscriptIds: string[];
  expandedTranscriptDownloadIds: string[];
};

const DefaultTranscriptslist = (props: Props) => {
  const { gene } = props;
  const sortedTranscripts = defaultSort(gene.transcripts);

  const [isFilterOpen, setFilterOpen] = useState(false);

  const toggleFilter = () => {
    setFilterOpen(!isFilterOpen);
  };

  return (
    <div>
      <div className={styles.header}>
        {isFilterOpen && <TranscriptsFilter toggleFilter={toggleFilter} />}
        <div className={styles.row}>
          {!isFilterOpen && (
            <div className={styles.filterLabel} onClick={toggleFilter}>
              Filter & sort
              <ChevronDown className={styles.chevron} />
            </div>
          )}
          <div className={styles.right}>Transcript ID</div>
        </div>
      </div>
      <div className={styles.content}>
        <StripedBackground {...props} />
        {sortedTranscripts.map((transcript, index) => {
          const expandTranscript = props.expandedTranscriptIds.includes(
            transcript.id
          );
          const expandDownload = props.expandedTranscriptDownloadIds.includes(
            transcript.id
          );

          return (
            <DefaultTranscriptsListItem
              key={index}
              label={index === 0 ? 'Selected' : ''}
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
    const x = Math.floor(scale(tick));
    const style = { left: `${x}px` };
    return <span key={x} className={styles.stripe} style={style} />;
  });

  return <div className={styles.stripedBackground}>{stripes}</div>;
};

const mapStateToProps = (state: RootState) => ({
  expandedTranscriptIds: getExpandedTranscriptIds(state),
  expandedTranscriptDownloadIds: getExpandedTranscriptDownloadIds(state)
});

export default connect(mapStateToProps)(DefaultTranscriptslist);
