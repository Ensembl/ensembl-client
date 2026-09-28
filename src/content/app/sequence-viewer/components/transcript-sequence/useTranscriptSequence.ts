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

import { getGBTranscriptSummary } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';
import { fetchAnnotatedSequence } from 'src/content/app/sequence-viewer/utils/fetchAnnotatedSequence';

import type { TranscriptSummaryQueryResult } from 'src/content/app/genome-browser/state/api/queries/transcriptSummaryQuery';
import type { TranscriptSequenceSettings } from 'src/content/app/sequence-viewer/state/settings/settingsSlice';
import type { AnnotatedSequenceRequestPayload } from 'src/content/app/sequence-viewer/types/annotatedSequenceApi';

type Data = {
  transcript: TranscriptSummaryQueryResult['transcript'];
  annotatedSequence: string;
};

type State = {
  data: Data | null;
  isLoading: boolean;
  isError: boolean;
};

const initialState: State = {
  data: null,
  isLoading: false,
  isError: false
};

const transcriptSettingsToPayloadOptions = (
  settings: TranscriptSequenceSettings
) => {
  const options: AnnotatedSequenceRequestPayload['options'] = {
    sequence_type: settings.view
  };

  if (settings.view === 'genomic') {
    options.show_introns = settings.shouldHighlightIntrons;
  }

  if (['genomic', 'cdna'].includes(settings.view)) {
    options.show_utr = settings.shouldHighlightUTRs;
  }

  if (['genomic', 'cdna', 'cds'].includes(settings.view)) {
    options.show_exons = settings.shouldHighlightExons;
    options.show_cds = settings.shouldHighlightCDS;
    options.show_codons = settings.shouldHighlightCodons;
    options.reverse_complement = settings.isReverseComplement;
  }

  if (settings.view !== 'protein') {
    options.show_protein = settings.shouldShowProteinAlignment;
  }

  return options;
};

const useTranscriptSequence = ({
  genomeId,
  transcriptId,
  settings
}: {
  genomeId: string;
  transcriptId: string;
  settings: TranscriptSequenceSettings;
}) => {
  const [state, setState] = useState(initialState);
  const reduxDispatch = useAppDispatch();

  useEffect(() => {
    const subscription = from(
      fetchData({
        reduxDispatch,
        transcriptId,
        genomeId,
        settings
      })
    ).subscribe((data) => {
      setState(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [reduxDispatch, genomeId, transcriptId, settings]);

  return state;
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
  yield {
    data: null,
    isLoading: true,
    isError: false
  };

  const { data: transcriptResponse } = await reduxDispatch(
    getGBTranscriptSummary.initiate(
      {
        transcriptId,
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

  let annotatedSequence: string;

  try {
    annotatedSequence = await fetchAnnotatedSequence({
      genome_uuid: genomeId,
      focus_transcript: { stable_id: transcriptId },
      options: transcriptSettingsToPayloadOptions(settings)
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
