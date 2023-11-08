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
import snakeCase from 'lodash/snakeCase';

import analyticsTracking from 'src/services/analytics-service';

import { getSpeciesAnalyticsName } from 'src/content/app/species-selector/speciesSelectorHelper';
import { parseFocusObjectId } from 'src/shared/helpers/focusObjectHelpers';

import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEntityId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import type {
  Filters,
  SortingRule
} from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';
import type { RootState } from 'src/store';
import { SidebarTabName } from '../state/sidebar/entityViewerSidebarSlice';
import type { AnalyticsOptions } from 'src/analyticsHelper';
import { AppName } from 'src/global/globalConfig';

type TrackDownloadPayload = {
  category: string;
  geneSymbol: string;
  transcriptId: string;
  options: string[];
  downloadStatus: 'success' | 'failure';
};

const useEntityViewerAnalytics = () => {
  const activeGenomeId = useSelector(getEntityViewerActiveGenomeId) || '';
  const committedSpecies = useSelector((state: RootState) =>
    getCommittedSpeciesById(state, activeGenomeId)
  );
  const speciesNameForAnalytics = committedSpecies
    ? getSpeciesAnalyticsName(committedSpecies)
    : '';

  const activeEntityId = useSelector(getEntityViewerActiveEntityId);
  const featureType = activeEntityId
    ? parseFocusObjectId(activeEntityId).type
    : '';

  const sendTrackEvent = (ga: AnalyticsOptions) => {
    analyticsTracking.trackEvent({
      ...ga,
      species: speciesNameForAnalytics,
      feature: featureType,
      app: AppName.ENTITY_VIEWER
    });
  };

  const trackTabChange = (tabName: string) => {
    sendTrackEvent({
      category: 'entity_viewer',
      label: tabName,
      action: 'change_tab'
    });
  };

  const trackFiltersPanelOpen = () => {
    sendTrackEvent({
      category: 'gene_view_transcript_filters',
      action: 'opened'
    });
  };

  const trackAppliedFilters = (filters: Filters) => {
    const appliedFilters = Object.entries(filters)
      .filter(([, { selected }]) => selected)
      .map(([filterId]) => filterId)
      .join(','); // <-- comma-separated filter ids

    if (!appliedFilters) {
      return;
    }

    sendTrackEvent({
      category: 'gene_view_transcript_filters',
      action: 'filter_applied',
      label: appliedFilters
    });
  };

  const trackAppliedSorting = (sortingRule: SortingRule) => {
    sendTrackEvent({
      category: 'gene_view_transcript_filters',
      action: 'sort_applied',
      label: sortingRule
    });
  };

  const trackExternalLinkClick = (category: string, label: string) => {
    sendTrackEvent({
      category,
      label,
      action: 'external_link_click'
    });
  };

  const trackExternalLinkClickInProteinsList = (label: string) => {
    trackExternalLinkClick('gene_view_proteins_list', label);
  };

  const trackExternalLinkClickInTranscriptList = (label: string) => {
    trackExternalLinkClick('gene_view_transcript_list', label);
  };

  const trackPreviouslyViewedObjectClicked = (params: {
    linkLabel: string;
    position: number;
  }) => {
    sendTrackEvent({
      category: 'entity_viewer_sidebar_previously_viewed',
      action: 'link_clicked',
      label: params.linkLabel,
      value: params.position
    });
  };

  type TrackTranscriptListViewToggleParam = {
    transcriptQuality?: string;
    transcriptId: string;
    action: 'open_accordion' | 'close_accordion';
    transcriptPosition: number;
  };

  const trackExternalReferencesTabSelection = (tabName: string) => {
    sendTrackEvent({
      category: 'entity_viewer_sidebar',
      action: 'change_tab',
      label: tabName
    });
  };

  const trackExternalReferenceLinkClick = (params: {
    tabName: string;
    linkLabel: string;
  }) => {
    const sidebarCategoryMap = {
      [SidebarTabName.OVERVIEW as string]: 'overview',
      [SidebarTabName.EXTERNAL_REFERENCES as string]: 'external_references'
    };

    const { tabName, linkLabel } = params;
    const categoryName = `entity_viewer_sidebar_${sidebarCategoryMap[tabName]}`;

    sendTrackEvent({
      category: categoryName,
      action: 'external_reference_clicked',
      label: linkLabel
    });
  };

  const trackProteinInfoToggle = (
    params: TrackTranscriptListViewToggleParam
  ) => {
    const { transcriptId, transcriptQuality } = params;
    const label = transcriptQuality
      ? `${transcriptQuality} ${transcriptId}` // "MANE Plus Clinical ENST00000380152.8"
      : transcriptId;
    sendTrackEvent({
      category: 'gene_view_proteins_list',
      label,
      action: params.action,
      value: params.transcriptPosition + 1
    });
  };

  const trackTranscriptListViewToggle = (
    params: TrackTranscriptListViewToggleParam
  ) => {
    const transcriptLabel = [params.transcriptQuality, params.transcriptId]
      .filter(Boolean)
      .join(' ');

    sendTrackEvent({
      category: 'gene_view_transcript_list',
      label: transcriptLabel,
      action: params.action,
      value: params.transcriptPosition
    });
  };

  const trackTranscriptMoreInfoToggle = (
    qualityLabel: string | undefined,
    transcriptId: string
  ) => {
    const transcriptLabel = [qualityLabel, transcriptId]
      .filter(Boolean)
      .join(' ');

    sendTrackEvent({
      category: 'gene_view_transcript_list',
      label: transcriptLabel,
      action: 'more_information'
    });
  };

  const trackDownload = (params: TrackDownloadPayload) => {
    const selectedOptions = params.options
      .sort()
      .map((option) => snakeCase(option))
      .join(', ');
    const geneLabel = `Gene: ${params.geneSymbol}`;
    const transcriptLabel = `Transcript: ${params.transcriptId}`;
    const label = `${geneLabel}, ${transcriptLabel}, ${selectedOptions}`;
    const action =
      params.downloadStatus === 'success'
        ? 'sequence_download'
        : 'sequence_download_failure';

    sendTrackEvent({
      category: params.category,
      action,
      label
    });
  };

  const trackProteinDownload = (
    params: Omit<TrackDownloadPayload, 'category'>
  ) => {
    trackDownload({ ...params, category: 'gene_view_proteins_list' });
  };

  const trackGeneDownload = (
    params: Omit<TrackDownloadPayload, 'category' | 'transcriptId'>
  ) => {
    trackDownload({
      ...params,
      transcriptId: 'all',
      category: 'entity_viewer_sidebar'
    });
  };

  const trackInstantDownloadTranscriptList = (
    params: Omit<TrackDownloadPayload, 'category'>
  ) => {
    trackDownload({ ...params, category: 'gene_view_transcript_list' });
  };

  const trackSidebarModelOpen = (iconName: string) => {
    sendTrackEvent({
      category: 'entity_viewer_sidebar_toolstrip',
      action: 'modal_opened',
      label: iconName
    });
  };

  const trackSearchSubmission = (value: string) => {
    sendTrackEvent({
      category: 'entity_viewer_sidebar_search',
      action: 'submit_search',
      label: value
    });
  };

  const trackSpeciesChange = () => {
    sendTrackEvent({
      category: 'app_bar',
      action: 'change_link_clicked'
    });
  };

  return {
    trackTabChange,
    trackFiltersPanelOpen,
    trackAppliedFilters,
    trackAppliedSorting,
    trackProteinInfoToggle,
    trackTranscriptListViewToggle,
    trackTranscriptMoreInfoToggle,
    trackProteinDownload,
    trackGeneDownload,
    trackInstantDownloadTranscriptList,
    trackExternalLinkClickInProteinsList,
    trackExternalLinkClickInTranscriptList,
    trackExternalReferencesTabSelection,
    trackExternalReferenceLinkClick,
    trackExternalLinkClick,
    trackPreviouslyViewedObjectClicked,
    trackSidebarModelOpen,
    trackSearchSubmission,
    trackSpeciesChange
  };
};

export default useEntityViewerAnalytics;
