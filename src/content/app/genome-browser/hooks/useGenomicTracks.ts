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
import pickBy from 'lodash/pickBy';

import { useAppSelector } from 'src/store';

import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';
import useGenomeBrowserIds from './useGenomeBrowserIds';
import { useGenomeTracksQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';

import { getAllTrackSettings } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSelectors';
import { getBrowserTrackStates } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import { Status } from 'src/shared/types/status';
import type { GenomeTrackCategory } from 'src/content/app/genome-browser/state/types/tracks';
import type {
  TrackStates,
  TrackActivityStatus
} from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';
import type { TrackSettings } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';

/**
 * The purposes of this hook are:
 * - tell the genome browser what tracks (apart from the focus track, which is
 *   another hook’s responsibility) to show for any given genome id
 * - tell the genome browser which settings to apply to the shown tracks
 *
 * Only one copy of this hook should be run.
 */

const useGenomicTracks = () => {
  const { activeGenomeId } = useGenomeBrowserIds();
  const allBrowserTrackStates = useAppSelector(getBrowserTrackStates);
  const trackSettingsForGenome =
    useAppSelector(getAllTrackSettings)?.tracks ?? {};
  const { genomeBrowser, ...genomeBrowserMethods } = useGenomeBrowser();

  const { data: genomeTrackCategories } = useGenomeTracksQuery(
    activeGenomeId as string,
    {
      skip: !activeGenomeId
    }
  );

  const savedGenomicTrackStates =
    allBrowserTrackStates[activeGenomeId ?? '']?.commonTracks ?? {};

  useEffect(() => {
    if (!genomeBrowser) {
      return;
    }

    const trackIdsList = combineWithSavedData(
      prepareTrackIdsList(genomeTrackCategories ?? []),
      savedGenomicTrackStates
    );
    trackIdsList.forEach(genomeBrowserMethods.toggleTrack);
  }, [
    activeGenomeId,
    genomeTrackCategories,
    savedGenomicTrackStates,
    genomeBrowser
  ]);

  useEffect(() => {
    if (!genomeBrowser) {
      return;
    }

    sendTrackSettings(trackSettingsForGenome, genomeBrowserMethods);
  }, [trackSettingsForGenome, genomeBrowser]);
};

type TrackIdsList = {
  trackId: string;
  status: Status;
}[];

// Create a list of tracks to enable in the genome browser.
// Assume that all tracks should be enabled by default
const prepareTrackIdsList = (
  trackGroups: GenomeTrackCategory[]
): TrackIdsList => {
  return trackGroups
    .flatMap(({ track_list }) => track_list)
    .map(({ track_id }) => ({
      trackId: track_id,
      status: Status.SELECTED
    }));
};

const combineWithSavedData = (
  trackIdsList: TrackIdsList,
  savedTrackStates: TrackStates
): TrackIdsList => {
  const savedTrackVisibilityMap = new Map<string, TrackActivityStatus>();
  Object.values(savedTrackStates)
    .flatMap((trackCategory) => Object.entries(trackCategory))
    .forEach(([trackId, trackStatus]) => {
      savedTrackVisibilityMap.set(trackId, trackStatus);
    }, {});
  return trackIdsList.map((item) => {
    const { trackId } = item;
    if (savedTrackVisibilityMap.has(trackId)) {
      const savedTrackStatus = savedTrackVisibilityMap.get(
        trackId
      ) as TrackActivityStatus;
      return { ...item, status: savedTrackStatus };
    } else {
      return item;
    }
  });
};

const sendTrackSettings = (
  trackSettings: TrackSettings,
  genomeBrowserMethods: NonNullable<
    Omit<ReturnType<typeof useGenomeBrowser>, 'genomeBrowser'>
  >
) => {
  const genomicTrackSettings = pickBy(
    trackSettings,
    (_, key) => key !== 'focus'
  ); // exclude the focus track
  Object.entries(genomicTrackSettings).forEach(([trackId, settings]) => {
    Object.entries(settings).forEach((keyValuePair) => {
      const [settingName, settingValue] = keyValuePair as [string, boolean];
      switch (settingName) {
        case 'showTrackName':
          genomeBrowserMethods.toggleTrackName({
            trackId,
            shouldShowTrackName: settingValue
          });
          break;
        case 'showFeatureLabels':
          genomeBrowserMethods.toggleFeatureLabels({
            trackId,
            shouldShowFeatureLabels: settingValue
          });
          break;
        case 'showSeveralTranscripts':
          genomeBrowserMethods.toggleSeveralTranscripts({
            trackId,
            shouldShowSeveralTranscripts: settingValue
          });
          break;
        case 'showTranscriptIds':
          genomeBrowserMethods.toggleTranscriptIds({
            trackId,
            shouldShowTranscriptIds: settingValue
          });
          break;
      }
    });
  });
};

export default useGenomicTracks;
