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
import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

import { getTrackSettingsForGenome as restoreTrackSettingsForGenome } from 'src/content/app/genome-browser/services/track-settings/trackSettingsStorageService';
import * as genomeBrowserCommands from 'src/content/app/genome-browser/services/genome-browser-service/genomeBrowserCommands';

import {
  getBrowserActiveGenomeId,
  getBrowserActiveFocusObject
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { getAllTrackSettings } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSelectors';
import { getDisplayedTrackIds } from 'src/content/app/genome-browser/state/displayed-tracks/displayedTracksSelectors';
import { getSelectedTrackPanelTab } from 'src/content/app/genome-browser/state/track-panel/trackPanelSelectors';

import {
  setInitialTrackSettingsForGenome,
  getTrackType,
  type TrackSettingsPerTrack
} from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';
import {
  buildDefaultFocusGeneTrack,
  buildDefaultGeneTrack,
  buildDefaultRegularTrack,
  TrackType
} from 'src/content/app/genome-browser/state/track-settings/trackSettingsConstants';

import { TrackId } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';
import type { GenomeTrackCategory } from 'src/content/app/genome-browser/state/types/tracks';
import type { FocusObject } from 'src/shared/types/focus-object/focusObjectTypes';

/**
 * The purpose of this hook is to:
 * - restore track settings from browser storage
 * - run the hooks that will tell genome browser to display the tracks appropriately
 */

const useGenomeBrowserTracks = () => {
  const genomeId = useAppSelector(getBrowserActiveGenomeId);
  const { currentData: trackCategories } = useGenomeTracksQuery(
    genomeId ?? '',
    {
      skip: !genomeId
    }
  );
  const focusObject = useAppSelector(getBrowserActiveFocusObject); // should we think about what to do if there is no focus object
  const trackSettingsForGenome =
    useAppSelector(getAllTrackSettings)?.settingsForIndividualTracks;
  const visibleTrackIds = useAppSelector(getDisplayedTrackIds); // get list of ids of tracks currently rendered in genome browser
  const selectedTrackPanelTab = useAppSelector(getSelectedTrackPanelTab);
  const { toggleTrack, genomeBrowser } = useGenomeBrowser();

  const dispatch = useAppDispatch();

  // This effect is for initialising track setting if they are missing
  useEffect(() => {
    // skip the effect if track categories have not yet been fetched
    // or if they have already been set
    if (
      !trackCategories ||
      !focusObject ||
      trackSettingsForGenome ||
      !genomeId
    ) {
      return;
    }

    initialiseTrackSettingsForGenome({
      genomeId,
      dispatch,
      trackCategories,
      focusObject
    });
  }, [trackCategories, focusObject, genomeId]);

  // make sure to tell genome browser to hide tracks that a given genome id doesn't have
  useEffect(() => {
    if (!trackSettingsForGenome || !visibleTrackIds.length) {
      return;
    }
    const nonFocusVisibleTracks = visibleTrackIds.filter(
      (id) => id !== 'focus'
    );
    const trackIdsForCurrentGenome = new Set(
      Object.keys(trackSettingsForGenome)
    );
    const trackIdsToHide = nonFocusVisibleTracks.filter(
      (id) => !trackIdsForCurrentGenome.has(id)
    );

    trackIdsToHide.forEach((trackId) => {
      toggleTrack({ trackId, isEnabled: false });
    });
  }, [trackSettingsForGenome, visibleTrackIds]);

  // mark the tracks that reflect the content of the current tab inside the track panel
  useEffect(() => {
    if (!genomeBrowser) {
      return;
    }

    // take the first letter of the track panel tab name, and chuck it over to the genome browser
    const trackGroup = selectedTrackPanelTab[0].toUpperCase();

    genomeBrowserCommands.markTrackGroup({
      genomeBrowser,
      trackGroup
    });
  }, [genomeBrowser, selectedTrackPanelTab]);

  // run hooks responsible for communicating to genome browser the enabled tracks and their settings
  useFocusTrack();
  useGenomicTracks();
};

const initialiseTrackSettingsForGenome = async (params: {
  genomeId: string;
  trackCategories: GenomeTrackCategory[];
  focusObject: FocusObject | null;
  dispatch: ReturnType<typeof useAppDispatch>;
}) => {
  const { genomeId, dispatch } = params;
  const trackSettingsForGenome = prepareTrackSettings(params);
  const restoredTrackSettings = await restoreTrackSettingsForGenome(genomeId);

  for (const trackId in trackSettingsForGenome) {
    const storedTrackData = restoredTrackSettings.find(
      (item) => trackId === item.trackId
    );
    if (storedTrackData) {
      trackSettingsForGenome[trackId].settings = {
        ...trackSettingsForGenome[trackId].settings,
        ...storedTrackData.settings
      };
    }
  }

  dispatch(
    setInitialTrackSettingsForGenome({
      genomeId,
      trackSettings: trackSettingsForGenome
    })
  );
};

// NOTE: this function should probably be responsible for reading stored track data? But remember that this is an asynchronous operation
const prepareTrackSettings = ({
  trackCategories,
  focusObject
}: {
  trackCategories: GenomeTrackCategory[];
  focusObject: FocusObject | null;
}) => {
  const defaultTrackSettings: TrackSettingsPerTrack = {};

  if (focusObject?.type === TrackType.GENE) {
    defaultTrackSettings[TrackId.GENE] = buildDefaultFocusGeneTrack(
      TrackId.GENE
    );
  }

  trackCategories.forEach((category) => {
    category.track_list.forEach((track) => {
      const { track_id } = track;
      const trackType = getTrackType(track_id);

      if (trackType === TrackType.GENE) {
        defaultTrackSettings[track_id] = buildDefaultGeneTrack(track_id);
      } else {
        defaultTrackSettings[track_id] = buildDefaultRegularTrack(track_id);
      }
    });
  });
  return defaultTrackSettings;
};

export default useGenomeBrowserTracks;
