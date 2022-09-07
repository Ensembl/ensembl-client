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
import { useGenomeTracksQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';
import useFocusTrack from './useFocusTrack';
import useGenomicTracks from './useGenomicTracks';
import useBrowserCogList from 'src/content/app/genome-browser/components/browser-cog/useBrowserCogList';
import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

import browserTrackSettingsStorageService from 'src/content/app/genome-browser/components/track-settings-panel/services/trackSettingsStorageService';

import {
  getBrowserActiveGenomeId,
  getBrowserActiveFocusObject
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { getAllTrackSettings } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSelectors';

import {
  setInitialTrackSettingsForGenome,
  getDefaultGeneTrackSettings,
  getDefaultRegularTrackSettings,
  getTrackType,
  TrackType,
  type TrackSettings,
  type TrackSettingsForGenome
} from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';

import { TrackId } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';
import { Status } from 'src/shared/types/status';
import type { GenomeTrackCategory } from 'src/content/app/genome-browser/state/types/tracks';
import type { FocusObject } from 'src/shared/types/focus-object/focusObjectTypes';

/**
 * The purpose of this hook is to:
 * - restore track settings from browser storage
 * - run the hooks that will tell genome browser to display the tracks appropriately
 */

const useGenomeBrowserTracks = () => {
  const genomeId = useAppSelector(getBrowserActiveGenomeId) as string;
  const { currentData: trackCategories } = useGenomeTracksQuery(genomeId);
  const focusObject = useAppSelector(getBrowserActiveFocusObject); // should we think about what to do if there is no focus object
  const trackSettingsForGenome = useAppSelector(getAllTrackSettings)?.tracks;
  const visibleTrackIds = getVisibleTrackIds(useBrowserCogList().cogList); // get list of ids of tracks currently rendered in genome browser
  const { toggleTrack } = useGenomeBrowser();

  const dispatch = useAppDispatch();

  // This effect is for initialising track setting if they are missing
  useEffect(() => {
    // skip the effect if track categories have not yet been fetched
    // or if they have already been set
    if (!trackCategories || !focusObject || trackSettingsForGenome) {
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

  // make sure to tell genome browser to hide tracks that a given genome id doesn't have
  useEffect(() => {
    if (!trackSettingsForGenome || !visibleTrackIds.length) {
      return;
    }
    const trackIdsForCurrentGenome = new Set(
      Object.keys(trackSettingsForGenome)
    );
    const trackIdsToHide = visibleTrackIds.filter(
      (id) => !trackIdsForCurrentGenome.has(id)
    );

    trackIdsToHide.forEach((trackId) => {
      toggleTrack({ trackId, status: Status.UNSELECTED });
    });
  }, [trackSettingsForGenome, visibleTrackIds]);

  // run hooks responsible for communicating to genome browser the enabled tracks and their settings
  useFocusTrack();
  useGenomicTracks();
};

const getPersistentTrackSettingsForGenome = (
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

const getVisibleTrackIds = (cogsList: Record<string, number> | null) => {
  cogsList = cogsList ?? {};

  return Object.keys(cogsList);
};

export default useGenomeBrowserTracks;
