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

import { useAppSelector, useAppDispatch, type RootState } from 'src/store';

import useBrowserCogList from '../browser-cog/useBrowserCogList';
import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import {
  getTrackSettingsForTrackId,
  getApplyToAllSettings,
  getBrowserSelectedCog
} from 'src/content/app/genome-browser/state/track-settings/trackSettingsSelectors';
import {
  updateTrackName as updateTrackSettingsTrackName,
  updateFeatureLabelsVisibility as updateTrackSettingsFeatureLabelsVisibility,
  updateShowSeveralTranscripts as updateTrackSettingsShowSeveralTranscripts,
  updateShowTranscriptIds as updateTrackSettingsShowTranscriptIds,
  updateApplyToAll,
  saveTrackSettingsForGenome,
  TrackType
} from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';

import useGenomeBrowserAnalytics from 'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics';
import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

import { type OptionValue } from 'src/shared/components/radio-group/RadioGroup';

const useBrowserTrackSettings = () => {
  const { cogList } = useBrowserCogList();
  const selectedCog = useAppSelector(getBrowserSelectedCog) || '';
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId);
  const selectedTrackSettings = useAppSelector((state: RootState) =>
    getTrackSettingsForTrackId(state, selectedCog)
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

    if (shouldApplyToAllRef.current && cogList) {
      Object.keys(cogList).forEach((trackId) => {
        dispatch(
          updateTrackSettingsTrackName({
            genomeId: activeGenomeId,
            trackId,
            isTrackNameShown
          })
        );
        toggleTrackName({ trackId, shouldShowTrackName: isTrackNameShown });
      });
    } else {
      dispatch(
        updateTrackSettingsTrackName({
          genomeId: activeGenomeId,
          trackId: selectedCog,
          isTrackNameShown
        })
      );
      toggleTrackName({
        trackId: selectedCog,
        shouldShowTrackName: isTrackNameShown
      });
    }

    dispatch(saveTrackSettingsForGenome(activeGenomeId));

    trackTrackNameToggle(selectedCog, isTrackNameShown);
  };

  const updateFeatureLabelsVisibility = (areFeatureLabelsShown: boolean) => {
    if (!activeGenomeId) {
      return;
    }

    if (shouldApplyToAllRef.current && cogList) {
      Object.keys(cogList).forEach((trackId) => {
        dispatch(
          updateTrackSettingsFeatureLabelsVisibility({
            genomeId: activeGenomeId,
            trackId,
            areFeatureLabelsShown
          })
        );
        toggleFeatureLabels({
          trackId,
          shouldShowFeatureLabels: areFeatureLabelsShown
        });
      });
    } else {
      dispatch(
        updateTrackSettingsFeatureLabelsVisibility({
          genomeId: activeGenomeId,
          trackId: selectedCog,
          areFeatureLabelsShown
        })
      );
      toggleFeatureLabels({
        trackId: selectedCog,
        shouldShowFeatureLabels: areFeatureLabelsShown
      });
    }

    dispatch(saveTrackSettingsForGenome(activeGenomeId));

    trackFeatureLabelToggle(selectedCog, areFeatureLabelsShown);
  };

  const updateShowSeveralTranscripts = (
    areSeveralTranscriptsShown: boolean
  ) => {
    if (!activeGenomeId) {
      return;
    }
    if (shouldApplyToAllRef.current && cogList) {
      Object.keys(cogList).forEach((trackId) => {
        dispatch(
          updateTrackSettingsShowSeveralTranscripts({
            genomeId: activeGenomeId,
            trackId,
            areSeveralTranscriptsShown
          })
        );
        toggleSeveralTranscripts({
          trackId,
          shouldShowSeveralTranscripts: areSeveralTranscriptsShown
        });
      });
    } else {
      dispatch(
        updateTrackSettingsShowSeveralTranscripts({
          genomeId: activeGenomeId,
          trackId: selectedCog,
          areSeveralTranscriptsShown
        })
      );
      toggleSeveralTranscripts({
        trackId: selectedCog,
        shouldShowSeveralTranscripts: areSeveralTranscriptsShown
      });
    }

    dispatch(saveTrackSettingsForGenome(activeGenomeId));

    trackShowSeveralTranscriptsToggle(selectedCog, areSeveralTranscriptsShown);
  };

  const updateShowTranscriptIds = (shouldShowTranscriptIds: boolean) => {
    if (!activeGenomeId) {
      return;
    }
    if (shouldApplyToAllRef.current && cogList) {
      Object.keys(cogList).forEach((trackId) => {
        dispatch(
          updateTrackSettingsShowTranscriptIds({
            genomeId: activeGenomeId,
            trackId,
            shouldShowTranscriptIds
          })
        );
        toggleTranscriptIds({
          trackId,
          shouldShowTranscriptIds
        });
      });
    } else {
      dispatch(
        updateTrackSettingsShowTranscriptIds({
          genomeId: activeGenomeId,
          trackId: selectedCog,
          shouldShowTranscriptIds
        })
      );
      toggleTranscriptIds({
        trackId: selectedCog,
        shouldShowTranscriptIds
      });
    }

    dispatch(saveTrackSettingsForGenome(activeGenomeId));

    trackShowTranscriptsIdToggle(selectedCog, shouldShowTranscriptIds);
  };

  const toggleApplyToAll = (value: OptionValue) => {
    if (!activeGenomeId || !selectedTrackSettings) {
      return;
    }

    const shouldShowTrackName = selectedTrackSettings.showTrackName;
    const shouldShowFeatureLabels =
      selectedTrackSettings.trackType === TrackType.GENE
        ? selectedTrackSettings.showFeatureLabels
        : false;

    const shouldShowSeveralTranscripts =
      selectedTrackSettings.trackType === TrackType.GENE
        ? selectedTrackSettings.showSeveralTranscripts
        : false;

    const shouldShowTranscriptIds =
      selectedTrackSettings.trackType === TrackType.GENE
        ? selectedTrackSettings.showTranscriptIds
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

    trackApplyToAllInTrackSettings(selectedCog, shouldApplyToAll);
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
