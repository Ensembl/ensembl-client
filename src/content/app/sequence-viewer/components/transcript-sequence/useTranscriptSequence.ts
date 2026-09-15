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
import { fetchRefgetSequence } from 'src/shared/state/api-slices/refgetSlice';

import type { TranscriptSummaryQueryResult } from 'src/content/app/genome-browser/state/api/queries/transcriptSummaryQuery';

type Data = {
  transcript: TranscriptSummaryQueryResult['transcript'];
  sequence: string;
  proteinSequence: string | null;
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

const useTranscriptSequence = ({
  genomeId,
  transcriptId
}: {
  genomeId: string;
  transcriptId: string;
}) => {
  const [state, setState] = useState(initialState);
  const reduxDispatch = useAppDispatch();

  useEffect(() => {
    const subscription = from(
      fetchData({
        reduxDispatch,
        transcriptId,
        genomeId
      })
    ).subscribe((data) => {
      setState(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [reduxDispatch, genomeId, transcriptId]);

  return state;
};

async function* fetchData({
  genomeId,
  transcriptId,
  reduxDispatch
}: {
  transcriptId: string;
  genomeId: string;
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
  const regionChecksum = transcript.slice.region.sequence.checksum;
  const start = transcript.slice.location.start;
  const end = transcript.slice.location.end;
  const strand = transcript.slice.strand.code;

  const proteinContext = transcript.product_generating_contexts
    .find(context => context.product_type === 'Protein');


  const { data: sequence } = await reduxDispatch(
    fetchRefgetSequence.initiate({
      checksum: regionChecksum,
      start,
      end,
      strand
    })
  );

  let proteinSequence: string | null = null;

  if (proteinContext) {
    const {data: sequence } = await reduxDispatch(
      fetchRefgetSequence.initiate({
        checksum: proteinContext.product!.sequence.checksum
      })
    );
    if (sequence) {
      proteinSequence = sequence;
    }
  }


  if (!sequence) {
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
      sequence,
      proteinSequence
    },
    isLoading: false,
    isError: false
  };
}

export default useTranscriptSequence;
