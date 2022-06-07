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

import browserTrackConfigStorageService from 'src/content/app/genome-browser/components/browser-track-config/services/browserTrackConfigStorageService';

import { getGenomeTrackCategories } from 'src/shared/state/genome/genomeSelectors';
import {
  getBrowserActiveGenomeId,
  getBrowserActiveFocusObject
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import {
  setInitialTrackConfigsForGenome,
  getDefaultGeneTrackConfig,
  getDefaultRegularTrackConfig,
  getTrackType,
  TrackType,
  type TrackConfigs,
  type TrackConfigsForGenome
} from 'src/content/app/genome-browser/state/track-config/trackConfigSlice';

import type { GenomeTrackCategory } from 'src/shared/state/genome/genomeTypes';
import type { FocusObject } from 'src/shared/types/focus-object/focusObjectTypes';

const useBrowserCogList = () => {
  const genomeId = useAppSelector(getBrowserActiveGenomeId) as string;
  const trackCategories = useAppSelector(getGenomeTrackCategories);
  const focusObject = useAppSelector(getBrowserActiveFocusObject); // should we think about what to do if there is no focus object

  const dispatch = useAppDispatch();

  const trackCategoriesForGenome = trackCategories[genomeId];

  // TODO: think about what should happen when we switch types of focus objects
  // eg gene -> variant -> region
  useEffect(() => {
    if (!trackCategoriesForGenome) {
      return;
    }

    const defaultTracksForGenome = prepareTrackConfigs({
      trackCategories: trackCategoriesForGenome,
      focusObject
    });

    const savedTrackConfigsForGenome =
      getPersistentTrackConfigsForGenome(genomeId);

    const trackConfigs = {
      tracks: defaultTracksForGenome,
      ...savedTrackConfigsForGenome
    };

    dispatch(setInitialTrackConfigsForGenome({ genomeId, trackConfigs }));
  }, [trackCategories, focusObject]);
};

export const getPersistentTrackConfigsForGenome = (
  genomeId: string
): Partial<TrackConfigsForGenome> => {
  const trackConfigs = browserTrackConfigStorageService.getTrackConfigs();
  return trackConfigs[genomeId] ?? {};
};

export const prepareTrackConfigs = ({
  trackCategories,
  focusObject
}: {
  trackCategories: GenomeTrackCategory[];
  focusObject: FocusObject | null;
}) => {
  const defaultTrackConfigs: TrackConfigs = {};

  if (focusObject?.type === TrackType.GENE) {
    defaultTrackConfigs['gene-focus'] = getDefaultGeneTrackConfig();
  }

  trackCategories.forEach((category) => {
    category.track_list.forEach((track) => {
      const trackId = track.track_id.replace('track:', '');
      const trackType = getTrackType(trackId);

      if (trackType === TrackType.GENE) {
        defaultTrackConfigs[trackId] = getDefaultGeneTrackConfig();
      } else {
        defaultTrackConfigs[trackId] = getDefaultRegularTrackConfig();
      }
    });
  });
  return defaultTrackConfigs;
};

export default useBrowserCogList;
