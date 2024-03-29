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
import { useContext, useRef, useEffect } from 'react';

import config from 'config';
import { useAppSelector } from 'src/store';

import {
  GenomeBrowserLoader,
  GenomeBrowserService
} from 'src/content/app/genome-browser/services/genome-browser-service/genomeBrowserService';
import { parseFocusObjectId } from 'src/shared/helpers/focusObjectHelpers';
import * as genomeBrowserCommands from 'src/content/app/genome-browser/services/genome-browser-service/genomeBrowserCommands';

import { GenomeBrowserContext } from 'src/content/app/genome-browser/contexts/GenomeBrowserContext';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { useGenomeTracksQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';

import type { ChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import type { GenomeTrackCategory } from 'src/content/app/genome-browser/state/types/tracks';

const useMandatoryGenomeBrowserContext = () => {
  const genomeBrowserContext = useContext(GenomeBrowserContext);
  if (!genomeBrowserContext) {
    throw new Error(
      'useGenomeBrowser must be used with GenomeBrowserContext Provider'
    );
  }

  return genomeBrowserContext;
};

const useGenomeBrowser = () => {
  const genomeBrowserContext = useMandatoryGenomeBrowserContext();
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId);

  const trackIdToPathMap = useTrackIdToTrackPathMap();

  const {
    genomeBrowser,
    genomeBrowserService,
    setGenomeBrowser,
    setGenomeBrowserService,
    setZmenus,
    zmenus
  } = genomeBrowserContext;
  const genomeBrowserServiceRef = useRef<typeof GenomeBrowserService | null>(
    null
  );

  useEffect(() => {
    genomeBrowserServiceRef.current = genomeBrowserService;
  }, [genomeBrowserService]);

  const activateGenomeBrowser = async (params: { container: HTMLElement }) => {
    const genomeBrowserService =
      await GenomeBrowserLoader.activateGenomeBrowser({
        backend_url: config.genomeBrowserBackendBaseUrl,
        target_element: params.container
      });
    const genomeBrowser = genomeBrowserService.getGenomeBrowser();

    setGenomeBrowser(() => genomeBrowser);
    setGenomeBrowserService(() => genomeBrowserService); // using the callback api of the state setter to avoid it calling genomeBrowserService thinking that it is a function
  };

  // NOTE: the cleanup code in the method below refers only to ensembl-client's code that deals with the genome browser.
  // There is no cleanup method on the genome browser itself.
  // We trust it to terminate correctly when the DOM element that it is given control over is unmounted.
  const clearGenomeBrowser = () => {
    genomeBrowserServiceRef.current?.reset();
    setGenomeBrowser(null);
    setGenomeBrowserService(null);
  };

  // the focusObjectId is in the format "genome_id:object_type:object_id"
  const setFocusObject = (focusObjectId: string, bringIntoView?: boolean) => {
    if (!activeGenomeId || !genomeBrowser) {
      return;
    }

    const { genomeId, objectId, type } = parseFocusObjectId(focusObjectId);

    genomeBrowserCommands.setFocus({
      genomeBrowser,
      focusId: objectId,
      focusType: type,
      genomeId,
      bringIntoView
    });
  };

  const changeFocusObject = (focusObjectId: string) => {
    setFocusObject(focusObjectId, true);
  };

  const changeBrowserLocation = (locationData: {
    genomeId: string;
    chrLocation: ChrLocation;
    focus?: {
      id: string;
      type: string;
    };
  }) => {
    if (!genomeBrowser) {
      return;
    }

    const { genomeId, chrLocation, focus } = locationData;

    const [regionName, start, end] = chrLocation;

    genomeBrowserCommands.setBrowserLocation({
      genomeBrowser,
      genomeId,
      regionName,
      start,
      end,
      focus
    });
  };

  const toggleTrack = (params: { trackId: string; isEnabled: boolean }) => {
    if (!genomeBrowser) {
      return;
    }
    const { trackId, isEnabled } = params;
    const trackPath = trackIdToPathMap[trackId] ?? ['track', trackId];

    genomeBrowserCommands.toggleTrack({
      genomeBrowser,
      trackPath,
      isEnabled
    });
  };

  // At the moment, most track settings are just a boolean flag. Will this continue to be the case? Who knows.
  const toggleTrackSetting = (params: {
    trackId: string;
    setting: string;
    isEnabled: boolean;
  }) => {
    if (!genomeBrowser) {
      return;
    }
    const { trackId, setting, isEnabled } = params;
    const trackPath = trackIdToPathMap[trackId] ?? ['track', trackId];

    genomeBrowserCommands.toggleTrackSetting({
      genomeBrowser,
      trackPath,
      setting,
      isEnabled
    });
  };

  const updateFocusGeneTranscripts = (
    visibleTranscriptIds: string[] | null
  ) => {
    if (!genomeBrowser) {
      return;
    }
    genomeBrowserCommands.setVisibleTranscripts({
      genomeBrowser,
      transcriptIds: visibleTranscriptIds
    });
  };

  return {
    activateGenomeBrowser,
    clearGenomeBrowser,
    setFocusObject,
    changeFocusObject,
    changeBrowserLocation,
    setZmenus,
    toggleTrack,
    toggleTrackSetting,
    updateFocusGeneTranscripts,
    genomeBrowser,
    genomeBrowserService,
    zmenus
  };
};

/**
 * There is, currently, a disconnect between what information genome browser needs
 * to toggle a track on or off (it needs a full "path" to the track, expressed in
 * the "trigger" field of track payload), and what the genome browser sends back
 * in its message about which tracks are being displayed (it only sends the last part
 * of the path, i.e. the last string of the "trigger" array).
 *
 * This hook creates a map between a track id and the trigger required for
 * messages to the genome browser. The map includes non-focus tracks
 * for the currently active genome, as well as for the previous active genome.
 * The reason for storing information about tracks of the previous active genome
 * is to be able to turn off previous genome's tracks that don't even exist
 * for the currently active genome (e.g. a variation track may exist for human,
 * but not for some bacterium).
 */
const useTrackIdToTrackPathMap = () => {
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId);

  const trackCategoriesRef = useRef<{
    previous: GenomeTrackCategory[];
    current: GenomeTrackCategory[];
  }>({ previous: [], current: [] });

  const { currentData: trackCategories = [] } = useGenomeTracksQuery(
    activeGenomeId ?? '',
    {
      skip: !activeGenomeId
    }
  );

  useEffect(() => {
    if (
      trackCategories.length &&
      trackCategories !== trackCategoriesRef.current.previous
    ) {
      trackCategoriesRef.current.previous = trackCategoriesRef.current.current;
      trackCategoriesRef.current.current = trackCategories;
    }
  }, [trackCategories]);

  const trackIdToPathMap = getTrackIdToTrackPathMap([
    ...trackCategoriesRef.current.previous,
    ...trackCategoriesRef.current.current
  ]);

  return trackIdToPathMap;
};

const getTrackIdToTrackPathMap = (trackCategories: GenomeTrackCategory[]) => {
  const tracks = trackCategories.flatMap(({ track_list }) => track_list);

  return tracks.reduce(
    (accumulator, track) => {
      accumulator[track.track_id] = track.trigger;
      return accumulator;
    },
    {} as Record<string, string[]>
  );
};

export default useGenomeBrowser;
