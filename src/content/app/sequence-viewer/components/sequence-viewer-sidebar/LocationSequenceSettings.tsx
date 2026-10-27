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

import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from 'src/store';

import { getGenomicLocationFromString } from 'src/shared/helpers/genomicLocationHelpers';

import useSequenceViewerIds from 'src/content/app/sequence-viewer/hooks/useSequenceViewerIds';

import { getSequenceSettings } from 'src/content/app/sequence-viewer/state/settings/settingsSelectors';

import {
  updateSequenceSettings,
  type SequenceSettings
} from 'src/content/app/sequence-viewer/state/settings/settingsSlice';
import { useLocationSequenceOptionsQuery } from 'src/content/app/sequence-viewer/state/api/sequenceViewerApiSlice';

import { SequenceOptionsSections } from 'src/content/app/sequence-viewer/components/sequence-viewer-sidebar/sequence-options/SequenceOptions';

const getParsedLocation = (locationString: string) => {
  try {
    const genomicLocation = getGenomicLocationFromString(locationString);
    return genomicLocation;
  } catch {
    return null;
  }
};

const LocationSequenceSetttings = () => {
  const { genomeId, parsedFocusObjectId } = useSequenceViewerIds();
  const genomicLocationString = parsedFocusObjectId?.objectId;
  const parsedLocation = genomicLocationString
    ? getParsedLocation(genomicLocationString)
    : null;

  const sequenceSettings = useAppSelector((state) =>
    getSequenceSettings(state, {
      type: 'location',
      genomeId: genomeId ?? '',
      location: genomicLocationString ?? ''
    })
  );
  const dispatch = useAppDispatch();

  const { currentData } = useLocationSequenceOptionsQuery(
    {
      genomeId: genomeId ?? '',
      regionName: parsedLocation?.regionName ?? '',
      start: parsedLocation?.start ?? 1,
      end: parsedLocation?.end ?? 1
    },
    {
      skip: !parsedLocation || !genomeId
    }
  );

  const onSettingsChange = useCallback(
    (options: SequenceSettings['options']) => {
      if (!genomeId || !genomicLocationString) {
        // this shouldn't be possible
        return;
      }

      dispatch(
        updateSequenceSettings({
          type: 'location',
          genomeId,
          location: genomicLocationString,
          options
        })
      );
    },
    [dispatch, genomeId, genomicLocationString]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '0.6rem' }}>
      {currentData && sequenceSettings?.options && (
        <SequenceOptionsSections
          appliedSettings={sequenceSettings.options}
          onSettingsChange={onSettingsChange}
          sections={currentData.sections}
        />
      )}
    </div>
  );
};

export default LocationSequenceSetttings;
