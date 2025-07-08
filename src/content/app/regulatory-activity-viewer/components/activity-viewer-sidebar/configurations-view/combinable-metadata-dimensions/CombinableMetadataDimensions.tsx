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

import { type ChangeEvent } from 'react';

import { useAppDispatch } from 'src/store';

import useEpigenomes from 'src/content/app/regulatory-activity-viewer/hooks/useEpigenomes';

import { setCombiningDimensions } from 'src/content/app/regulatory-activity-viewer/state/epigenome-selection/epigenomeSelectionSlice';

import Checkbox from 'src/shared/components/checkbox/Checkbox';

import styles from './CombinableMetadataDimensions.module.css';

type Props = {
  genomeId: string;
};

const CombinableMetadataDimensions = (props: Props) => {
  const { genomeId } = props;
  const { epigenomeCombiningDimensions, epigenomeMetadataDimensionsResponse } =
    useEpigenomes();
  const allCombinableDimensions =
    epigenomeMetadataDimensionsResponse?.ui_spec.collapsible ?? [];
  const dispatch = useAppDispatch();

  if (!epigenomeMetadataDimensionsResponse) {
    // this should not happen
    return null;
  }

  const onDimensionDisplayToggle = (dimension: string, isSelected: boolean) => {
    const updatedDimensions = isSelected
      ? epigenomeCombiningDimensions.concat(dimension)
      : epigenomeCombiningDimensions.filter((dim) => dim !== dimension);

    dispatch(
      setCombiningDimensions({
        genomeId,
        dimensionNames: updatedDimensions
      })
    );
  };

  return (
    <div>
      <ExplanatoryNote />
      {allCombinableDimensions.map((dimensionId) => (
        <DimensionPanel
          key={dimensionId}
          dimensionId={dimensionId}
          dimensionName={
            epigenomeMetadataDimensionsResponse.dimensions[dimensionId].name
          }
          isSelected={epigenomeCombiningDimensions.includes(dimensionId)}
          onToggle={onDimensionDisplayToggle}
        />
      ))}
    </div>
  );
};

const ExplanatoryNote = () => {
  return (
    <p className={styles.note}>
      You can combine the epigenomes by one or more dimensions listed below.
      Pick dimensions that you would like{' '}
      <span className={styles.strong}>not</span> to distinguish epigenomes by.
    </p>
  );
};

const DimensionPanel = ({
  dimensionId,
  dimensionName,
  isSelected,
  onToggle
}: {
  dimensionId: string;
  dimensionName: string;
  isSelected: boolean; // is already involved in the combining of epigenomes
  onToggle: (dimension: string, isSelected: boolean) => void;
}) => {
  const toggleDimensionDisplay = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    onToggle(dimensionId, isChecked);
  };

  return (
    <div className={styles.dimensionPanel}>
      <div>{dimensionName}</div>
      <Checkbox checked={isSelected} onChange={toggleDimensionDisplay} />
    </div>
  );
};

export default CombinableMetadataDimensions;
