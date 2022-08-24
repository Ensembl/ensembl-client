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
import { useAppSelector } from 'src/store';

import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';
import useGenomeBrowserIds from './useGenomeBrowserIds';
import { useGenomeTracksQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';

import { getBrowserTrackStates } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import { Status } from 'src/shared/types/status';
import type { GenomeTrackCategory } from 'src/content/app/genome-browser/state/types/tracks';
import type {
  TrackStates,
  TrackActivityStatus
} from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';

const useGenomicTracks = () => {
  const { activeGenomeId } = useGenomeBrowserIds();
  const allBrowserTrackStates = useAppSelector(getBrowserTrackStates);
  const { toggleTrack, genomeBrowser } = useGenomeBrowser();

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
    trackIdsList.forEach(toggleTrack);
  }, [
    activeGenomeId,
    genomeTrackCategories,
    savedGenomicTrackStates,
    genomeBrowser
  ]);
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

export default useGenomicTracks;
