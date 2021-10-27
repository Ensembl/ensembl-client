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
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import snakeCase from 'lodash/snakeCase';

import analyticsTracking from 'src/services/analytics-service';

import { getSpeciesAnalyticsName } from 'src/content/app/species-selector/speciesSelectorHelper';
import { parseEnsObjectId } from 'src/shared/state/ens-object/ensObjectHelpers';

import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEntityId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import {
  Filters,
  SortingRule
} from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';
import { RootState } from 'src/store';

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
    ? parseEnsObjectId(activeEntityId).type
    : '';

  useEffect(() => {
    analyticsTracking.setSpeciesDimension(speciesNameForAnalytics);
    analyticsTracking.setFeatureDimension(featureType);
  }, []);

  const trackTabChange = (tabName: string) => {
    analyticsTracking.trackEvent({
      category: 'entity_viewer',
      label: tabName,
      action: 'change_tab'
    });
  };

  const trackFiltersPanelOpen = () => {
    analyticsTracking.trackEvent({
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

    analyticsTracking.trackEvent({
      category: 'gene_view_transcript_filters',
      action: 'filter_applied',
      label: appliedFilters
    });
  };

  const trackAppliedSorting = (sortingRule: SortingRule) => {
    analyticsTracking.trackEvent({
      category: 'gene_view_transcript_filters',
      action: 'sort_applied',
      label: sortingRule
    });
  };

  const trackExternalLinkClick = (category: string, label: string) => {
    analyticsTracking.trackEvent({
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

  const trackProteinInfoToggle = (params: {
    transcriptQuality: string | null;
    transcriptId: string;
    action: 'open_accordion' | 'close_accordion';
    transcriptPosition: number;
  }) => {
    const { transcriptId, transcriptQuality } = params;
    const label = transcriptQuality
      ? `${transcriptQuality} ${transcriptId}` // "MANE Plus Clinical ENST00000380152.8"
      : transcriptId;
    analyticsTracking.trackEvent({
      category: 'gene_view_proteins_list',
      label,
      action: params.action,
      value: params.transcriptPosition + 1
    });
  };

  const trackTranscriptListViewToggle = (
    qualityLabel: string | undefined,
    transcriptId: string,
    toggleAction: string,
    position: number
  ) => {
    const transcriptLabel = [qualityLabel, transcriptId]
      .filter(Boolean)
      .join(' ');

    analyticsTracking.trackEvent({
      category: 'gene_view_transcript_list',
      label: transcriptLabel,
      action: toggleAction, //open_accordion or close_accordion
      value: position
    });
  };

  const trackTranscriptMoreInfoToggle = (
    qualityLabel: string | undefined,
    transcriptId: string
  ) => {
    const transcriptLabel = [qualityLabel, transcriptId]
      .filter(Boolean)
      .join(' ');

    analyticsTracking.trackEvent({
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

    analyticsTracking.trackEvent({
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

  const trackInstantDownloadTranscriptList = (
    params: Omit<TrackDownloadPayload, 'category'>
  ) => {
    trackDownload({ ...params, category: 'gene_view_transcript_list' });
  };

  return {
    trackTabChange,
    trackFiltersPanelOpen,
    trackAppliedFilters,
    trackAppliedSorting,
    trackProteinInfoToggle,
    trackProteinDownload,
    trackExternalLinkClickInProteinsList,
    trackExternalLinkClickInTranscriptList,
    trackTranscriptListViewToggle,
    trackTranscriptMoreInfoToggle,
    trackExternalLinkClick,
    trackInstantDownloadTranscriptList
  };
};
export default useEntityViewerAnalytics;
