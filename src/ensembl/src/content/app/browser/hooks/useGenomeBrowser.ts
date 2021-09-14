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
import { parseEnsObjectId } from 'ensemblRoot/src/shared/state/ens-object/ensObjectHelpers';
import { getChrLocationFromStr } from 'ensemblRoot/src/content/app/browser/browserHelper';

const useGenomeBrowser = () => {
  const dispatch = useDispatch();

  const activeGenomeId = useSelector(getBrowserActiveGenomeId);
  const activeEnsObjectId = useSelector(getBrowserActiveEnsObjectId);

  const { genomeBrowser, setGenomeBrowser, setZmenus, zmenus } =
    useContext(GenomeBrowserContext);

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
        trackStates[trackId] === Status.SELECTED
          ? tracksToTurnOn.push(trackId.replace('track:', ''))
          : tracksToTurnOff.push(trackId.replace('track:', ''));
      });
    });

    const turnOffAction: OutgoingAction = {
      type: OutgoingActionType.TURN_OFF_TRACKS,
      payload: {
        track_ids: tracksToTurnOff
      }
    };

    const turnOnAction: OutgoingAction = {
      type: OutgoingActionType.TURN_ON_TRACKS,
      payload: {
        track_ids: tracksToTurnOn
      }
    };
    genomeBrowser.send(turnOffAction);
    genomeBrowser.send(turnOnAction);
  };

  const activateGenomeBrowser = async () => {
    const genomeBrowserService = new EnsemblGenomeBrowser();
    await genomeBrowserService.init();
    if (setGenomeBrowser) {
      genomeBrowserService.send({
        type: OutgoingActionType.ACTIVATE_BROWSER
      });
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
    const { genomeId, ensObjectId, chrLocation } = locationData;

    const [chromosome, startBp, endBp] = chrLocation;

    const currentActiveEnsObjectId = ensObjectId || activeEnsObjectId;
    parseEnsObjectId;
    if (!genomeBrowser) {
      return;
    }

    const focusInstruction: { focus?: string } = {};
    if (currentActiveEnsObjectId) {
      focusInstruction.focus = currentActiveEnsObjectId;
    }

    const action: OutgoingAction = {
      type: OutgoingActionType.SET_FOCUS_LOCATION,
      payload: {
        stick: `${genomeId}:${chromosome}`,
        startBp,
        endBp
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