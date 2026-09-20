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

import { fetchSequenceViewerGene } from 'src/content/app/sequence-viewer/state/api/sequenceViewerApiSlice';
import { fetchRefgetSequence } from 'src/shared/state/api-slices/refgetSlice';

import type { SequenceViewerGene } from 'src/content/app/sequence-viewer/state/api/queries/geneQuery';

type Data = {
  gene: SequenceViewerGene;
  sequence: string;
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
  geneId
}: {
  genomeId: string;
  geneId: string;
}) => {
  const [state, setState] = useState(initialState);
  const reduxDispatch = useAppDispatch();

  useEffect(() => {
    const subscription = from(
      fetchData({
        reduxDispatch,
        geneId,
        genomeId
      })
    ).subscribe((data) => {
      setState(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [reduxDispatch, genomeId, geneId]);

  return state;
};

async function* fetchData({
  genomeId,
  geneId,
  reduxDispatch
}: {
  geneId: string;
  genomeId: string;
  reduxDispatch: AppDispatch;
}) {
  yield {
    data: null,
    isLoading: true,
    isError: false
  };

  const { data: geneResponse } = await reduxDispatch(
    fetchSequenceViewerGene.initiate(
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
  const regionChecksum = gene.slice.region.sequence.checksum;
  const start = gene.slice.location.start;
  const end = gene.slice.location.end;
  const strand = gene.slice.strand.code;

  const { data: sequence } = await reduxDispatch(
    fetchRefgetSequence.initiate({
      checksum: regionChecksum,
      start,
      end,
      strand
    })
  );

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
      gene,
      sequence
    },
    isLoading: false,
    isError: false
  };
}

export default useGeneSequence;
