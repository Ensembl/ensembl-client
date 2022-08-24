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
import { Status } from 'src/shared/types/status';

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

  const trackTrackPanelSectionToggled = (sectionName: string) => {
    sendTrackEvent({
      category: 'track_panel',
      label: sectionName,
      action: 'section_toggled'
    });
  };

  const trackResetIcon = () => {
    sendTrackEvent({
      category: 'reset_icon',
      action: 'clicked'
    });
  };

  const trackSidebarModalViewToggle = (view: string) => {
    sendTrackEvent({
      category: 'sidebar_toolstrip',
      action: 'modal_opened',
      label: view
    });
  };

  const trackDrawerOpened = (drawerView: string) => {
    sendTrackEvent({
      category: 'track_drawer',
      action: 'opened',
      label: drawerView
    });
  };

  const trackDrawerSequenceViewed = (sequenceType: string) => {
    sendTrackEvent({
      category: 'track_drawer',
      action: 'sequence_viewed',
      label: sequenceType
    });
  };

  const trackDrawerSequenceCopied = (sequenceType: string) => {
    sendTrackEvent({
      category: 'track_drawer',
      action: 'sequence_copied',
      label: sequenceType
    });
  };

  const trackDrawerSequenceDownloaded = (selectedOptions: string) => {
    sendTrackEvent({
      category: 'track_drawer',
      action: 'sequence_downloaded',
      label: selectedOptions
    });
  };

  const trackSpeciesChangeLinkClicked = () => {
    sendTrackEvent({
      category: 'app_bar',
      action: 'change_link_clicked'
    });
  };

  const trackAppBarGenomeChanged = () => {
    sendTrackEvent({
      category: 'app_bar',
      action: 'change_genome'
    });
  };

  const trackTrackPanelToggled = (isOpened: boolean) => {
    sendTrackEvent({
      category: 'track_panel',
      action: isOpened ? 'opened' : 'closed'
    });
  };

  const trackTrackVisibilityToggled = (trackName: string, status: boolean) => {
    sendTrackEvent({
      category: 'regular_track_visibility',
      action: 'turned_' + status ? 'on' : 'off',
      label: trackName
    });
  };

  const trackFocusTrackVisibilityToggled = (action: Status) => {
    sendTrackEvent({
      category: 'focus_track_visibility',
      action: action === Status.SELECTED ? 'turned_on' : 'turned_off'
    });
  };

  const trackTranscriptTrackVisibilityToggled = (
    transcriptStableId: string,
    status: boolean
  ) => {
    sendTrackEvent({
      category: 'transcript_track_visibility',
      action: 'turned_' + status ? 'on' : 'off',
      label: `transcript-${transcriptStableId}`
    });
  };

  const trackInterstitialPageNavigation = () => {
    sendTrackEvent({
      category: 'interstitial_page',
      action: 'navigate_to_species_selector'
    });
  };

  return {
    trackRegionChange,
    trackRegionFieldChange,
    trackBookmarksDrawerOpened,
    trackBookmarksLinkClicked,
    trackFeatureLabelToggle,
    trackShowSeveralTranscriptsToggle,
    trackShowTranscriptsIdToggle,
    trackApplyToAllInTackSettings,
    trackTrackPanelTabChange,
    trackTrackPanelSectionToggled,
    trackTrackPanelToggled,
    trackTrackNameToggle,
    trackTrackVisibilityToggled,
    trackFocusTrackVisibilityToggled,
    trackTranscriptTrackVisibilityToggled,
    trackTrackSettingsOpened,
    trackResetIcon,
    trackSidebarModalViewToggle,
    trackDrawerSequenceViewed,
    trackDrawerSequenceCopied,
    trackDrawerSequenceDownloaded,
    trackDrawerOpened,
    trackSpeciesChangeLinkClicked,
    trackAppBarGenomeChanged,
    trackInterstitialPageNavigation
  };
};

export default useGenomeBrowserAnalytics;
