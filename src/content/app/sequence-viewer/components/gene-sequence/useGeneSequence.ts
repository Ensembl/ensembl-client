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

import { fetchGeneInfo } from 'src/content/app/sequence-viewer/state/api/sequenceViewerApiSlice';
import {
  fetchAnnotatedSequence,
  prepareOptionsForPayload
} from 'src/content/app/sequence-viewer/utils/fetchAnnotatedSequence';

import type { GeneFeatureResponsePayload } from 'src/content/app/sequence-viewer/types/annotatedSequenceApi';
import type {
  SequenceSettings,
  GeneSequenceSettings
} from 'src/content/app/sequence-viewer/state/settings/settingsSlice';

type Data = {
  gene: GeneFeatureResponsePayload['gene'];
  annotatedSequence: string;
};

type State = {
  data: Data | null;
  isLoading: boolean;
  isError: boolean;
};

type StoredState = {
  genomeId: string;
  geneId: string;
  settings: GeneSequenceSettings;
  result: State;
};

const loadingState: State = {
  data: null,
  isLoading: true,
  isError: false
};

const useGeneSequence = ({
  genomeId,
  geneId,
  settings
}: {
  genomeId: string;
  geneId: string;
  settings: SequenceSettings | null;
}) => {
  const [storedState, setStoredState] = useState<StoredState | null>(null);
  const reduxDispatch = useAppDispatch();

  const matchingSettings =
    settings?.type === 'gene' && settings.geneId === geneId ? settings : null;

  useEffect(() => {
    if (!matchingSettings) {
      return;
    }

    const subscription = from(
      fetchData({
        reduxDispatch,
        geneId,
        genomeId,
        settings: matchingSettings
      })
    ).subscribe((result) => {
      setStoredState({
        genomeId,
        geneId,
        settings: matchingSettings,
        result
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [reduxDispatch, genomeId, geneId, matchingSettings]);

  const matchesCurrentRequest =
    matchingSettings !== null &&
    storedState !== null &&
    storedState.genomeId === genomeId &&
    storedState.geneId === geneId &&
    storedState.settings === matchingSettings;

  return matchesCurrentRequest ? storedState.result : loadingState;
};

async function* fetchData({
  genomeId,
  geneId,
  settings,
  reduxDispatch
}: {
  geneId: string;
  genomeId: string;
  reduxDispatch: AppDispatch;
  settings: GeneSequenceSettings;
}) {
  const { data: geneResponse } = await reduxDispatch(
    fetchGeneInfo.initiate(
      {
        stableId: geneId,
        genomeId
      },
      { subscribe: false }
    )
  );

  if (!geneResponse) {
    yield {
      data: null,
      isLoading: false,
      isError: true
    };
    return;
  }

  const { gene } = geneResponse;

  let annotatedSequence: string = '';

  if (hasGenomicSequenceException(gene.exceptions)) {
    // don't try to fetch the sequence
    yield {
      data: {
        gene,
        annotatedSequence
      },
      isLoading: false,
      isError: false
    };
    return;
  }

  try {
    const options = prepareOptionsForPayload(settings);

    annotatedSequence = await fetchAnnotatedSequence({
      genome_uuid: genomeId,
      focus_gene: { stable_id: geneId },
      options
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
      gene,
      annotatedSequence
    },
    isLoading: false,
    isError: false
  };
}

export default useGeneSequence;
