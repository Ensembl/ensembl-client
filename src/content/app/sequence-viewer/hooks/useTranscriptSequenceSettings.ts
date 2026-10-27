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

import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from 'src/store';
import { getSequenceSettings } from 'src/content/app/sequence-viewer/state/settings/settingsSelectors';
import {
  setInitialSequenceSettings,
  createInitialTranscriptSettings
} from 'src/content/app/sequence-viewer/state/settings/settingsSlice';
import { useTranscriptSequenceOptionsQuery } from 'src/content/app/sequence-viewer/state/api/sequenceViewerApiSlice';

import type { TranscriptSequenceView } from 'src/content/app/sequence-viewer/types/transcriptSequenceView';

/**
 * This hook is used to fetch and initialise transcript sequence settings;
 * and thus should only be called from one component
 */

const useTranscriptSequenceSettings = ({
  genomeId,
  transcriptId,
  sequenceView
}: {
  genomeId: string;
  transcriptId: string;
  sequenceView: TranscriptSequenceView;
}) => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) =>
    getSequenceSettings(state, {
      type: 'transcript',
      genomeId,
      transcriptId,
      sequenceView
    })
  );

  const { currentData, isError: queryIsError } =
    useTranscriptSequenceOptionsQuery(
      {
        genomeId,
        transcriptId,
        sequenceType: sequenceView
      },
      { skip: !genomeId || !transcriptId }
    );

  useEffect(() => {
    if (!genomeId || !transcriptId || !currentData || settings) {
      return;
    }

    dispatch(
      setInitialSequenceSettings({
        genomeId,
        ...createInitialTranscriptSettings({
          transcriptId,
          sequenceView,
          payload: currentData
        })
      })
    );
  }, [dispatch, genomeId, transcriptId, currentData, settings, sequenceView]);

  const isError = !settings && queryIsError;

  return {
    settings,
    isLoading: !settings && !isError,
    isError
  };
};

export default useTranscriptSequenceSettings;
