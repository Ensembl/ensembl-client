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

import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from 'src/store';
import { useGenomeTracksQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';

import browserTrackSettingsStorageService from 'src/content/app/genome-browser/components/track-settings-panel/services/trackSettingsStorageService';

import {
  getBrowserActiveGenomeId,
  getBrowserActiveFocusObject
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import {
  setInitialTrackSettingsForGenome,
  getDefaultGeneTrackSettings,
  getDefaultRegularTrackSettings,
  getTrackType,
  TrackType,
  type TrackSettings,
  type TrackSettingsForGenome,
  type CogList
} from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';
import { TrackId } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';

import type { GenomeTrackCategory } from 'src/content/app/genome-browser/state/types/tracks';
import type { FocusObject } from 'src/shared/types/focus-object/focusObjectTypes';

const useBrowserCogList = () => {
  const genomeId = useAppSelector(getBrowserActiveGenomeId) as string;
  const { data: trackCategories } = useGenomeTracksQuery(genomeId);
  const focusObject = useAppSelector(getBrowserActiveFocusObject); // should we think about what to do if there is no focus object

  const [cogList, setCogList] = useState<CogList | null>(null);

  const dispatch = useAppDispatch();

  // TODO: think about what should happen when we switch types of focus objects
  // eg gene -> variant -> region
  useEffect(() => {
    if (!trackCategories) {
      return;
    }

    const defaultTracksForGenome = prepareTrackSettings({
      trackCategories,
      focusObject
    });

    const savedTrackSettingsForGenome =
      getPersistentTrackSettingsForGenome(genomeId);

    const trackSettings = {
      tracks: defaultTracksForGenome,
      ...savedTrackSettingsForGenome
    };

    dispatch(setInitialTrackSettingsForGenome({ genomeId, trackSettings }));
  }, [trackCategories, focusObject, genomeId]);

  return {
    cogList,
    setCogList
  };
};

export const getPersistentTrackSettingsForGenome = (
  genomeId: string
): Partial<TrackSettingsForGenome> => {
  const trackSettings = browserTrackSettingsStorageService.getTrackSettings();
  return trackSettings[genomeId] ?? {};
};

const prepareTrackSettings = ({
  trackCategories,
  focusObject
}: {
  trackCategories: GenomeTrackCategory[];
  focusObject: FocusObject | null;
}) => {
  const defaultTrackSettings: TrackSettings = {};

  if (focusObject?.type === TrackType.GENE) {
    defaultTrackSettings[TrackId.GENE] = getDefaultGeneTrackSettings();
  }

  trackCategories.forEach((category) => {
    category.track_list.forEach((track) => {
      const { track_id } = track;
      const trackType = getTrackType(track_id);

      if (trackType === TrackType.GENE) {
        defaultTrackSettings[track_id] = getDefaultGeneTrackSettings();
      } else {
        defaultTrackSettings[track_id] = getDefaultRegularTrackSettings();
      }
    });
  });
  return defaultTrackSettings;
};

export default useBrowserCogList;
