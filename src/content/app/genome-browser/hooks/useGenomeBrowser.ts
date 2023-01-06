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
import EnsemblGenomeBrowser, {
  type OutgoingAction,
  OutgoingActionType
} from '@ensembl/ensembl-genome-browser';

import config from 'config';
import { isEnvironment, Environment } from 'src/shared/helpers/environment';

import { BROWSER_CONTAINER_ID } from 'src/content/app/genome-browser/constants/browserConstants';

import { parseFocusObjectId } from 'src/shared/helpers/focusObjectHelpers';

import { GenomeBrowserContext } from 'src/content/app/genome-browser/contexts/GenomeBrowserContext';

import { useAppSelector } from 'src/store';
import { getAllTrackSettings } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSelectors';
import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import type { ChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import type { TrackSettings } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';

const useGenomeBrowser = () => {
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId);
  const trackSettingsForGenome = useAppSelector(getAllTrackSettings);
  const genomeBrowserContext = useContext(GenomeBrowserContext);

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

  // the focusObjectId is in the format "genome_id:gene:gene_stable_id"
  const setFocusGene = (focusObjectId: string) => {
    if (!activeGenomeId || !genomeBrowser) {
      return;
    }

    const { genomeId, objectId, type } = parseFocusObjectId(focusObjectId);

    const action: OutgoingAction = {
      type: OutgoingActionType.SET_FOCUS,
      payload: {
        focusId: objectId,
        focusType: type,
        genomeId
      }
    };

    genomeBrowser.send(action);
  };

  const changeFocusObject = (focusObjectId: string) => {
    const { genomeId, type, objectId } = parseFocusObjectId(focusObjectId);

    const action: OutgoingAction = {
      type: OutgoingActionType.SET_FOCUS,
      payload: {
        focusId: objectId,
        focusType: type,
        genomeId,
        bringIntoView: true
      }
    };

    genomeBrowser?.send(action);
  };

  const changeBrowserLocation = (locationData: {
    genomeId: string;
    focus?: {
      id: string;
      type: string;
    };
    chrLocation: ChrLocation;
  }) => {
    if (!genomeBrowser) {
      return;
    }

    const { genomeId, chrLocation, focus = null } = locationData;

    const [chromosome, startBp, endBp] = chrLocation;

    const action: OutgoingAction = {
      type: OutgoingActionType.SET_FOCUS_LOCATION,
      payload: {
        chromosome,
        startBp,
        endBp,
        focus,
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

    genomeBrowser?.send({
      type: shouldShowTrackName
        ? OutgoingActionType.TURN_ON_NAMES
        : OutgoingActionType.TURN_OFF_NAMES,
      payload: {
        track_ids: [trackId]
      }
    });
  };

  const toggleFeatureLabels = (params: {
    trackId: string;
    shouldShowFeatureLabels: boolean;
  }) => {
    const { trackId, shouldShowFeatureLabels } = params;

    genomeBrowser?.send({
      type: shouldShowFeatureLabels
        ? OutgoingActionType.TURN_ON_LABELS
        : OutgoingActionType.TURN_OFF_LABELS,
      payload: {
        track_ids: [trackId]
      }
    });
  };

  const toggleSeveralTranscripts = (params: {
    trackId: string;
    shouldShowSeveralTranscripts: boolean;
  }) => {
    const { trackId, shouldShowSeveralTranscripts } = params;

    genomeBrowser?.send({
      type: shouldShowSeveralTranscripts
        ? OutgoingActionType.TURN_ON_SEVERAL_TRANSCRIPTS
        : OutgoingActionType.TURN_OFF_SEVERAL_TRANSCRIPTS,
      payload: {
        track_ids: [trackId]
      }
    });
  };

  const toggleTranscriptIds = (params: {
    trackId: string;
    shouldShowTranscriptIds: boolean;
  }) => {
    const { trackId, shouldShowTranscriptIds } = params;

    genomeBrowser?.send({
      type: shouldShowTranscriptIds
        ? OutgoingActionType.TURN_ON_TRANSCRIPT_LABELS
        : OutgoingActionType.TURN_OFF_TRANSCRIPT_LABELS,
      payload: {
        track_ids: [trackId]
      }
    });
  };

  const toggleTrack = (params: { trackId: string; isTurnedOn: boolean }) => {
    const { trackId, isTurnedOn } = params;
    const trackSettings =
      trackSettingsForGenome?.settingsForIndividualTracks[trackId]?.settings ??
      ({} as Partial<TrackSettings['settings']>);

    genomeBrowser?.send({
      type: isTurnedOn
        ? OutgoingActionType.TURN_ON_TRACKS
        : OutgoingActionType.TURN_OFF_TRACKS,
      payload: {
        track_ids: [trackId]
      }
    });

    if ('showFeatureLabels' in trackSettings && isTurnedOn) {
      genomeBrowser?.send({
        type: trackSettings.showFeatureLabels
          ? OutgoingActionType.TURN_ON_LABELS
          : OutgoingActionType.TURN_OFF_LABELS,
        payload: {
          track_ids: [trackId]
        }
      });
    }

    if ('showTrackName' in trackSettings && isTurnedOn) {
      genomeBrowser?.send({
        type: trackSettings.showTrackName
          ? OutgoingActionType.TURN_ON_NAMES
          : OutgoingActionType.TURN_OFF_NAMES,
        payload: {
          track_ids: [trackId]
        }
      });
    }
  };

  const updateFocusGeneTranscripts = (
    visibleTranscriptIds: string[] | null
  ) => {
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
    setFocusGene,
    changeFocusObject,
    changeBrowserLocation,
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
