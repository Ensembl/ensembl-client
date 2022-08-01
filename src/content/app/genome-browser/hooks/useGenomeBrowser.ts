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
import get from 'lodash/get';
import EnsemblGenomeBrowser, {
  OutgoingAction,
  OutgoingActionType
} from '@ensembl/ensembl-genome-browser';
import cloneDeep from 'lodash/cloneDeep';

import config from 'config';
import { isEnvironment, Environment } from 'src/shared/helpers/environment';

import browserStorageService from 'src/content/app/genome-browser/services/browserStorageService';

import { BROWSER_CONTAINER_ID } from 'src/content/app/genome-browser/constants/browserConstants';

import { parseFocusObjectId } from 'src/shared/helpers/focusObjectHelpers';

import { GenomeBrowserContext } from 'src/content/app/genome-browser/Browser';

import { useAppSelector } from 'src/store';
import { getAllTrackSettings } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSelectors';
import {
  getBrowserActiveFocusObjectId,
  getBrowserActiveGenomeId
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import type { ChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import {
  TrackId,
  TrackStates
} from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';
import { TrackType } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';
import { Status } from 'src/shared/types/status';

const useGenomeBrowser = () => {
  const activeFocusObjectId = useAppSelector(getBrowserActiveFocusObjectId);
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId);
  const trackSettingsForGenome = useAppSelector(getAllTrackSettings);
  const genomeBrowserContext = useContext(GenomeBrowserContext);
  const trackSettings = trackSettingsForGenome?.tracks;
  const GENE_TRACK_ID = TrackId.GENE;

  if (!genomeBrowserContext) {
    throw new Error(
      'useGenomeBrowser must be used with GenomeBrowserContext Provider'
    );
  }

  const { genomeBrowser, setGenomeBrowser, setZmenus, zmenus } =
    genomeBrowserContext;

  const activateGenomeBrowser = async () => {
    const genomeBrowser = new EnsemblGenomeBrowser();
    await genomeBrowser.init({
      backend_url: config.genomeBrowserBackendBaseUrl,
      target_element_id: BROWSER_CONTAINER_ID,
      'debug.show-incoming-messages': isEnvironment([Environment.PRODUCTION])
        ? 'false'
        : 'true'
    });
    setGenomeBrowser(genomeBrowser);
  };

  const clearGenomeBrowser = () => {
    // TODO: run genome browser cleanup logic when it becomes available
    setGenomeBrowser(null);
  };

  const changeFocusObject = (focusObjectId: string) => {
    if (!activeGenomeId || !genomeBrowser) {
      return;
    }

    const { genomeId, objectId } = parseFocusObjectId(focusObjectId);

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
    if (!activeGenomeId || !activeFocusObjectId || !genomeBrowser) {
      return;
    }

    const trackStatesFromStorage = browserStorageService.getTrackStates();
    const mergedTrackStates = {
      ...get(
        trackStatesFromStorage,
        `${activeGenomeId}.objectTracks.${activeFocusObjectId}`
      ),
      ...get(trackStatesFromStorage, `${activeGenomeId}.commonTracks`)
    } as TrackStates;

    const tracksToTurnOff: string[] = [];
    const tracksToTurnOn: string[] = [];

    Object.values(mergedTrackStates).forEach((trackStates) => {
      Object.keys(trackStates).forEach((trackId) => {
        const trackIdWithoutPrefix = trackId.replace('track:', '');
        const trackIdToSend =
          trackIdWithoutPrefix === GENE_TRACK_ID
            ? 'focus'
            : trackIdWithoutPrefix;

        trackStates[trackId] === Status.SELECTED
          ? tracksToTurnOn.push(trackIdToSend)
          : tracksToTurnOff.push(trackIdToSend);
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

  const restoreTrackSettingsStates = () => {
    if (!activeGenomeId || !genomeBrowser) {
      return;
    }

    const emptyOnOffLists = {
      on: [] as string[],
      off: [] as string[]
    };

    const trackStateForSeveralTranscripts = cloneDeep(emptyOnOffLists);
    const trackStateForTranscriptIds = cloneDeep(emptyOnOffLists);
    const trackStateForNames = cloneDeep(emptyOnOffLists);
    const trackStateForLabels = cloneDeep(emptyOnOffLists);

    trackSettings &&
      Object.keys(trackSettings).forEach((trackId) => {
        const config = trackSettings[trackId];

        config.showTrackName
          ? trackStateForNames.on.push(trackId)
          : trackStateForNames.off.push(trackId);

        if (config.trackType === TrackType.GENE) {
          config.showFeatureLabels
            ? trackStateForLabels.on.push(trackId)
            : trackStateForLabels.off.push(trackId);

          config.showSeveralTranscripts
            ? trackStateForSeveralTranscripts.on.push(trackId)
            : trackStateForSeveralTranscripts.off.push(trackId);

          config.showTranscriptIds
            ? trackStateForTranscriptIds.on.push(trackId)
            : trackStateForTranscriptIds.off.push(trackId);
        }
      });

    genomeBrowser.send({
      type: OutgoingActionType.TURN_ON_NAMES,
      payload: {
        track_ids: trackStateForNames.on
      }
    });

    genomeBrowser.send({
      type: OutgoingActionType.TURN_OFF_NAMES,
      payload: {
        track_ids: trackStateForNames.off
      }
    });

    genomeBrowser.send({
      type: OutgoingActionType.TURN_ON_LABELS,
      payload: {
        track_ids: trackStateForLabels.on
      }
    });

    genomeBrowser.send({
      type: OutgoingActionType.TURN_OFF_LABELS,
      payload: {
        track_ids: trackStateForLabels.off
      }
    });

    genomeBrowser.send({
      type: OutgoingActionType.TURN_ON_SEVERAL_TRANSCRIPTS,
      payload: {
        track_ids: trackStateForSeveralTranscripts.on
      }
    });

    genomeBrowser.send({
      type: OutgoingActionType.TURN_OFF_SEVERAL_TRANSCRIPTS,
      payload: {
        track_ids: trackStateForSeveralTranscripts.off
      }
    });

    genomeBrowser.send({
      type: OutgoingActionType.TURN_ON_TRANSCRIPT_LABELS,
      payload: {
        track_ids: trackStateForTranscriptIds.on
      }
    });

    genomeBrowser.send({
      type: OutgoingActionType.TURN_OFF_TRANSCRIPT_LABELS,
      payload: {
        track_ids: trackStateForTranscriptIds.off
      }
    });
  };

  const changeBrowserLocation = (locationData: {
    genomeId: string;
    focusId?: string;
    chrLocation: ChrLocation;
  }) => {
    if (!genomeBrowser) {
      return;
    }

    const { genomeId, chrLocation, focusId = null } = locationData;

    const [chromosome, startBp, endBp] = chrLocation;

    const action: OutgoingAction = {
      type: OutgoingActionType.SET_FOCUS_LOCATION,
      payload: {
        chromosome,
        startBp,
        endBp,
        focus: focusId,
        genomeId
      }
    };

    genomeBrowser.send(action);
  };

  const toggleTrackName = (params: {
    trackId: string;
    shouldShowTrackName: boolean;
  }) => {
    const { trackId, shouldShowTrackName } = params;

    const trackIdWithoutPrefix = trackId.replace('track:', '');
    const trackIdToSend =
      trackIdWithoutPrefix === GENE_TRACK_ID ? 'focus' : trackIdWithoutPrefix;

    genomeBrowser?.send({
      type: shouldShowTrackName
        ? OutgoingActionType.TURN_ON_NAMES
        : OutgoingActionType.TURN_OFF_NAMES,
      payload: {
        track_ids: [trackIdToSend]
      }
    });
  };

  const toggleFeatureLabels = (params: {
    trackId: string;
    shouldShowFeatureLabels: boolean;
  }) => {
    const { trackId, shouldShowFeatureLabels } = params;

    const trackIdWithoutPrefix = trackId.replace('track:', '');
    const trackIdToSend =
      trackIdWithoutPrefix === GENE_TRACK_ID ? 'focus' : trackIdWithoutPrefix;

    genomeBrowser?.send({
      type: shouldShowFeatureLabels
        ? OutgoingActionType.TURN_ON_LABELS
        : OutgoingActionType.TURN_OFF_LABELS,
      payload: {
        track_ids: [trackIdToSend]
      }
    });
  };

  const toggleSeveralTranscripts = (params: {
    trackId: string;
    shouldShowSeveralTranscripts: boolean;
  }) => {
    const { trackId, shouldShowSeveralTranscripts } = params;
    const trackIdWithoutPrefix = trackId.replace('track:', '');
    const trackIdToSend =
      trackIdWithoutPrefix === GENE_TRACK_ID ? 'focus' : trackIdWithoutPrefix;

    genomeBrowser?.send({
      type: shouldShowSeveralTranscripts
        ? OutgoingActionType.TURN_ON_SEVERAL_TRANSCRIPTS
        : OutgoingActionType.TURN_OFF_SEVERAL_TRANSCRIPTS,
      payload: {
        track_ids: [trackIdToSend]
      }
    });
  };

  const toggleTranscriptIds = (params: {
    trackId: string;
    shouldShowTranscriptIds: boolean;
  }) => {
    const { trackId, shouldShowTranscriptIds } = params;
    const trackIdWithoutPrefix = trackId.replace('track:', '');
    const trackIdToSend =
      trackIdWithoutPrefix === GENE_TRACK_ID ? 'focus' : trackIdWithoutPrefix;

    genomeBrowser?.send({
      type: shouldShowTranscriptIds
        ? OutgoingActionType.TURN_ON_TRANSCRIPT_LABELS
        : OutgoingActionType.TURN_OFF_TRANSCRIPT_LABELS,
      payload: {
        track_ids: [trackIdToSend]
      }
    });
  };

  const toggleTrack = (params: { trackId: string; status: Status }) => {
    const { trackId, status } = params;
    const isTurnedOn = status === Status.SELECTED;

    const trackIdWithoutPrefix = trackId.replace('track:', '');
    const trackIdToSend =
      trackIdWithoutPrefix === GENE_TRACK_ID ? 'focus' : trackIdWithoutPrefix;

    genomeBrowser?.send({
      type: isTurnedOn
        ? OutgoingActionType.TURN_ON_TRACKS
        : OutgoingActionType.TURN_OFF_TRACKS,
      payload: {
        track_ids: [trackIdToSend]
      }
    });

    const trackInfo = trackSettings && trackSettings[trackId];

    if (trackInfo && 'showFeatureLabels' in trackInfo && isTurnedOn) {
      genomeBrowser?.send({
        type: trackInfo?.showFeatureLabels
          ? OutgoingActionType.TURN_ON_LABELS
          : OutgoingActionType.TURN_OFF_LABELS,
        payload: {
          track_ids: [trackIdToSend]
        }
      });
    }

    const allTrackNamesOn =
      trackSettings && trackSettings[trackId]?.showTrackName;
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

  const updateFocusGeneTranscripts = (visibleTranscriptIds: string[]) => {
    genomeBrowser?.send({
      type: OutgoingActionType.SET_VISIBLE_TRANSCRIPTS,
      payload: {
        track_id: 'focus',
        transcript_ids: visibleTranscriptIds
      }
    });
  };

  return {
    activateGenomeBrowser,
    clearGenomeBrowser,
    changeFocusObject,
    changeFocusObjectFromZmenu,
    changeBrowserLocation,
    restoreBrowserTrackStates,
    restoreTrackSettingsStates,
    setZmenus,
    toggleTrack,
    updateFocusGeneTranscripts,
    toggleTrackName,
    toggleFeatureLabels,
    toggleSeveralTranscripts,
    toggleTranscriptIds,
    genomeBrowser,
    zmenus
  };
};

export default useGenomeBrowser;
