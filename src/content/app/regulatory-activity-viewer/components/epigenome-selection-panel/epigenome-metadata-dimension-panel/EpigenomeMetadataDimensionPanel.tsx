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

import EpigenomeSelectableMetadataItem from '../epigenome-selectable-metadata-item/EpigenomeSelectableMetadataItem';

import type { MetadataDimensions } from 'src/content/app/regulatory-activity-viewer/types/epigenomeMetadataDimensions';

import styles from './EpigenomeMetadataDimensionPanel.module.css';

type Props<T extends keyof MetadataDimensions> = {
  dimensionName: T;
  dimensionData: MetadataDimensions[T];
  counts: Record<string, number>;
  selectedValues: Set<string>;
  onSelectionCriterionAdded: (payload: {
    dimensionName: string;
    value: string;
  }) => void;
  onSelectionCriterionRemoved: (payload: {
    dimensionName: string;
    value: string;
  }) => void;
};

const EpigenomeMetadataDimensionPanel = <T extends keyof MetadataDimensions>(
  props: Props<T>
) => {
  const selectableItems = props.dimensionData.values.map((dataItem) => {
    if (typeof dataItem === 'string') {
      return (
        <EpigenomeSelectableMetadataItem
          dimensionName={props.dimensionName}
          name={dataItem}
          isSelected={props.selectedValues.has(dataItem)}
          count={props.counts[dataItem] ?? 0}
          onAdd={props.onSelectionCriterionAdded}
          onRemove={props.onSelectionCriterionRemoved}
          key={dataItem}
        />
      );
    } else if ('name' in dataItem) {
      return (
        <EpigenomeSelectableMetadataItem
          dimensionName={props.dimensionName}
          name={dataItem.name}
          isSelected={props.selectedValues.has(dataItem.name)}
          count={props.counts[dataItem.name] ?? 0}
          onAdd={props.onSelectionCriterionAdded}
          onRemove={props.onSelectionCriterionRemoved}
          key={dataItem.name}
        />
      );
    } else {
      return null;
    }
  });

  return (
    <div className={styles.panel}>
      <div className={styles.panelTitle}>{props.dimensionData.name}</div>
      {selectableItems}
    </div>
  );
};

export default EpigenomeMetadataDimensionPanel;
