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
  createInitialGeneSettings
} from 'src/content/app/sequence-viewer/state/settings/settingsSlice';
import { useGeneSequenceOptionsQuery } from 'src/content/app/sequence-viewer/state/api/sequenceViewerApiSlice';

/**
 * This hook is used to fetch and initialise gene sequence settings;
 * and thus should only be called from one component
 */

const useGeneSequenceSettings = ({
  genomeId,
  geneId
}: {
  genomeId: string;
  geneId: string;
}) => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) =>
    getSequenceSettings(state, {
      type: 'gene',
      genomeId,
      geneId
    })
  );

  const { currentData, isError: queryIsError } = useGeneSequenceOptionsQuery(
    {
      genomeId,
      geneId
    },
    { skip: !genomeId || !geneId }
  );

  useEffect(() => {
    if (!genomeId || !geneId || !currentData || settings) {
      return;
    }

    dispatch(
      setInitialSequenceSettings({
        genomeId,
        ...createInitialGeneSettings({ geneId, payload: currentData })
      })
    );
  }, [dispatch, genomeId, geneId, currentData, settings]);

  const isError = !settings && queryIsError;

  return {
    settings,
    isLoading: !settings && !isError,
    isError
  };
};

export default useGeneSequenceSettings;
