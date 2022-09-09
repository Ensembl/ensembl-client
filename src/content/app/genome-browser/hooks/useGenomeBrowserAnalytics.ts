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

import useGenomeBrowserIds from './useGenomeBrowserIds';

import { getSpeciesAnalyticsName } from 'src/content/app/species-selector/speciesSelectorHelper';
import { parseFocusObjectId } from 'src/shared/helpers/focusObjectHelpers';

import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import { AppName } from 'src/global/globalConfig';
import { Status } from 'src/shared/types/status';

import type { AnalyticsOptions } from 'src/analyticsHelper';
import type { TrackSet } from '../components/track-panel/trackPanelConfig';
import type { RootState } from 'src/store';

const useGenomeBrowserAnalytics = () => {
  const { activeFocusObjectId, activeGenomeId } = useGenomeBrowserIds();

  const committedSpecies = useSelector((state: RootState) =>
    getCommittedSpeciesById(state, activeGenomeId)
  );
  const speciesNameForAnalytics = committedSpecies
    ? getSpeciesAnalyticsName(committedSpecies)
    : '';

  const { type = '', objectId = '' } = activeFocusObjectId
    ? parseFocusObjectId(activeFocusObjectId)
    : {};

  const feature = activeFocusObjectId ? `${type} - ${objectId}` : '';

  const sendTrackEvent = (options: AnalyticsOptions) => {
    analyticsTracking.trackEvent({
      species: speciesNameForAnalytics,
      feature,
      app: AppName.GENOME_BROWSER,
      ...options
    });
  };

  const reportTrackSettingsOpened = (trackId: string) => {
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
      category: 'bookmarks_drawer',
      label: 'recent_bookmarks',
      action: 'opened',
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
    areSeveralTranscriptsShown: boolean
  ) => {
    sendTrackEvent({
      category: 'track_settings',
      label: selectedCog,
      action:
        'several_transcripts_' + (areSeveralTranscriptsShown ? 'on' : 'off')
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

  const trackFocusObjectReset = () => {
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

  const trackGenomeChanged = () => {
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

  const trackTranscriptInTrackVisibilityToggled = (
    transcriptStableId: string,
    status: boolean
  ) => {
    sendTrackEvent({
      category: 'transcript_in_track_visibility',
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
    trackTranscriptInTrackVisibilityToggled,
    reportTrackSettingsOpened,
    trackFocusObjectReset,
    trackSidebarModalViewToggle,
    trackDrawerSequenceViewed,
    trackDrawerSequenceCopied,
    trackDrawerSequenceDownloaded,
    trackDrawerOpened,
    trackSpeciesChangeLinkClicked,
    trackGenomeChanged,
    trackInterstitialPageNavigation
  };
};

export default useGenomeBrowserAnalytics;
