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

import { getFeatureCoordinates } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import { defaultSort } from 'src/content/app/entity-viewer/shared/helpers/transcripts-sorter';

import DefaultTranscriptsListItem from './default-transcripts-list-item/DefaultTranscriptListItem';

import { TicksAndScale } from 'src/content/app/entity-viewer/gene-view/components/base-pairs-ruler/BasePairsRuler';
import { Gene } from 'src/content/app/entity-viewer/types/gene';
import { EntityViewerGeneViewTranscriptsUI } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewState';

import { getViewTranscriptsContentUI } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewSelectors';

import styles from './DefaultTranscriptsList.scss';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

type Props = {
  gene: Gene;
  rulerTicks: TicksAndScale;
  transcriptscontentUI: EntityViewerGeneViewTranscriptsUI;
};

const DefaultTranscriptslist = (props: Props) => {
  const { gene } = props;
  const sortedTranscripts = defaultSort(gene.transcripts);
  const {
    expadndedTranscriptIds,
    expandedTranscriptDownloads
  } = props.transcriptscontentUI;

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.row}>
          <div className={styles.left}>Filter & sort</div>
          <div className={styles.middle}></div>
          <div className={styles.right}>Transcript ID</div>
        </div>
      </div>
      <div className={styles.content}>
        <StripedBackground {...props} />
        {sortedTranscripts.map((transcript, index) => {
          const expandTranscript =
            expadndedTranscriptIds?.includes(transcript.id) || false;
          const expandDownload =
            expandedTranscriptDownloads?.includes(transcript.id) || false;

          return (
            <DefaultTranscriptsListItem
              key={index}
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
  transcriptscontentUI: getViewTranscriptsContentUI(state)
});

export default connect(mapStateToProps)(DefaultTranscriptslist);
