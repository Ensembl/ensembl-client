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

import { useState, useEffect } from 'react';
import { from } from 'rxjs';

import { useAppDispatch, type AppDispatch } from 'src/store';

import { hasGenomicSequenceException } from 'src/content/app/sequence-viewer/utils/exceptionsChecker';

import { fetchTranscriptInfo } from 'src/content/app/sequence-viewer/state/api/sequenceViewerApiSlice';
import {
  fetchAnnotatedSequence,
  prepareOptionsForPayload
} from 'src/content/app/sequence-viewer/utils/fetchAnnotatedSequence';

import type { TranscriptSequenceView } from 'src/content/app/sequence-viewer/types/transcriptSequenceView';
import type { TranscriptFeatureResponsePayload } from 'src/content/app/sequence-viewer/types/annotatedSequenceApi';
import type {
  SequenceSettings,
  TranscriptSequenceSettings
} from 'src/content/app/sequence-viewer/state/settings/settingsSlice';

type Data = {
  transcript: TranscriptFeatureResponsePayload['transcript'];
  annotatedSequence: string;
};

type State = {
  data: Data | null;
  isLoading: boolean;
  isError: boolean;
};

type StoredState = {
  genomeId: string;
  transcriptId: string;
  sequenceView: TranscriptSequenceView;
  settings: TranscriptSequenceSettings;
  result: State;
};

const loadingState: State = {
  data: null,
  isLoading: true,
  isError: false
};

const useTranscriptSequence = ({
  genomeId,
  transcriptId,
  sequenceView,
  settings
}: {
  genomeId: string;
  transcriptId: string;
  sequenceView: TranscriptSequenceView;
  settings: SequenceSettings | null;
}) => {
  const [storedState, setStoredState] = useState<StoredState | null>(null);
  const reduxDispatch = useAppDispatch();

  const matchingSettings =
    settings?.type === 'transcript' &&
    settings.transcriptId === transcriptId &&
    settings.sequenceView === sequenceView
      ? settings
      : null;

  useEffect(() => {
    if (!matchingSettings) {
      return;
    }

    const subscription = from(
      fetchData({
        reduxDispatch,
        transcriptId,
        genomeId,
        settings: matchingSettings
      })
    ).subscribe((result) => {
      setStoredState({
        genomeId,
        transcriptId,
        sequenceView,
        settings: matchingSettings,
        result
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [reduxDispatch, genomeId, transcriptId, sequenceView, matchingSettings]);

  const matchesCurrentRequest =
    matchingSettings !== null &&
    storedState !== null &&
    storedState.genomeId === genomeId &&
    storedState.transcriptId === transcriptId &&
    storedState.sequenceView === sequenceView &&
    storedState.settings === matchingSettings;

  return matchesCurrentRequest ? storedState.result : loadingState;
};

async function* fetchData({
  genomeId,
  transcriptId,
  settings,
  reduxDispatch
}: {
  transcriptId: string;
  genomeId: string;
  settings: TranscriptSequenceSettings;
  reduxDispatch: AppDispatch;
}) {
  const { data: transcriptResponse } = await reduxDispatch(
    fetchTranscriptInfo.initiate(
      {
        stableId: transcriptId,
        genomeId
      },
      { subscribe: false }
    )
  );

  if (!transcriptResponse) {
    yield {
      data: null,
      isLoading: false,
      isError: true
    };
    return;
  }

  const { transcript } = transcriptResponse;

  let annotatedSequence: string = '';

  if (
    settings.sequenceView === 'genomic' &&
    hasGenomicSequenceException(transcript.exceptions)
  ) {
    yield {
      data: {
        transcript,
        annotatedSequence
      },
      isLoading: false,
      isError: false
    };
    return; // don't fetch the sequence
  }

  try {
    annotatedSequence = await fetchAnnotatedSequence({
      genome_uuid: genomeId,
      focus_transcript: { stable_id: transcriptId },
      options: prepareOptionsForPayload(settings),
      sequence_type: settings.sequenceView
    });
  } catch {
    yield {
      data: null,
      isLoading: false,
      isError: true
    };
    return;
  }

  yield {
    data: {
      transcript,
      annotatedSequence
    },
    isLoading: false,
    isError: false
  };
}

export default useTranscriptSequence;
