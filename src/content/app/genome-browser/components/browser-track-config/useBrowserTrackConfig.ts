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
import { RootState } from 'src/store';
import { useSelector, useDispatch } from 'react-redux';

import { OptionValue } from 'src/shared/components/radio-group/RadioGroup';

import { getBrowserActiveGenomeId } from '../../state/browser-general/browserGeneralSelectors';
import {
  getTrackConfigForTrackId,
  getApplyToAllConfig,
  getBrowserCogList,
  getBrowserSelectedCog
} from '../../state/track-config/trackConfigSelectors';
import {
  updateTrackName as updateTrackConfigTrackName,
  updateFeatureLabel as updateTrackConfigFeatureLabel,
  updateShowSeveralTranscripts as updateTrackConfigShowSeveralTranscripts,
  updateShowTranscriptIds as updateTrackConfigShowTranscriptIds,
  updateApplyToAll,
  TrackType
} from '../../state/track-config/trackConfigSlice';

import analyticsTracking from 'src/services/analytics-service';
import useGenomeBrowser from '../../hooks/useGenomeBrowser';

const useBrowserTrackConfig = () => {
  const applyToAllConfig = useSelector(getApplyToAllConfig);
  const browserCogList = useSelector(getBrowserCogList);
  const selectedCog = useSelector(getBrowserSelectedCog) || '';
  const activeGenomeId = useSelector(getBrowserActiveGenomeId);
  const shouldApplyToAll = applyToAllConfig.isSelected;
  const shouldApplyToAllRef = useRef(shouldApplyToAll);

  const selectedTrackConfigInfo = useSelector((state: RootState) =>
    getTrackConfigForTrackId(state, selectedCog)
  );

  useEffect(() => {
    shouldApplyToAllRef.current = shouldApplyToAll;
  }, [shouldApplyToAll]);

  const dispatch = useDispatch();

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

    analyticsTracking.trackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'several_transcripts_' + (isTranscriptIdsShown ? 'on' : 'off')
    });
  };

  const handleRadioChange = (value: OptionValue) => {
    if (!activeGenomeId || !selectedTrackConfigInfo) {
      return;
    }
    const shouldShowTrackName = selectedTrackConfigInfo.showTrackName;
    const shouldShowFeatureLabel =
      selectedTrackConfigInfo.trackType === TrackType.GENE
        ? selectedTrackConfigInfo.showFeatureLabel
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
    handleRadioChange
  };
};

export default useBrowserTrackConfig;
