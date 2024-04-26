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

import { getFeatureLength } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import { getTranscriptSortingFunction } from 'src/content/app/entity-viewer/shared/helpers/transcripts-sorter';
import { filterTranscripts } from 'src/content/app/entity-viewer/shared/helpers/transcripts-filter';

import useExpandedDefaultTranscript from 'src/content/app/entity-viewer/gene-view/hooks/useExpandedDefaultTranscript';

import {
  getExpandedTranscriptIds,
  getExpandedTranscriptDownloadIds,
  getExpandedTranscriptMoreInfoIds,
  getFilters,
  getSortingRule
} from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSelectors';

import DefaultTranscriptsListItem from './default-transcripts-list-item/DefaultTranscriptListItem';

import type { TicksAndScale } from 'src/shared/components/feature-length-ruler/FeatureLengthRuler';
import type { DefaultEntityViewerGeneQueryResult } from 'src/content/app/entity-viewer/state/api/queries/defaultGeneQuery';

import styles from './DefaultTranscriptsList.module.css';

type Transcript =
  DefaultEntityViewerGeneQueryResult['gene']['transcripts'][number];

export type Props = {
  gene: DefaultEntityViewerGeneQueryResult['gene'];
  rulerTicks: TicksAndScale;
};

const DefaultTranscriptslist = (props: Props) => {
  const expandedTranscriptIds = useSelector(getExpandedTranscriptIds);
  const expandedTranscriptDownloadIds = useSelector(
    getExpandedTranscriptDownloadIds
  );
  const expandedTranscriptMoreInfoIds = useSelector(
    getExpandedTranscriptMoreInfoIds
  );
  const sortingRule = useSelector(getSortingRule);
  const filters = useSelector(getFilters);

  const { gene } = props;

  const filteredTranscripts = filterTranscripts(gene.transcripts, filters);

  const sortingFunction = getTranscriptSortingFunction<Transcript>(sortingRule);
  const sortedTranscripts = sortingFunction(filteredTranscripts);

  useExpandedDefaultTranscript({
    geneStableId: gene.stable_id,
    transcripts: gene.transcripts
  });

  return (
    <div className={styles.transcriptsList}>
      <div className={styles.header}>
        <div className={styles.row}>
          <div className={styles.right}>Transcript ID</div>
        </div>
      </div>
      <div className={styles.content}>
        <StripedBackground {...props} />
        {sortedTranscripts.map((transcript, index) => {
          const expandTranscript = expandedTranscriptIds.includes(
            transcript.stable_id
          );
          const expandDownload = expandedTranscriptDownloadIds.includes(
            transcript.stable_id
          );
          const expandMoreInfo = expandedTranscriptMoreInfoIds.includes(
            transcript.stable_id
          );

          return (
            <DefaultTranscriptsListItem
              key={index}
              transcriptPosition={index + 1}
              gene={gene}
              transcript={transcript}
              rulerTicks={props.rulerTicks}
              expandTranscript={expandTranscript}
              expandDownload={expandDownload}
              expandMoreInfo={expandMoreInfo}
            />
          );
        })}
      </div>
    </div>
  );
};

const StripedBackground = (props: Props) => {
  const { scale, ticks } = props.rulerTicks;
  const geneLength = getFeatureLength(props.gene);
  const extendedTicks = [1, ...ticks, geneLength];

  const stripes = extendedTicks.map((tick) => {
    const x = Math.floor(scale(tick) as number);
    const style = { left: `${x}px` };
    return <span key={x} className={styles.stripe} style={style} />;
  });

  return <div className={styles.stripedBackground}>{stripes}</div>;
};

export default DefaultTranscriptslist;
