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

import GenomeBrowser, {
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

const useGenomeBrowser = () => {
  const dispatch = useDispatch();

  const activeGenomeId = useSelector(getBrowserActiveGenomeId);
  const activeEnsObjectId = useSelector(getBrowserActiveEnsObjectId);

  const { genomeBrowser, setGenomeBrowser } = useContext(GenomeBrowserContext);

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
    const genomeBrowserService = new GenomeBrowser();
    await genomeBrowserService.init();
    if (setGenomeBrowser) {
      genomeBrowserService.send({
        type: OutgoingActionType.ACTIVATE_BROWSER
      });
      setGenomeBrowser(genomeBrowserService);
    }
  };

  const changeFocusObject = (objectId: string) => {
    if (!activeGenomeId || !genomeBrowser) {
      return;
    }

    dispatch(updatePreviouslyViewedObjectsAndSave());
    const action: OutgoingAction = {
      type: OutgoingActionType.SET_FOCUS,
      payload: {
        focus: objectId
      }
    };

    genomeBrowser.send(action);
  };

  const changeBrowserLocation = (locationData: {
    genomeId: string;
    ensObjectId: string | null;
    chrLocation: ChrLocation;
  }) => {
    const [, startBp, endBp] = locationData.chrLocation;

    const currentActiveEnsObjectId =
      locationData.ensObjectId || activeEnsObjectId;

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
        // stick: `${locationData.genomeId}:${chrCode}`,
        // goto: `${startBp}-${endBp}`,
        startBp,
        endBp
        // ...focusInstruction
      }
    };

    genomeBrowser.send(action);
  };

  return {
    activateGenomeBrowser,
    restoreBrowserTrackStates,
    changeFocusObject,
    changeBrowserLocation,
    genomeBrowser
  };
};

export default useGenomeBrowser;
