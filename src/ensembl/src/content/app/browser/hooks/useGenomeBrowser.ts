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
import { BROWSER_CONTAINER_ID } from 'src/content/app/browser/browser-constants';

import browserStorageService from 'src/content/app/browser/browser-storage-service';

import {
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObjectId
} from 'src/content/app/browser/browserSelectors';
import { updatePreviouslyViewedObjectsAndSave } from 'src/content/app/browser/track-panel/trackPanelActions';

import { GenomeBrowserContext } from 'src/content/app/browser/Browser';
import { TrackStates } from 'src/content/app/browser/track-panel/trackPanelConfig';
import { Status } from 'src/shared/types/status';
import { ChrLocation } from 'src/content/app/browser/browserState';
import { parseEnsObjectId } from 'src/shared/state/ens-object/ensObjectHelpers';
import { getChrLocationFromStr } from 'src/content/app/browser/browserHelper';

const useGenomeBrowser = () => {
  const dispatch = useDispatch();

  const activeGenomeId = useSelector(getBrowserActiveGenomeId);
  const activeEnsObjectId = useSelector(getBrowserActiveEnsObjectId);

  const genomeBrowserContext = useContext(GenomeBrowserContext);
  if (!genomeBrowserContext) {
    throw new Error(
      'useGenomeBrowser must be used with GenomeBrowserContext Provider'
    );
  }

  const { genomeBrowser, setGenomeBrowser, setZmenus, zmenus } =
    genomeBrowserContext;

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
          trackId === 'track:gene-feat' || trackId === 'track:gene-feat-1'
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

  const activateGenomeBrowser = async () => {
    const genomeBrowserService = new EnsemblGenomeBrowser();
    await genomeBrowserService.init({
      backend_url: config.genomeBrowserBackendBaseUrl,
      target_element_id: BROWSER_CONTAINER_ID
    });
    if (setGenomeBrowser) {
      setGenomeBrowser(genomeBrowserService);
    }
  };

  const changeFocusObject = (focusObjectId: string) => {
    if (!activeGenomeId || !genomeBrowser) {
      return;
    }

    const { genomeId, type, objectId } = parseEnsObjectId(focusObjectId);

    if (type === 'region') {
      changeBrowserLocation({
        genomeId: genomeId,
        ensObjectId: null,
        chrLocation: getChrLocationFromStr(objectId)
      });
      dispatch(updatePreviouslyViewedObjectsAndSave());
      return;
    }

    dispatch(updatePreviouslyViewedObjectsAndSave());
    const action: OutgoingAction = {
      type: OutgoingActionType.SET_FOCUS,
      payload: {
        focus: objectId,
        genomeId
      }
    };

    genomeBrowser.send(action);
  };

  const changeBrowserLocation = (locationData: {
    genomeId: string;
    ensObjectId: string | null;
    chrLocation: ChrLocation;
  }) => {
    const { genomeId, chrLocation, ensObjectId } = locationData;

    const [chromosome, startBp, endBp] = chrLocation;

    const action: OutgoingAction = {
      type: OutgoingActionType.SET_FOCUS_LOCATION,
      payload: {
        stick: `${genomeId}:${chromosome}`,
        startBp,
        endBp,
        focus: ensObjectId,
        genomeId
      }
    };

    genomeBrowser.send(action);
  };

  return {
    activateGenomeBrowser,
    restoreBrowserTrackStates,
    changeFocusObject,
    changeBrowserLocation,
    genomeBrowser,
    zmenus,
    setZmenus
  };
};

export default useGenomeBrowser;
