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
  createInitialLocationSettings
} from 'src/content/app/sequence-viewer/state/settings/settingsSlice';
import { useLocationSequenceOptionsQuery } from 'src/content/app/sequence-viewer/state/api/sequenceViewerApiSlice';

import {
  getGenomicLocationFromString,
  type GenomicLocation
} from 'src/shared/helpers/genomicLocationHelpers';

/**
 * This hook is used to fetch and initialise location sequence settings;
 * and thus should only be called from one component
 */

const useLocationSequenceSettings = ({
  genomeId,
  location
}: {
  genomeId: string;
  location: string;
}) => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) =>
    getSequenceSettings(state, {
      type: 'location',
      genomeId,
      location
    })
  );

  let parsedLocation: GenomicLocation | null = null;
  try {
    parsedLocation = getGenomicLocationFromString(location);
  } catch {
    // Invalid locations cannot be used to fetch sequence options.
  }

  const { currentData, isError: queryIsError } =
    useLocationSequenceOptionsQuery(
      {
        genomeId,
        regionName: parsedLocation?.regionName ?? '',
        start: parsedLocation?.start ?? 1,
        end: parsedLocation?.end ?? 1
      },
      { skip: !genomeId || !parsedLocation }
    );

  useEffect(() => {
    if (!genomeId || !location || !currentData || settings) {
      return;
    }

    dispatch(
      setInitialSequenceSettings({
        genomeId,
        ...createInitialLocationSettings({ location, payload: currentData })
      })
    );
  }, [dispatch, genomeId, location, currentData, settings]);

  const isError = !settings && (!parsedLocation || queryIsError);

  return {
    settings,
    isLoading: !settings && !isError,
    isError
  };
};

export default useLocationSequenceSettings;
