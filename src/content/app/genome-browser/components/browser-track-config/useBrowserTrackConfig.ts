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

import { useSelector, useDispatch } from 'react-redux';
import analyticsTracking from 'src/services/analytics-service';
import { OptionValue } from 'src/shared/components/radio-group/RadioGroup';
import { RootState } from 'src/store';
import useGenomeBrowser from '../../hooks/useGenomeBrowser';
import {
  getBrowserActiveGenomeId,
  getBrowserActiveFocusObjectId
} from '../../state/browser-general/browserGeneralSelectors';
import {
  getTrackConfigForTrackId,
  getApplyToAllConfig,
  getBrowserCogList,
  getBrowserSelectedCog
} from '../../state/track-config/trackConfigSelectors';
import {
  updateTrackConfigNames,
  updateTrackConfigLabel,
  updateApplyToAll,
  TrackType
} from '../../state/track-config/trackConfigSlice';

const useBrowserTrackConfig = () => {
  const applyToAllConfig = useSelector(getApplyToAllConfig);
  const browserCogList = useSelector(getBrowserCogList);
  const selectedCog = useSelector(getBrowserSelectedCog) || '';
  const activeGenomeId = useSelector(getBrowserActiveGenomeId);
  const activeObjectId = useSelector(getBrowserActiveFocusObjectId);
  const shouldApplyToAll = applyToAllConfig.isSelected;
  const selectedTrackConfigInfo = useSelector((state: RootState) =>
    getTrackConfigForTrackId(state, selectedCog)
  );

  const dispatch = useDispatch();
  // type TracksToUpdate = {
  //   names: {
  //     on: string[];
  //     off: string[];
  //   },
  //   labels: {
  //     on: string[];
  //     off: string[];
  //   }
  // }
  // tracksInfo && Object.keys(tracksInfo).forEach((trackId) => {
  //   const tracksToUpdate: TracksToUpdate = {
  //     names: {
  //       on: [],
  //       off: []
  //     },
  //     labels: {
  //       on: [],
  //       off: []
  //     }
  //   };
  //   if(tracksInfo[trackId].trackType === TrackType.GENE) {
  //     tracksInfo[trackId].showTrackName ? tracksToUpdate.names.on.push(trackId) : tracksToUpdate.names.off.push(trackId);
  //     tracksInfo[trackId].showTrackLabel ? tracksToUpdate.labels.on.push(trackId) : tracksToUpdate.labels.off.push(trackId);
  //   }
  //   else {
  //     tracksInfo[trackId].showTrackName ? tracksToUpdate.names.on.push(trackId) : tracksToUpdate.names.off.push(trackId);
  //   }

  // })

  const { toggleTrackName, toggleTrackLabel } = useGenomeBrowser();

  const updateTrackName = (isTrackNameShown: boolean) => {
    if (!activeGenomeId || !activeObjectId) {
      return;
    }

    if (shouldApplyToAll) {
      Object.keys(browserCogList).forEach((trackId) => {
        dispatch(
          updateTrackConfigNames({
            genomeId: activeGenomeId,
            objectId: activeObjectId,
            selectedCog: trackId,
            isTrackNameShown
          })
        );
        toggleTrackName({ trackId, shouldShowTrackName: isTrackNameShown });
      });
    } else {
      dispatch(
        updateTrackConfigNames({
          genomeId: activeGenomeId,
          objectId: activeObjectId,
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
    if (!activeGenomeId || !activeObjectId) {
      return;
    }

    if (shouldApplyToAll) {
      Object.keys(browserCogList).forEach((trackId) => {
        dispatch(
          updateTrackConfigLabel({
            genomeId: activeGenomeId,
            objectId: activeObjectId,
            selectedCog: trackId,
            isTrackLabelShown
          })
        );
        toggleTrackLabel({ trackId, shouldShowTrackLabel: isTrackLabelShown });
      });
    } else {
      dispatch(
        updateTrackConfigLabel({
          genomeId: activeGenomeId,
          objectId: activeObjectId,
          selectedCog,
          isTrackLabelShown
        })
      );
      toggleTrackLabel({
        trackId: selectedCog,
        shouldShowTrackLabel: isTrackLabelShown
      });
    }

    analyticsTracking.trackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'feature_label_' + (isTrackLabelShown ? 'on' : 'off')
    });
  };

  const handleRadioChange = (value: OptionValue) => {
    if (!activeGenomeId || !activeObjectId || !selectedTrackConfigInfo) {
      return;
    }

    const shouldShowTrackName = selectedTrackConfigInfo.showTrackName;
    const shouldShowTrackLabel =
      selectedTrackConfigInfo.trackType === TrackType.GENE
        ? selectedTrackConfigInfo.showFeatureLabel
        : null;

    dispatch(
      updateApplyToAll({
        genomeId: activeGenomeId,
        objectId: activeObjectId,
        isSelected: value === 'all_tracks'
      })
    );

    updateTrackName(shouldShowTrackName);
    shouldShowTrackLabel && updateTrackLabel(shouldShowTrackLabel);

    analyticsTracking.trackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'apply_to_all - ' + (shouldApplyToAll ? 'unselected' : 'selected')
    });
  };

  return {
    updateTrackName,
    updateTrackLabel,
    handleRadioChange
  };
};

export default useBrowserTrackConfig;
