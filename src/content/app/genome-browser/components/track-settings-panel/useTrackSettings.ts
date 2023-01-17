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

import { useAppSelector, useAppDispatch } from 'src/store';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { getTrackSettingsForTrackId } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSelectors';
import { getDisplayedTracks } from 'src/content/app/genome-browser/state/displayed-tracks/displayedTracksSelectors';

import {
  updateTrackName as updateTrackSettingsTrackName,
  updateFeatureLabelsVisibility as updateTrackSettingsFeatureLabelsVisibility,
  updateShowSeveralTranscripts as updateTrackSettingsShowSeveralTranscripts,
  updateShowTranscriptIds as updateTrackSettingsShowTranscriptIds,
  saveTrackSettingsForGenome
} from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';

import useGenomeBrowserAnalytics from 'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics';
import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

type Params = {
  selectedTrackId: string;
};

const useBrowserTrackSettings = (params: Params) => {
  const { selectedTrackId } = params;
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId);
  const displayedTracks = useAppSelector(getDisplayedTracks);
  const selectedTrackSettings = useAppSelector((state) =>
    getTrackSettingsForTrackId(state, selectedTrackId)
  );
  const dispatch = useAppDispatch();

  const {
    trackTrackNameToggle,
    trackFeatureLabelToggle,
    trackShowSeveralTranscriptsToggle,
    trackShowTranscriptsIdToggle
  } = useGenomeBrowserAnalytics();

  const {
    toggleTrackName,
    toggleFeatureLabels,
    toggleSeveralTranscripts,
    toggleTranscriptIds
  } = useGenomeBrowser();

  const updateTrackName = (isTrackNameShown: boolean) => {
    if (!activeGenomeId || !selectedTrackSettings) {
      return;
    }

    displayedTracks.forEach((track) => {
      dispatch(
        updateTrackSettingsTrackName({
          genomeId: activeGenomeId,
          trackId: track.id,
          isTrackNameShown
        })
      );
      toggleTrackName({
        trackId: track.id,
        shouldShowTrackName: isTrackNameShown
      });
    });

    dispatch(saveTrackSettingsForGenome(activeGenomeId));

    trackTrackNameToggle(selectedTrackId, isTrackNameShown);
  };

  const updateFeatureLabelsVisibility = (areFeatureLabelsShown: boolean) => {
    if (!activeGenomeId) {
      return;
    }

    displayedTracks.forEach((track) => {
      dispatch(
        updateTrackSettingsFeatureLabelsVisibility({
          genomeId: activeGenomeId,
          trackId: track.id,
          areFeatureLabelsShown
        })
      );
      toggleFeatureLabels({
        trackId: track.id,
        shouldShowFeatureLabels: areFeatureLabelsShown
      });
    });

    dispatch(saveTrackSettingsForGenome(activeGenomeId));

    trackFeatureLabelToggle(selectedTrackId, areFeatureLabelsShown);
  };

  const updateShowSeveralTranscripts = (
    areSeveralTranscriptsShown: boolean
  ) => {
    if (!activeGenomeId || !selectedTrackSettings) {
      return;
    }

    displayedTracks.forEach((track) => {
      dispatch(
        updateTrackSettingsShowSeveralTranscripts({
          genomeId: activeGenomeId,
          trackId: track.id,
          areSeveralTranscriptsShown
        })
      );
      toggleSeveralTranscripts({
        trackId: track.id,
        shouldShowSeveralTranscripts: areSeveralTranscriptsShown
      });
    });

    dispatch(saveTrackSettingsForGenome(activeGenomeId));

    trackShowSeveralTranscriptsToggle(
      selectedTrackId,
      areSeveralTranscriptsShown
    );
  };

  const updateShowTranscriptIds = (shouldShowTranscriptIds: boolean) => {
    if (!activeGenomeId || !selectedTrackSettings) {
      return;
    }

    displayedTracks.forEach((track) => {
      dispatch(
        updateTrackSettingsShowTranscriptIds({
          genomeId: activeGenomeId,
          trackId: track.id,
          shouldShowTranscriptIds
        })
      );
      toggleTranscriptIds({
        trackId: track.id,
        shouldShowTranscriptIds
      });
    });

    dispatch(saveTrackSettingsForGenome(activeGenomeId));

    trackShowTranscriptsIdToggle(selectedTrackId, shouldShowTranscriptIds);
  };

  return {
    updateTrackName,
    updateFeatureLabelsVisibility,
    updateShowSeveralTranscripts,
    updateShowTranscriptIds
  };
};

export default useBrowserTrackSettings;
