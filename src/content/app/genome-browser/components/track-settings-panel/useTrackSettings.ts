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

import { useEffect, useRef } from 'react';

import { useAppSelector, useAppDispatch } from 'src/store';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import {
  getTrackSettingsForTrackId,
  getApplyToAllSettings
} from 'src/content/app/genome-browser/state/track-settings/trackSettingsSelectors';
import { getDisplayedTracks } from 'src/content/app/genome-browser/state/displayed-tracks/displayedTracksSelectors';

import {
  updateTrackName as updateTrackSettingsTrackName,
  updateFeatureLabelsVisibility as updateTrackSettingsFeatureLabelsVisibility,
  updateShowSeveralTranscripts as updateTrackSettingsShowSeveralTranscripts,
  updateShowTranscriptIds as updateTrackSettingsShowTranscriptIds,
  updateApplyToAll,
  saveTrackSettingsForGenome
} from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';
import { isGeneTrack as checkGeneTrack } from 'src/content/app/genome-browser/state/track-settings/trackSettingsConstants';

import useGenomeBrowserAnalytics from 'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics';
import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

import type { OptionValue } from 'src/shared/components/radio-group/RadioGroup';

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
  const shouldApplyToAll = useAppSelector(getApplyToAllSettings);
  const shouldApplyToAllRef = useRef(shouldApplyToAll);
  const dispatch = useAppDispatch();

  const {
    trackTrackNameToggle,
    trackFeatureLabelToggle,
    trackShowSeveralTranscriptsToggle,
    trackShowTranscriptsIdToggle,
    trackApplyToAllInTrackSettings
  } = useGenomeBrowserAnalytics();

  useEffect(() => {
    shouldApplyToAllRef.current = shouldApplyToAll;
  }, [shouldApplyToAll]);

  const {
    toggleTrackName,
    toggleFeatureLabels,
    toggleSeveralTranscripts,
    toggleTranscriptIds
  } = useGenomeBrowser();

  const updateTrackName = (isTrackNameShown: boolean) => {
    if (!activeGenomeId) {
      return;
    }

    if (shouldApplyToAllRef.current) {
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
    } else {
      dispatch(
        updateTrackSettingsTrackName({
          genomeId: activeGenomeId,
          trackId: selectedTrackId,
          isTrackNameShown
        })
      );
      toggleTrackName({
        trackId: selectedTrackId,
        shouldShowTrackName: isTrackNameShown
      });
    }

    dispatch(saveTrackSettingsForGenome(activeGenomeId));

    trackTrackNameToggle(selectedTrackId, isTrackNameShown);
  };

  const updateFeatureLabelsVisibility = (areFeatureLabelsShown: boolean) => {
    if (!activeGenomeId) {
      return;
    }

    if (shouldApplyToAllRef.current) {
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
    } else {
      dispatch(
        updateTrackSettingsFeatureLabelsVisibility({
          genomeId: activeGenomeId,
          trackId: selectedTrackId,
          areFeatureLabelsShown
        })
      );
      toggleFeatureLabels({
        trackId: selectedTrackId,
        shouldShowFeatureLabels: areFeatureLabelsShown
      });
    }

    dispatch(saveTrackSettingsForGenome(activeGenomeId));

    trackFeatureLabelToggle(selectedTrackId, areFeatureLabelsShown);
  };

  const updateShowSeveralTranscripts = (
    areSeveralTranscriptsShown: boolean
  ) => {
    if (!activeGenomeId) {
      return;
    }
    if (shouldApplyToAllRef.current) {
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
    } else {
      dispatch(
        updateTrackSettingsShowSeveralTranscripts({
          genomeId: activeGenomeId,
          trackId: selectedTrackId,
          areSeveralTranscriptsShown
        })
      );
      toggleSeveralTranscripts({
        trackId: selectedTrackId,
        shouldShowSeveralTranscripts: areSeveralTranscriptsShown
      });
    }

    dispatch(saveTrackSettingsForGenome(activeGenomeId));

    trackShowSeveralTranscriptsToggle(
      selectedTrackId,
      areSeveralTranscriptsShown
    );
  };

  const updateShowTranscriptIds = (shouldShowTranscriptIds: boolean) => {
    if (!activeGenomeId) {
      return;
    }
    if (shouldApplyToAllRef.current) {
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
    } else {
      dispatch(
        updateTrackSettingsShowTranscriptIds({
          genomeId: activeGenomeId,
          trackId: selectedTrackId,
          shouldShowTranscriptIds
        })
      );
      toggleTranscriptIds({
        trackId: selectedTrackId,
        shouldShowTranscriptIds
      });
    }

    dispatch(saveTrackSettingsForGenome(activeGenomeId));

    trackShowTranscriptsIdToggle(selectedTrackId, shouldShowTranscriptIds);
  };

  const toggleApplyToAll = (value: OptionValue) => {
    if (!activeGenomeId || !selectedTrackSettings) {
      return;
    }

    const shouldShowTrackName = selectedTrackSettings.settings.showTrackName;
    const isGeneTrack = checkGeneTrack(selectedTrackSettings);

    const shouldShowFeatureLabels = isGeneTrack
      ? selectedTrackSettings.settings.showFeatureLabels
      : false;

    const shouldShowSeveralTranscripts = isGeneTrack
      ? selectedTrackSettings.settings.showSeveralTranscripts
      : false;

    const shouldShowTranscriptIds = isGeneTrack
      ? selectedTrackSettings.settings.showTranscriptIds
      : false;

    dispatch(
      updateApplyToAll({
        genomeId: activeGenomeId,
        isSelected: value === 'all_tracks'
      })
    );

    shouldApplyToAllRef.current = value === 'all_tracks';

    updateTrackName(shouldShowTrackName);
    updateFeatureLabelsVisibility(shouldShowFeatureLabels);
    updateShowSeveralTranscripts(shouldShowSeveralTranscripts);
    updateShowTranscriptIds(shouldShowTranscriptIds);

    trackApplyToAllInTrackSettings(selectedTrackId, shouldApplyToAll); // FIXME: why are we passing track id in this function?
  };

  return {
    updateTrackName,
    updateFeatureLabelsVisibility,
    updateShowSeveralTranscripts,
    updateShowTranscriptIds,
    toggleApplyToAll
  };
};

export default useBrowserTrackSettings;
