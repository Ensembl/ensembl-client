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

import useEpigenomes from 'src/content/app/regulatory-activity-viewer/hooks/useEpigenomes';

import { getEpigenomeSelectionCriteria } from 'src/content/app/regulatory-activity-viewer/state/epigenome-selection/epigenomeSelectionSelectors';

import {
  addSelectionCriterion,
  removeSelectionCriterion
} from 'src/content/app/regulatory-activity-viewer/state/epigenome-selection/epigenomeSelectionSlice';

import { getMetadataItems } from './getEpigenomeCounts';

import EpigenomeMetadataDimensionPanel from './epigenome-metadata-dimension-panel/EpigenomeMetadataDimensionPanel';

import type { Epigenome } from 'src/content/app/regulatory-activity-viewer/types/epigenome';
import type { EpigenomeMetadataDimensions } from 'src/content/app/regulatory-activity-viewer/types/epigenomeMetadataDimensions';

import styles from './EpigenomeSelectionPanel.module.css';

type Props = {
  genomeId: string;
};

const EpigenomeSelectionPanel = (props: Props) => {
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
  const epigenomeMetadataColumns =
    epigenomeMetadataDimensionsResponse.ui_spec.filter_layout;

  return (
    <div className={styles.panel}>
      {epigenomeMetadataColumns.map((column) => (
        <EpigenomeMetadataColumn
          key={column[0]}
          dimensionsInColumn={column}
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

const EpigenomeMetadataColumn = ({
  dimensionsInColumn,
  selectionCriteria,
  metadataDimensions,
  epigenomes,
  onSelectionCriterionAdded,
  onSelectionCriterionRemoved
}: {
  dimensionsInColumn: string[];
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
  return (
    <div className={styles.column}>
      {dimensionsInColumn.map((dimensionName) => (
        <EpigenomeMetadataDimensionPanelWithData
          key={dimensionName}
          dimensionName={dimensionName}
          selectionCriteria={selectionCriteria}
          metadataDimensions={metadataDimensions}
          epigenomes={epigenomes}
          onSelectionCriterionAdded={onSelectionCriterionAdded}
          onSelectionCriterionRemoved={onSelectionCriterionRemoved}
        />
      ))}
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
    metadataDimensions: EpigenomeMetadataDimensions;
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
