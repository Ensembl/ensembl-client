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
    toggleTrackLabel,
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
            selectedCog: trackId,
            isTrackNameShown
          })
        );
        toggleTrackName({ trackId, shouldShowTrackName: isTrackNameShown });
      });
    } else {
      dispatch(
        updateTrackConfigTrackName({
          genomeId: activeGenomeId,
          selectedCog,
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

  const updateTrackLabel = (isTrackLabelShown: boolean) => {
    if (!activeGenomeId) {
      return;
    }

    if (shouldApplyToAllRef.current) {
      Object.keys(browserCogList).forEach((trackId) => {
        dispatch(
          updateTrackConfigFeatureLabel({
            genomeId: activeGenomeId,
            selectedCog: trackId,
            isTrackLabelShown
          })
        );
        toggleTrackLabel({
          trackId,
          shouldShowFeatureLabel: isTrackLabelShown
        });
      });
    } else {
      dispatch(
        updateTrackConfigFeatureLabel({
          genomeId: activeGenomeId,
          selectedCog,
          isTrackLabelShown
        })
      );
      toggleTrackLabel({
        trackId: selectedCog,
        shouldShowFeatureLabel: isTrackLabelShown
      });
    }

    dispatch(saveTrackConfigsForGenome(activeGenomeId));

    analyticsTracking.trackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'feature_label_' + (isTrackLabelShown ? 'on' : 'off')
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
            selectedCog: trackId,
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
          selectedCog,
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

  const updateShowTranscriptIds = (isTranscriptIdsShown: boolean) => {
    if (!activeGenomeId) {
      return;
    }
    if (shouldApplyToAllRef.current) {
      Object.keys(browserCogList).forEach((trackId) => {
        dispatch(
          updateTrackConfigShowTranscriptIds({
            genomeId: activeGenomeId,
            selectedCog: trackId,
            isTranscriptIdsShown
          })
        );
        toggleTranscriptIds({
          trackId,
          shouldShowTranscriptIds: isTranscriptIdsShown
        });
      });
    } else {
      dispatch(
        updateTrackConfigShowTranscriptIds({
          genomeId: activeGenomeId,
          selectedCog,
          isTranscriptIdsShown
        })
      );
      toggleTranscriptIds({
        trackId: selectedCog,
        shouldShowTranscriptIds: isTranscriptIdsShown
      });
    }

    dispatch(saveTrackConfigsForGenome(activeGenomeId));

    analyticsTracking.trackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'several_transcripts_' + (isTranscriptIdsShown ? 'on' : 'off')
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

    dispatch(
      updateApplyToAll({
        genomeId: activeGenomeId,
        isSelected: value === 'all_tracks'
      })
    );

    shouldApplyToAllRef.current = value === 'all_tracks';

    updateTrackName(shouldShowTrackName);
    updateTrackLabel(shouldShowFeatureLabel);
    updateShowSeveralTranscripts(shouldShowSeveralTranscripts);

    analyticsTracking.trackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'apply_to_all - ' + (shouldApplyToAll ? 'unselected' : 'selected')
    });
  };

  return {
    updateTrackName,
    updateTrackLabel,
    updateShowSeveralTranscripts,
    updateShowTranscriptIds,
    toggleApplyToAll
  };
};

export default useBrowserTrackConfig;
