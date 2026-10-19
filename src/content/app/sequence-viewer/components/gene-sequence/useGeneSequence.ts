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

import { fetchDefaultEntityViewerGene } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';
import {
  fetchAnnotatedSequence,
  prepareOptionsForPayload
} from 'src/content/app/sequence-viewer/utils/fetchAnnotatedSequence';

import type {
  SequenceSettings,
  GeneSequenceSettings
} from 'src/content/app/sequence-viewer/state/settings/settingsSlice';
import type { DefaultEntityViewerGene } from 'src/content/app/entity-viewer/state/api/queries/defaultGeneQuery';

type Data = {
  gene: DefaultEntityViewerGene;
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

const useGeneSequence = ({
  genomeId,
  geneId,
  settings
}: {
  genomeId: string;
  geneId: string;
  settings: SequenceSettings | null;
}) => {
  const [state, setState] = useState(initialState);
  const reduxDispatch = useAppDispatch();

  useEffect(() => {
    if (!settings || settings.type !== 'gene' || settings.geneId !== geneId) {
      return;
    }

    const subscription = from(
      fetchData({
        reduxDispatch,
        geneId,
        genomeId,
        settings
      })
    ).subscribe((data) => {
      setState(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [reduxDispatch, genomeId, geneId, settings]);

  return state;
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
  yield {
    data: null,
    isLoading: true,
    isError: false
  };

  const { data: geneResponse } = await reduxDispatch(
    fetchDefaultEntityViewerGene.initiate(
      {
        geneId,
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

  let annotatedSequence: string;

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
