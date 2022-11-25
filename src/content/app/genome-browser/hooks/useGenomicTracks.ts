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

import { useEffect, useRef } from 'react';
import pickBy from 'lodash/pickBy';

import { useAppSelector } from 'src/store';

import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';
import useGenomeBrowserIds from './useGenomeBrowserIds';
import { useGenomeTracksQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';

import { getAllTrackSettings } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSelectors';

import type { GenomeTrackCategory } from 'src/content/app/genome-browser/state/types/tracks';
import type { TrackSettingsPerTrack } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';

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
  const trackSettingsForGenome =
    useAppSelector(getAllTrackSettings)?.settingsForIndividualTracks;
  const { genomeBrowser, ...genomeBrowserMethods } = useGenomeBrowser();
  const genomeIdInitialisedRef = useRef('');

  const { data: genomeTrackCategories } = useGenomeTracksQuery(
    activeGenomeId as string,
    {
      skip: !activeGenomeId
    }
  );

  useEffect(() => {
    if (
      !genomeBrowser ||
      !trackSettingsForGenome ||
      !genomeTrackCategories ||
      genomeIdInitialisedRef.current === activeGenomeId
    ) {
      return;
    }

    const trackIdsList = prepareTrackIdsList(
      genomeTrackCategories ?? [],
      trackSettingsForGenome
    );
    trackIdsList.forEach(genomeBrowserMethods.toggleTrack);
    genomeIdInitialisedRef.current = activeGenomeId as string;

    // reset this ref on unmount to rerun this useEffect on mount for the last selected genome id
    return () => {
      genomeIdInitialisedRef.current = '';
    };
  }, [
    activeGenomeId,
    genomeTrackCategories,
    trackSettingsForGenome,
    genomeBrowser
  ]);

  useEffect(() => {
    if (!genomeBrowser || !trackSettingsForGenome) {
      return;
    }

    sendTrackSettings(trackSettingsForGenome, genomeBrowserMethods);
  }, [trackSettingsForGenome, genomeBrowser]);
};

type TrackIdsList = {
  trackId: string;
  isTurnedOn: boolean;
}[];

// Create a list of tracks to enable in the genome browser.
// Assume that all tracks should be enabled by default
const prepareTrackIdsList = (
  trackGroups: GenomeTrackCategory[],
  trackSettings: TrackSettingsPerTrack
): TrackIdsList => {
  const trackIdsList = trackGroups
    .flatMap(({ track_list }) => track_list)
    .map(({ track_id }) => {
      const track = trackSettings[track_id];
      const isVisibleTrack =
        'isVisible' in track?.settings && track.settings.isVisible;
      return {
        trackId: track_id,
        isTurnedOn: isVisibleTrack ?? true
      };
    });
  return trackIdsList;
};

const sendTrackSettings = (
  trackSettings: TrackSettingsPerTrack,
  genomeBrowserMethods: NonNullable<
    Omit<ReturnType<typeof useGenomeBrowser>, 'genomeBrowser'>
  >
) => {
  const genomicTrackSettings = pickBy(
    trackSettings,
    (_, key) => key !== 'focus'
  ); // exclude the focus track
  Object.entries(genomicTrackSettings).forEach(([trackId, { settings }]) => {
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
