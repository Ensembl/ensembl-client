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

import { useCallback } from 'react';

import { useAppSelector, useAppDispatch } from 'src/store';

import { getEpigenomeSelectionCriteria } from 'src/content/app/regulatory-activity-viewer/state/epigenome-selection/epigenomeSelectionSelectors';

import {
  useEpigenomeMetadataDimensionsQuery,
  useBaseEpigenomesQuery
} from 'src/content/app/regulatory-activity-viewer/state/api/activityViewerApiSlice';
import { removeSelectionCriterion } from 'src/content/app/regulatory-activity-viewer/state/epigenome-selection/epigenomeSelectionSlice';

import { getMetadataItems } from 'src/content/app/regulatory-activity-viewer/components/epigenome-selection-panel/getEpigenomeCounts';

import {
  CollapsibleSection,
  CollapsibleSectionHead,
  CollapsibleSectionBody
} from 'src/shared/components/collapsible-section/CollapsibleSection';
import DeleteButton from 'src/shared/components/delete-button/DeleteButton';

import type { Epigenome } from 'src/content/app/regulatory-activity-viewer/types/epigenome';
import type { EpigenomeMetadataDimensions } from 'src/content/app/regulatory-activity-viewer/types/epigenomeMetadataDimensions';

import styles from './EpigenomeFiltersView.module.css';

const EpigenomeFiltersView = () => {
  const { currentData: epigenomeMetadataDimensionsResponse } =
    useEpigenomeMetadataDimensionsQuery();
  const { currentData: baseEpigenomes } = useBaseEpigenomesQuery();
  const epigenomeSelectionCriteria = useAppSelector(
    getEpigenomeSelectionCriteria
  );
  const dispatch = useAppDispatch();

  const onFilterRemove = useCallback(
    (payload: { dimensionName: string; value: string }) => {
      dispatch(removeSelectionCriterion(payload));
    },
    []
  );

  if (!epigenomeMetadataDimensionsResponse || !baseEpigenomes) {
    return null;
  }

  const metadataDimensions = epigenomeMetadataDimensionsResponse.dimensions;
  const metadataDimensionNames =
    epigenomeMetadataDimensionsResponse.filter_layout.flat();

  return (
    <div>
      {metadataDimensionNames.map((dimensionName) => (
        <FiltersSection
          key={dimensionName}
          dimensionName={dimensionName}
          metadataDimensions={metadataDimensions}
          allFilters={epigenomeSelectionCriteria}
          epigenomes={baseEpigenomes}
          onFilterRemove={onFilterRemove}
        />
      ))}
    </div>
  );
};

const FiltersSection = ({
  dimensionName,
  allFilters,
  metadataDimensions,
  epigenomes,
  onFilterRemove
}: {
  dimensionName: string;
  allFilters: Record<string, Set<string>>;
  metadataDimensions: EpigenomeMetadataDimensions;
  onFilterRemove: (params: { dimensionName: string; value: string }) => void;
  epigenomes: Epigenome[];
}) => {
  const filtersForSection = allFilters[dimensionName];

  if (!filtersForSection) {
    return null;
  }

  const { metadataItems, counts: metadataCounts } = getMetadataItems({
    epigenomes: epigenomes,
    dimensionName: dimensionName,
    selectionCriteria: allFilters,
    metadataItems: metadataDimensions[dimensionName]
  });

  return (
    <CollapsibleSection>
      <CollapsibleSectionHead>{metadataItems.name}</CollapsibleSectionHead>
      <CollapsibleSectionBody>
        {[...filtersForSection].map((filterName) => (
          <EpigenomeFilter
            key={filterName}
            dimensionName={dimensionName}
            filterValue={filterName}
            epigenomesCount={metadataCounts[filterName]}
            onRemove={onFilterRemove}
          />
        ))}
      </CollapsibleSectionBody>
    </CollapsibleSection>
  );
};

const EpigenomeFilter = ({
  dimensionName,
  filterValue,
  epigenomesCount,
  onRemove
}: {
  dimensionName: string;
  filterValue: string;
  epigenomesCount: number;
  onRemove: (params: { dimensionName: string; value: string }) => void;
}) => {
  const onDeleteClick = () => {
    onRemove({ dimensionName, value: filterValue });
  };

  return (
    <div className={styles.epigenomeFilter}>
      {filterValue}
      <div className={styles.epigenomeFilterRight}>
        <span className={styles.epigenomesCount}>{epigenomesCount ?? 0}</span>
        <DeleteButton onClick={onDeleteClick} />
      </div>
    </div>
  );
};

export default EpigenomeFiltersView;
