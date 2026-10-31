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

import type { CSSProperties } from 'react';
import { useSearchParams } from 'react-router';

import { getTranscriptSequenceViewFromSearchParams } from 'src/content/app/sequence-viewer/utils/getTranscriptSequenceView';

import useTranscriptSequenceSettings from 'src/content/app/sequence-viewer/hooks/useTranscriptSequenceSettings';

import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';

import useTranscriptSequence from './useTranscriptSequence';

import TranscriptSequenceTypes from './TranscriptSequenceTypes';
import { CircleLoader } from 'src/shared/components/loader';
import Sequence from 'src/content/app/sequence-viewer/components/sequence/Sequence';

import commonStyles from '../../styles/sequence-viewer-common-styles.module.css';
import styles from './TranscriptSequence.module.css';

type Props = {
  genomeId: string;
  transcriptId: string;
};

// Example url:
// http://localhost:8080/sequence-viewer/GCA_000001405.29?focus=transcript:ENST00000380152&location=13:32272786-32444334

const TranscriptSequence = (props: Props) => {
  const { genomeId, transcriptId } = props;
  const [searchParams] = useSearchParams();

  const transcriptView =
    getTranscriptSequenceViewFromSearchParams(searchParams);

  const {
    settings: sequenceSettings,
    isLoading: isLoadingSettings,
    isError: isSettingsError
  } = useTranscriptSequenceSettings({
    genomeId,
    transcriptId,
    sequenceView: transcriptView
  });

  const {
    data,
    isLoading: isLoadingSequence,
    isError: isSequenceError
  } = useTranscriptSequence({
    genomeId,
    transcriptId,
    settings: sequenceSettings
  });
  const isLoading =
    isLoadingSettings || (!isSettingsError && isLoadingSequence);
  const isError = isSettingsError || (!isLoadingSettings && isSequenceError);

  const transcriptEnd = data?.transcript.slice.location.end ?? 1;
  const formattedTranscriptEndString = formatNumber(transcriptEnd);
  const formattedGeneEndStringEnd = formattedTranscriptEndString.length;

  const inlineStyles: CSSProperties & { '--gutter-width': string } = {
    '--gutter-width': `${formattedGeneEndStringEnd}ch`
  };

  return (
    <div className={commonStyles.main} style={inlineStyles}>
      <div className={styles.sequenceTypesContainer}>
        <TranscriptSequenceTypes />
      </div>

      {isLoading && (
        <div className={commonStyles.loadingSpinnerContainer}>
          <CircleLoader />
        </div>
      )}

      {isError && (
        <div>
          There has been an error loading the {transcriptView} sequence of{' '}
          {transcriptId}
        </div>
      )}
      {data && !isLoading && !isError && (
        <Sequence
          genomeId={genomeId}
          transcript={{ stableId: transcriptId }}
          sequenceView={transcriptView}
          sequence={data.annotatedSequence}
        />
      )}
    </div>
  );
};

export default TranscriptSequence;
