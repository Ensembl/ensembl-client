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

import classNames from 'classnames';
import type { Pick2, Pick3 } from 'ts-multipick';

import { getStrandDisplayName } from 'src/shared/helpers/formatters/strandFormatter';
import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';

import useTranscriptViewIds from 'src/content/app/entity-viewer/transcript-view/hooks/useTranscriptViewIds';
import { useDefaultEntityViewerTranscriptQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

import type { FullTranscript } from 'src/shared/types/core-api/transcript';

import commonStyles from 'src/shared/components/feature-summary-strip/FeatureSummaryStrip.module.css';
import styles from './TranscriptSummaryStrip.module.css';

type TranscriptInSummaryStrip = Pick<FullTranscript, 'stable_id'> &
  Pick2<FullTranscript, 'slice', 'location'> &
  Pick3<FullTranscript, 'slice', 'region', 'name'> &
  Pick3<FullTranscript, 'slice', 'strand', 'code'> &
  Pick3<FullTranscript, 'metadata', 'biotype', 'value'>;

type Props = {
  transcript: TranscriptInSummaryStrip;
};

const TranscriptSummaryStripDataWrapper = () => {
  const { activeGenomeId, transcriptId } = useTranscriptViewIds();
  const { currentData } = useDefaultEntityViewerTranscriptQuery(
    {
      genomeId: activeGenomeId ?? '',
      transcriptId: transcriptId ?? ''
    },
    {
      skip: !activeGenomeId || !transcriptId
    }
  );

  if (currentData) {
    return <TranscriptSummaryStrip transcript={currentData.transcript} />;
  }
};

/**
 * NOTE: This component might be extracted into a shared component
 * to be reused in the genome browser page.
 */

const TranscriptSummaryStrip = (props: Props) => {
  const { transcript } = props;
  return (
    <div
      className={classNames(commonStyles.featureSummaryStrip, styles.container)}
    >
      <span className={commonStyles.section}>
        <span className={commonStyles.featureSummaryStripLabel}>
          Transcript{' '}
        </span>
        <span className={commonStyles.featureNameEmphasized}>
          {transcript.stable_id}
        </span>
      </span>
      <span className={commonStyles.section}>
        <span className={commonStyles.featureSummaryStripLabel}>Biotype </span>
        <span>{transcript.metadata.biotype.value}</span>
      </span>
      <span className={commonStyles.section}>
        {getStrandDisplayName(transcript.slice.strand.code)}
      </span>
      <span className={commonStyles.section}>
        {getFormattedLocation({
          chromosome: transcript.slice.region.name,
          start: transcript.slice.location.start,
          end: transcript.slice.location.end
        })}
      </span>
    </div>
  );
};

export default TranscriptSummaryStripDataWrapper;
