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

import { useSelector } from 'react-redux';

import analyticsTracking from 'src/services/analytics-service';

import { getSpeciesAnalyticsName } from 'src/content/app/species-selector/speciesSelectorHelper';
import { parseFocusObjectId } from 'src/shared/helpers/focusObjectHelpers';

import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import { RootState } from 'src/store';
import { AnalyticsOptions } from 'src/analyticsHelper';
import { AppName } from 'src/global/globalConfig';
import useGenomeBrowserIds from './useGenomeBrowserIds';
import { TrackSet } from '../components/track-panel/trackPanelConfig';

const useGenomeBrowserAnalytics = () => {
  const { activeFocusObjectId, activeGenomeId } = useGenomeBrowserIds();

  const committedSpecies = useSelector((state: RootState) =>
    getCommittedSpeciesById(state, activeGenomeId)
  );
  const speciesNameForAnalytics = committedSpecies
    ? getSpeciesAnalyticsName(committedSpecies)
    : '';

  const featureType = activeFocusObjectId
    ? parseFocusObjectId(activeFocusObjectId).type
    : '';

  const sendTrackEvent = (ga: AnalyticsOptions) => {
    analyticsTracking.trackEvent({
      ...ga,
      species: speciesNameForAnalytics,
      feature: featureType,
      app: AppName.GENOME_BROWSER
    });
  };

  const trackTrackSettingsOpened = (trackId: string) => {
    sendTrackEvent({
      category: 'track_settings',
      label: trackId,
      action: 'opened'
    });
  };

  const trackRegionChange = () => {
    sendTrackEvent({
      category: 'browser_navigation',
      label: 'region_editor',
      action: 'change_region'
    });
  };

  const trackRegionFieldChange = () => {
    sendTrackEvent({
      category: 'browser_navigation',
      label: 'region_field',
      action: 'change_region'
    });
  };

  const trackBookmarksDrawerOpened = (totalBookmarks: number) => {
    sendTrackEvent({
      category: 'drawer_open',
      label: 'recent_bookmarks',
      action: 'clicked',
      value: totalBookmarks
    });
  };

  const trackBookmarksLinkClicked = (
    objectType: string,
    linkPositionFromTop: number
  ) => {
    sendTrackEvent({
      category: 'recent_bookmark_link',
      label: objectType,
      action: 'clicked',
      value: linkPositionFromTop
    });
  };

  const trackTrackNameToggle = (
    selectedCog: string,
    isTrackNameShown: boolean
  ) => {
    sendTrackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'track_name_' + (isTrackNameShown ? 'on' : 'off')
    });
  };

  const trackFeatureLabelToggle = (
    selectedCog: string,
    areFeatureLabelsShown: boolean
  ) => {
    sendTrackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'feature_labels_' + (areFeatureLabelsShown ? 'on' : 'off')
    });
  };

  const trackShowSeveralTranscriptsToggle = (
    selectedCog: string,
    isSeveralTranscriptsShown: boolean
  ) => {
    sendTrackEvent({
      category: 'track_settings',
      label: selectedCog,
      action:
        'several_transcripts_' + (isSeveralTranscriptsShown ? 'on' : 'off')
    });
  };

  const trackShowTranscriptsIdToggle = (
    selectedCog: string,
    shouldShowTranscriptIds: boolean
  ) => {
    sendTrackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'transcript_labels_' + (shouldShowTranscriptIds ? 'on' : 'off')
    });
  };

  const trackApplyToAllInTackSettings = (
    selectedCog: string,
    shouldApplyToAll: boolean
  ) => {
    sendTrackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'apply_to_all - ' + (shouldApplyToAll ? 'unselected' : 'selected')
    });
  };

  const trackTrackPanelTabChange = (selectedTrackPanelTab: TrackSet) => {
    sendTrackEvent({
      category: 'track_panel_tab',
      label: selectedTrackPanelTab,
      action: 'selected'
    });
  };

  return {
    trackTrackSettingsOpened,
    trackRegionChange,
    trackRegionFieldChange,
    trackBookmarksDrawerOpened,
    trackBookmarksLinkClicked,
    trackTrackNameToggle,
    trackFeatureLabelToggle,
    trackShowSeveralTranscriptsToggle,
    trackShowTranscriptsIdToggle,
    trackApplyToAllInTackSettings,
    trackTrackPanelTabChange
  };
};

export default useGenomeBrowserAnalytics;
