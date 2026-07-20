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
import { useContext, useRef, useEffect, useCallback } from 'react';

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

import type { ChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';

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

  const activateGenomeBrowser = useCallback(
    async (params: { container: HTMLElement }) => {
      const genomeBrowserService =
        await GenomeBrowserLoader.activateGenomeBrowser({
          backend_url: config.genomeBrowserBackendBaseUrl,
          target_element: params.container
        });
      const genomeBrowser = genomeBrowserService.getGenomeBrowser();

      setGenomeBrowser(() => genomeBrowser);
      setGenomeBrowserService(() => genomeBrowserService); // using the callback api of the state setter to avoid it calling genomeBrowserService thinking that it is a function
    },
    [setGenomeBrowser, setGenomeBrowserService]
  );

  // NOTE: the cleanup code in the method below refers only to ensembl-client's code that deals with the genome browser.
  // There is no cleanup method on the genome browser itself.
  // We trust it to terminate correctly when the DOM element that it is given control over is unmounted.
  const clearGenomeBrowser = useCallback(() => {
    genomeBrowserServiceRef.current?.reset();
    setGenomeBrowser(null);
    setGenomeBrowserService(null);
  }, [setGenomeBrowser, setGenomeBrowserService]);

  // the focusObjectId is in the format "genome_id:object_type:object_id"
  const setFocusObject = useCallback(
    (focusObjectId: string, bringIntoView?: boolean) => {
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
    },
    [activeGenomeId, genomeBrowser]
  );

  const changeFocusObject = useCallback(
    (focusObjectId: string) => {
      setFocusObject(focusObjectId, true);
    },
    [setFocusObject]
  );

  const changeBrowserLocation = useCallback(
    (locationData: {
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
    },
    [genomeBrowser]
  );

  const toggleTrack = useCallback(
    (params: { trackId: string; isEnabled: boolean }) => {
      if (!genomeBrowser) {
        return;
      }
      const { trackId, isEnabled } = params;
      const trackPath = getTrackPath(trackId);

      genomeBrowserCommands.toggleTrack({
        genomeBrowser,
        trackPath,
        isEnabled
      });
    },
    [genomeBrowser]
  );

  // At the moment, most track settings are just a boolean flag. Will this continue to be the case? Who knows.
  const toggleTrackSetting = useCallback(
    (params: { trackId: string; setting: string; isEnabled: boolean }) => {
      if (!genomeBrowser) {
        return;
      }
      const { trackId, setting, isEnabled } = params;
      const trackPath = getTrackPath(trackId);

      genomeBrowserCommands.toggleTrackSetting({
        genomeBrowser,
        trackPath,
        setting,
        isEnabled
      });
    },
    [genomeBrowser]
  );

  const updateFocusGeneTranscripts = useCallback(
    (visibleTranscriptIds: string[] | null) => {
      if (!genomeBrowser) {
        return;
      }
      genomeBrowserCommands.setVisibleTranscripts({
        genomeBrowser,
        transcriptIds: visibleTranscriptIds
      });
    },
    [genomeBrowser]
  );

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
 * To toggle a genome browser track or its settings, the client has to generate
 * a "track path" — an array of strings that genome browser will use to identify the track.
 *
 * There are currently two types of genome browser tracks:
 *   - Older tracks with human-readable ids (e.g. protein-coding genes on the forward strand)
 *   - Newer tracks identified by uuids. They are registered by the genome browser
 *     using a mechanism called 'expansion'.
 *
 * Ideally, the client shouldn't know any of this. Ideally, tracks would be identified
 * just by their ids. But, while this is not the case, the client will use a hack
 * as an easy option of generating a track path.
 *
 * The hack is: if track id is uuid-shaped, then it is an "expansion" track
 * that uses one path pattern; and in other cases, it is a "non-expansion" track,
 * which uses a different path pattern.
 */

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const getTrackPath = (trackId: string) => {
  if (uuidRegex.test(trackId)) {
    return ['track', 'expand', trackId];
  } else {
    return ['track', trackId];
  }
};

export default useGenomeBrowser;
