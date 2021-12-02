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
import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';
import EnsemblGenomeBrowser, {
  OutgoingAction,
  OutgoingActionType
} from 'ensembl-genome-browser';

import config from 'config';
import { isEnvironment, Environment } from 'src/shared/helpers/environment';

import browserStorageService from 'src/content/app/genome-browser/services/browser-storage-service';

import { BROWSER_CONTAINER_ID } from 'src/content/app/genome-browser/constants/browser-constants';

import {
  parseEnsObjectId,
  parseFocusIdFromUrl
} from 'src/shared/state/ens-object/ensObjectHelpers';

import {
  getApplyToAllConfig,
  getBrowserActiveEnsObjectId,
  getBrowserActiveGenomeId
} from 'src/content/app/genome-browser/state/browserSelectors';
import { updatePreviouslyViewedObjectsAndSave } from 'src/content/app/genome-browser/components/track-panel/state/trackPanelActions';
import { updateBrowserActiveEnsObjectIdsAndSave } from 'src/content/app/genome-browser/state/browserActions';

import { GenomeBrowserContext } from 'src/content/app/genome-browser/Browser';
import { TrackStates } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';
import { Status } from 'src/shared/types/status';
import { ChrLocation } from 'src/content/app/genome-browser/state/browserState';

const useGenomeBrowser = () => {
  const dispatch = useDispatch();

  const activeEnsObjectId = useSelector(getBrowserActiveEnsObjectId);
  const activeGenomeId = useSelector(getBrowserActiveGenomeId);
  const { allTrackLabelsOn, allTrackNamesOn } =
    useSelector(getApplyToAllConfig);

  const genomeBrowserContext = useContext(GenomeBrowserContext);
  if (!genomeBrowserContext) {
    throw new Error(
      'useGenomeBrowser must be used with GenomeBrowserContext Provider'
    );
  }

  const { genomeBrowser, setGenomeBrowser, setZmenus, zmenus } =
    genomeBrowserContext;

  const activateGenomeBrowser = async () => {
    const genomeBrowserService = new EnsemblGenomeBrowser();
    await genomeBrowserService.init({
      backend_url: config.genomeBrowserBackendBaseUrl,
      target_element_id: BROWSER_CONTAINER_ID,
      'debug.show-incoming-messages': isEnvironment([Environment.PRODUCTION])
        ? 'false'
        : 'true'
    });
    setGenomeBrowser(genomeBrowserService);
  };

  const changeFocusObject = (focusObjectId: string) => {
    if (!activeGenomeId || !genomeBrowser) {
      return;
    }

    const { genomeId, objectId } = parseEnsObjectId(focusObjectId);

    dispatch(updatePreviouslyViewedObjectsAndSave());
    dispatch(updateBrowserActiveEnsObjectIdsAndSave(focusObjectId));

    const action: OutgoingAction = {
      type: OutgoingActionType.SET_FOCUS,
      payload: {
        focus: objectId,
        genomeId
      }
    };

    genomeBrowser.send(action);
  };

  const changeFocusObjectFromZmenu = (featureId: string) => {
    if (!activeGenomeId) {
      return;
    }
    changeFocusObject(`${activeGenomeId}:${featureId}`);
  };

  const restoreBrowserTrackStates = () => {
    if (!activeGenomeId || !activeEnsObjectId || !genomeBrowser) {
      return;
    }

    const trackStatesFromStorage = browserStorageService.getTrackStates();
    const mergedTrackStates = {
      ...get(
        trackStatesFromStorage,
        `${activeGenomeId}.objectTracks.${activeEnsObjectId}`
      ),
      ...get(trackStatesFromStorage, `${activeGenomeId}.commonTracks`)
    } as TrackStates;

    const tracksToTurnOff: string[] = [];
    const tracksToTurnOn: string[] = [];

    Object.values(mergedTrackStates).forEach((trackStates) => {
      Object.keys(trackStates).forEach((trackId) => {
        const track_id =
          trackId === 'track:gene-feat' || trackId === 'track:transcript-feat-1'
            ? 'focus'
            : trackId.replace('track:', '');

        trackStates[trackId] === Status.SELECTED
          ? tracksToTurnOn.push(track_id)
          : tracksToTurnOff.push(track_id);
      });
    });

    if (tracksToTurnOn.length) {
      const turnOnAction: OutgoingAction = {
        type: OutgoingActionType.TURN_ON_TRACKS,
        payload: {
          track_ids: tracksToTurnOn
        }
      };
      genomeBrowser.send(turnOnAction);
    }

    if (tracksToTurnOff.length) {
      const turnOffAction: OutgoingAction = {
        type: OutgoingActionType.TURN_OFF_TRACKS,
        payload: {
          track_ids: tracksToTurnOff
        }
      };

      genomeBrowser.send(turnOffAction);
    }
  };

  const changeBrowserLocation = (locationData: {
    genomeId: string;
    focusId?: string;
    chrLocation: ChrLocation;
  }) => {
    if (!genomeBrowser) {
      return;
    }

    const { genomeId, chrLocation, focusId } = locationData;

    const { objectId = null } = focusId ? parseFocusIdFromUrl(focusId) : {};

    const [chromosome, startBp, endBp] = chrLocation;

    const action: OutgoingAction = {
      type: OutgoingActionType.SET_FOCUS_LOCATION,
      payload: {
        chromosome,
        startBp,
        endBp,
        focus: objectId,
        genomeId
      }
    };

    genomeBrowser.send(action);
  };

  const toggleTrack = (params: { trackId: string; status: Status }) => {
    const { trackId, status } = params;
    const isTurnedOn = status === Status.SELECTED;

    const trackIdWithoutPrefix = trackId.replace('track:', '');
    const trackIdToSend =
      trackIdWithoutPrefix === 'gene-feat' ? 'focus' : trackIdWithoutPrefix;

    const action: OutgoingAction = {
      type: isTurnedOn
        ? OutgoingActionType.TURN_ON_TRACKS
        : OutgoingActionType.TURN_OFF_TRACKS,
      payload: {
        track_ids: [trackIdToSend]
      }
    };
    genomeBrowser?.send(action);

    if (allTrackLabelsOn && isTurnedOn) {
      genomeBrowser?.send({
        type: allTrackLabelsOn
          ? OutgoingActionType.TURN_ON_LABELS
          : OutgoingActionType.TURN_OFF_LABELS,
        payload: {
          track_ids: [trackIdToSend]
        }
      });
    }

    if (allTrackNamesOn && isTurnedOn) {
      genomeBrowser?.send({
        type: allTrackNamesOn
          ? OutgoingActionType.TURN_ON_NAMES
          : OutgoingActionType.TURN_OFF_NAMES,
        payload: {
          track_ids: [trackIdToSend]
        }
      });
    }
  };

  return {
    activateGenomeBrowser,
    changeFocusObject,
    changeFocusObjectFromZmenu,
    changeBrowserLocation,
    restoreBrowserTrackStates,
    setZmenus,
    toggleTrack,
    genomeBrowser,
    zmenus
  };
};

export default useGenomeBrowser;
