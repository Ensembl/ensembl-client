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

import { useCallback, type ComponentProps } from 'react';

import { useAppSelector, useAppDispatch } from 'src/store';

import { getEpigenomeSelectionCriteria } from 'src/content/app/regulatory-activity-viewer/state/epigenome-selection/epigenomeSelectionSelectors';

import {
  useEpigenomesMetadataDimensionsQuery,
  useBaseEpigenomesQuery
} from 'src/content/app/regulatory-activity-viewer/state/api/activityViewerApiSlice';
import {
  addSelectionCriterion,
  removeSelectionCriterion
} from 'src/content/app/regulatory-activity-viewer/state/epigenome-selection/epigenomeSelectionSlice';

import { getMetadataItems } from './getEpigenomeCounts';

import EpigenomeMetadataDimensionPanel from './epigenome-metadata-dimension-panel/EpigenomeMetadataDimensionPanel';

import type { Epigenome } from 'src/content/app/regulatory-activity-viewer/types/epigenome';
import type { MetadataDimensions } from 'src/content/app/regulatory-activity-viewer/types/epigenomeMetadataDimensions';

import styles from './EpigenomeSelectionPanel.module.css';

const EpigenomeSelectionPanel = () => {
  const { currentData: epigenomesMetadataDimensions } =
    useEpigenomesMetadataDimensionsQuery();
  const { currentData: baseEpigenomes } = useBaseEpigenomesQuery();
  const epigenomeSelectionCriteria = useAppSelector(
    getEpigenomeSelectionCriteria
  );
  const dispatch = useAppDispatch();

  const onSelectionCriterionAdded = useCallback(
    (payload: { dimensionName: string; value: string }) => {
      dispatch(addSelectionCriterion(payload));
    },
    []
  );

  const onSelectionCriterionRemoved = useCallback(
    (payload: { dimensionName: string; value: string }) => {
      dispatch(removeSelectionCriterion(payload));
    },
    []
  );

  if (!epigenomesMetadataDimensions || !baseEpigenomes) {
    return null;
  }

  return (
    <div className={styles.panel}>
      <EpigenomeMetadataDimensionPanelWithData
        dimensionName={'term'}
        selectionCriteria={epigenomeSelectionCriteria}
        metadataDimensions={epigenomesMetadataDimensions}
        epigenomes={baseEpigenomes}
        onSelectionCriterionAdded={onSelectionCriterionAdded}
        onSelectionCriterionRemoved={onSelectionCriterionRemoved}
      />
      <EpigenomeMetadataDimensionPanelWithData
        dimensionName={'organ_slims'}
        selectionCriteria={epigenomeSelectionCriteria}
        metadataDimensions={epigenomesMetadataDimensions}
        epigenomes={baseEpigenomes}
        onSelectionCriterionAdded={onSelectionCriterionAdded}
        onSelectionCriterionRemoved={onSelectionCriterionRemoved}
      />
      <EpigenomeMetadataDimensionPanelWithData
        dimensionName={'system_slims'}
        selectionCriteria={epigenomeSelectionCriteria}
        metadataDimensions={epigenomesMetadataDimensions}
        epigenomes={baseEpigenomes}
        onSelectionCriterionAdded={onSelectionCriterionAdded}
        onSelectionCriterionRemoved={onSelectionCriterionRemoved}
      />
    </div>
  );
};

const EpigenomeMetadataDimensionPanelWithData = (
  props: Pick<
    ComponentProps<typeof EpigenomeMetadataDimensionPanel>,
    | 'dimensionName'
    | 'onSelectionCriterionAdded'
    | 'onSelectionCriterionRemoved'
  > & {
    selectionCriteria: Record<string, Set<string>>;
    metadataDimensions: MetadataDimensions;
    epigenomes: Epigenome[];
  }
) => {
  const { metadataItems, counts: metadataCounts } = getMetadataItems({
    epigenomes: props.epigenomes,
    dimensionName: props.dimensionName,
    selectionCriteria: props.selectionCriteria,
    metadataItems: props.metadataDimensions[props.dimensionName]
  });

  return (
    <EpigenomeMetadataDimensionPanel
      dimensionName={props.dimensionName}
      dimensionData={metadataItems}
      counts={metadataCounts}
      selectedValues={props.selectionCriteria[props.dimensionName] ?? new Set()}
      onSelectionCriterionAdded={props.onSelectionCriterionAdded}
      onSelectionCriterionRemoved={props.onSelectionCriterionRemoved}
    />
  );
};

export default EpigenomeSelectionPanel;
