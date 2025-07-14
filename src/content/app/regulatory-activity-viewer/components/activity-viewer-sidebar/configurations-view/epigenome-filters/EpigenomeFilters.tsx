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

import useEpigenomes from 'src/content/app/regulatory-activity-viewer/hooks/useEpigenomes';

import { getEpigenomeSelectionCriteria } from 'src/content/app/regulatory-activity-viewer/state/epigenome-selection/epigenomeSelectionSelectors';

import {
  addSelectionCriterion,
  removeSelectionCriterion
} from 'src/content/app/regulatory-activity-viewer/state/epigenome-selection/epigenomeSelectionSlice';

import { getMetadataItems } from './getEpigenomeCounts';

// import EpigenomeMetadataDimensionPanel from './epigenome-metadata-dimension-panel/EpigenomeMetadataDimensionPanel';
import EpigenomeSelectableMetadataItem from './epigenome-selectable-metadata-item/EpigenomeSelectableMetadataItem';
import {
  CollapsibleSection,
  CollapsibleSectionHead,
  CollapsibleSectionBody
} from 'src/shared/components/collapsible-section/CollapsibleSection';

import type { Epigenome } from 'src/content/app/regulatory-activity-viewer/types/epigenome';
import type { EpigenomeMetadataDimensions } from 'src/content/app/regulatory-activity-viewer/types/epigenomeMetadataDimensions';

import styles from './EpigenomeFilters.module.css';

type Props = {
  genomeId: string;
};

const EpigenomeFilters = (props: Props) => {
  const { genomeId } = props;
  const { baseEpigenomes, epigenomeMetadataDimensionsResponse } =
    useEpigenomes();
  const epigenomeSelectionCriteria = useAppSelector((state) =>
    getEpigenomeSelectionCriteria(state, genomeId)
  );
  const dispatch = useAppDispatch();

  const onSelectionCriterionAdded = useCallback(
    (payload: { dimensionName: string; value: string }) => {
      dispatch(
        addSelectionCriterion({
          ...payload,
          genomeId
        })
      );
    },
    []
  );

  const onSelectionCriterionRemoved = useCallback(
    (payload: { dimensionName: string; value: string }) => {
      dispatch(
        removeSelectionCriterion({
          ...payload,
          genomeId
        })
      );
    },
    []
  );

  if (!epigenomeMetadataDimensionsResponse || !baseEpigenomes) {
    return null;
  }

  const epigenomeMetadataDimensions =
    epigenomeMetadataDimensionsResponse.dimensions;
  const epigenomeMetadataSections =
    epigenomeMetadataDimensionsResponse.ui_spec.filter_layout.flat();

  return (
    <div>
      {epigenomeMetadataSections.map((sectionId) => (
        <FiltersPanel
          key={sectionId}
          sectionId={sectionId}
          selectionCriteria={epigenomeSelectionCriteria}
          metadataDimensions={epigenomeMetadataDimensions}
          epigenomes={baseEpigenomes}
          onSelectionCriterionAdded={onSelectionCriterionAdded}
          onSelectionCriterionRemoved={onSelectionCriterionRemoved}
        />
      ))}
    </div>
  );
};

const FiltersPanel = ({
  sectionId,
  selectionCriteria,
  metadataDimensions,
  epigenomes,
  onSelectionCriterionAdded,
  onSelectionCriterionRemoved
}: {
  sectionId: string;
  selectionCriteria: Record<string, Set<string>>;
  metadataDimensions: EpigenomeMetadataDimensions;
  epigenomes: Epigenome[];
  onSelectionCriterionAdded: (payload: {
    dimensionName: string;
    value: string;
  }) => void;
  onSelectionCriterionRemoved: (payload: {
    dimensionName: string;
    value: string;
  }) => void;
}) => {
  const dimensionName = sectionId;
  const { metadataItems, counts: metadataCounts } = getMetadataItems({
    epigenomes: epigenomes,
    dimensionName,
    selectionCriteria: selectionCriteria,
    metadataItems: metadataDimensions[dimensionName]
  });
  const selectedValues = selectionCriteria[dimensionName] ?? new Set();

  // NOTE: max-height: 200px?

  const selectableItems = metadataItems.values.map((dataItem) => {
    let metadataValue: string | null = null;

    if (typeof dataItem === 'string') {
      metadataValue = dataItem;
    } else if ('value' in dataItem) {
      metadataValue = dataItem.value;
    } else {
      return null;
    }

    return (
      <EpigenomeSelectableMetadataItem
        dimensionName={dimensionName}
        name={metadataValue}
        isSelected={selectedValues.has(metadataValue)}
        count={metadataCounts[metadataValue] ?? 0}
        onAdd={onSelectionCriterionAdded}
        onRemove={onSelectionCriterionRemoved}
        key={metadataValue}
      />
    );
  });

  return (
    <CollapsibleSection className={styles.filtersSection}>
      <CollapsibleSectionHead>{metadataItems.name}</CollapsibleSectionHead>
      <CollapsibleSectionBody className={styles.filtersSectionBody}>
        {selectableItems}
      </CollapsibleSectionBody>
    </CollapsibleSection>
  );
};

export default EpigenomeFilters;
