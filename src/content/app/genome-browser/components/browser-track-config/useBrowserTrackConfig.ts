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
import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import {
  getTrackConfigsForTrackId,
  getApplyToAllConfig,
  getBrowserCogList,
  getBrowserSelectedCog
} from 'src/content/app/genome-browser/state/track-config/trackConfigSelectors';
import {
  updateTrackName as updateTrackConfigTrackName,
  updateFeatureLabel as updateTrackConfigFeatureLabel,
  updateShowSeveralTranscripts as updateTrackConfigShowSeveralTranscripts,
  updateShowTranscriptIds as updateTrackConfigShowTranscriptIds,
  updateApplyToAll,
  saveTrackConfigsForGenome,
  TrackType
} from 'src/content/app/genome-browser/state/track-config/trackConfigSlice';

import analyticsTracking from 'src/services/analytics-service';

import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

import { type OptionValue } from 'src/shared/components/radio-group/RadioGroup';

const useBrowserTrackConfig = () => {
  const browserCogList = useAppSelector(getBrowserCogList);
  const selectedCog = useAppSelector(getBrowserSelectedCog) || '';
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId);
  const selectedTrackConfigs = useAppSelector((state: RootState) =>
    getTrackConfigsForTrackId(state, selectedCog)
  );
  const shouldApplyToAll = useAppSelector(getApplyToAllConfig);
  const shouldApplyToAllRef = useRef(shouldApplyToAll);
  const dispatch = useAppDispatch();

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
      Object.keys(browserCogList).forEach((trackId) => {
        dispatch(
          updateTrackConfigTrackName({
            genomeId: activeGenomeId,
            trackId,
            isTrackNameShown
          })
        );
        toggleTrackName({ trackId, shouldShowTrackName: isTrackNameShown });
      });
    } else {
      dispatch(
        updateTrackConfigTrackName({
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

    dispatch(saveTrackConfigsForGenome(activeGenomeId));

    analyticsTracking.trackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'track_name_' + (isTrackNameShown ? 'on' : 'off')
    });
  };

  const updateFeatureLabel = (isFeatureLabelShown: boolean) => {
    if (!activeGenomeId) {
      return;
    }

    if (shouldApplyToAllRef.current) {
      Object.keys(browserCogList).forEach((trackId) => {
        dispatch(
          updateTrackConfigFeatureLabel({
            genomeId: activeGenomeId,
            trackId,
            isFeatureLabelShown
          })
        );
        toggleFeatureLabels({
          trackId,
          shouldShowFeatureLabel: isFeatureLabelShown
        });
      });
    } else {
      dispatch(
        updateTrackConfigFeatureLabel({
          genomeId: activeGenomeId,
          trackId: selectedCog,
          isFeatureLabelShown
        })
      );
      toggleFeatureLabels({
        trackId: selectedCog,
        shouldShowFeatureLabel: isFeatureLabelShown
      });
    }

    dispatch(saveTrackConfigsForGenome(activeGenomeId));

    analyticsTracking.trackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'feature_label_' + (isFeatureLabelShown ? 'on' : 'off')
    });
  };

  const updateShowSeveralTranscripts = (isSeveralTranscriptsShown: boolean) => {
    if (!activeGenomeId) {
      return;
    }
    if (shouldApplyToAllRef.current) {
      Object.keys(browserCogList).forEach((trackId) => {
        dispatch(
          updateTrackConfigShowSeveralTranscripts({
            genomeId: activeGenomeId,
            trackId,
            isSeveralTranscriptsShown
          })
        );
        toggleSeveralTranscripts({
          trackId,
          shouldShowSeveralTranscripts: isSeveralTranscriptsShown
        });
      });
    } else {
      dispatch(
        updateTrackConfigShowSeveralTranscripts({
          genomeId: activeGenomeId,
          trackId: selectedCog,
          isSeveralTranscriptsShown
        })
      );
      toggleSeveralTranscripts({
        trackId: selectedCog,
        shouldShowSeveralTranscripts: isSeveralTranscriptsShown
      });
    }

    dispatch(saveTrackConfigsForGenome(activeGenomeId));

    analyticsTracking.trackEvent({
      category: 'track_settings',
      label: selectedCog,
      action:
        'several_transcripts_' + (isSeveralTranscriptsShown ? 'on' : 'off')
    });
  };

  const updateShowTranscriptIds = (shouldShowTranscriptIds: boolean) => {
    if (!activeGenomeId) {
      return;
    }
    if (shouldApplyToAllRef.current) {
      Object.keys(browserCogList).forEach((trackId) => {
        dispatch(
          updateTrackConfigShowTranscriptIds({
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
        updateTrackConfigShowTranscriptIds({
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

    dispatch(saveTrackConfigsForGenome(activeGenomeId));

    analyticsTracking.trackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'transcript_labels_' + (shouldShowTranscriptIds ? 'on' : 'off')
    });
  };

  const toggleApplyToAll = (value: OptionValue) => {
    if (!activeGenomeId || !selectedTrackConfigs) {
      return;
    }

    const shouldShowTrackName = selectedTrackConfigs.showTrackName;
    const shouldShowFeatureLabel =
      selectedTrackConfigs.trackType === TrackType.GENE
        ? selectedTrackConfigs.showFeatureLabel
        : false;

    const shouldShowSeveralTranscripts =
      selectedTrackConfigs.trackType === TrackType.GENE
        ? selectedTrackConfigs.showSeveralTranscripts
        : false;

    const shouldShowTranscriptIds =
      selectedTrackConfigs.trackType === TrackType.GENE
        ? selectedTrackConfigs.showTranscriptIds
        : false;

    dispatch(
      updateApplyToAll({
        genomeId: activeGenomeId,
        isSelected: value === 'all_tracks'
      })
    );

    shouldApplyToAllRef.current = value === 'all_tracks';

    updateTrackName(shouldShowTrackName);
    updateFeatureLabel(shouldShowFeatureLabel);
    updateShowSeveralTranscripts(shouldShowSeveralTranscripts);
    updateShowTranscriptIds(shouldShowTranscriptIds);

    analyticsTracking.trackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'apply_to_all - ' + (shouldApplyToAll ? 'unselected' : 'selected')
    });
  };

  return {
    updateTrackName,
    updateFeatureLabel,
    updateShowSeveralTranscripts,
    updateShowTranscriptIds,
    toggleApplyToAll
  };
};

export default useBrowserTrackConfig;
