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

import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';
import { hasGenomicSequenceException } from 'src/content/app/sequence-viewer/utils/exceptionsChecker';

import { getTranscriptSequenceViewFromSearchParams } from 'src/content/app/sequence-viewer/utils/getTranscriptSequenceView';

import { useTranscriptInfoQuery } from 'src/content/app/sequence-viewer/state/api/sequenceViewerApiSlice';

import useTranscriptSequenceSettings from 'src/content/app/sequence-viewer/hooks/useTranscriptSequenceSettings';
import useTranscriptSequence from './useTranscriptSequence';

import TranscriptSequenceTypes from './TranscriptSequenceTypes';
import { CircleLoader } from 'src/shared/components/loader';
import ExceptionWarning from 'src/content/app/sequence-viewer/components/exception-warning/ExceptionWarning';
import Sequence from 'src/content/app/sequence-viewer/components/sequence/Sequence';

import commonStyles from '../../styles/sequence-viewer-common-styles.module.css';
import styles from './TranscriptSequence.module.css';

type Props = {
  genomeId: string;
  transcriptId: string;
};

const TranscriptSequence = (props: Props) => {
  const { genomeId, transcriptId } = props;
  const [searchParams] = useSearchParams();

  const transcriptView =
    getTranscriptSequenceViewFromSearchParams(searchParams);

  const {
    currentData: transcriptInfo,
    isFetching: isFetchingTranscriptInfo,
    isError: transcriptInfoError
  } = useTranscriptInfoQuery({
    genomeId: genomeId ?? '',
    stableId: transcriptId ?? ''
  });

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
    isFetchingTranscriptInfo ||
    isLoadingSettings ||
    (!isSettingsError && isLoadingSequence);
  const isError =
    transcriptInfoError ||
    isSettingsError ||
    (!isLoadingSettings && isSequenceError);

  const transcriptEnd = data?.transcript.end ?? 1;
  const formattedTranscriptEndString = formatNumber(transcriptEnd);
  const formattedGeneEndStringEnd = formattedTranscriptEndString.length;

  const inlineStyles: CSSProperties & { '--gutter-width': string } = {
    '--gutter-width': `${formattedGeneEndStringEnd}ch`,
    paddingTop: 0 // override top padding of the main component to prevent sequence from being visible when it scrolls past the stuck TranscriptSequenceTypes
  };

  if (isFetchingTranscriptInfo) {
    return (
      <div className={commonStyles.main}>
        <div className={commonStyles.loadingSpinnerContainer}>
          <CircleLoader />
        </div>
      </div>
    );
  }

  const isGenomicSequenceException =
    transcriptView === 'genomic' &&
    hasGenomicSequenceException(data?.transcript.exceptions ?? []);
  const canShowSequence =
    data && !isLoading && !isError && !isGenomicSequenceException;

  return (
    <div className={commonStyles.main} style={inlineStyles}>
      <div className={styles.sequenceTypesContainer}>
        <TranscriptSequenceTypes
          hasProtein={transcriptInfo?.transcript.has_protein ?? true}
          canDisplayGenomicSequence={true}
        />
      </div>

      {isLoading && (
        <div className={commonStyles.loadingSpinnerContainer}>
          <CircleLoader />
        </div>
      )}

      {data && isGenomicSequenceException && (
        <ExceptionWarning exceptions={data?.transcript.exceptions} />
      )}

      {isError && (
        <div>
          There has been an error loading the {transcriptView} sequence of{' '}
          {transcriptId}
        </div>
      )}

      {canShowSequence && (
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
