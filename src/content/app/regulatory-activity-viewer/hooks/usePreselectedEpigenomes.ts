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

import { useAppDispatch, useAppSelector } from 'src/store';

import useEpigenomes from 'src/content/app/regulatory-activity-viewer/hooks/useEpigenomes';

import { getEpigenomeSelectionStatePerGenome } from 'src/content/app/regulatory-activity-viewer/state/epigenome-selection/epigenomeSelectionSelectors';
import { getActiveGenomeId } from 'src/content/app/regulatory-activity-viewer/state/general/generalSelectors';

import { addSelectionCriterion } from 'src/content/app/regulatory-activity-viewer/state/epigenome-selection/epigenomeSelectionSlice';

import type { EpigenomeMetadataDimensions } from 'src/content/app/regulatory-activity-viewer/types/epigenomeMetadataDimensions';

/**
 * Upon the first load of epigenome metadata dimensions,
 * check if user has selected any dimensions,
 * and if not, then pre-select epigenomes using the default dimensions (if available).
 *
 * See the CommonMetadataDimensionFields type for epigenome metadata dimensions.
 *
 * NOTE: this hook should be only run once, at the top level of RegulatoryActivityViewer
 */
const usePreselectedEpigenomes = () => {
  const activeGenomeId = useAppSelector(getActiveGenomeId) ?? '';
  const { epigenomeMetadataDimensionsResponse } = useEpigenomes();
  const epigenomeSelectionState = useAppSelector((state) =>
    getEpigenomeSelectionStatePerGenome(state, activeGenomeId)
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!activeGenomeId || !epigenomeMetadataDimensionsResponse) {
      // can't do anything until epigenomeMetadataDimensionsResponse is available
      return;
    }

    if (!epigenomeSelectionState) {
      const initialEpigenomeFilters = getPreselectedDimensions(
        epigenomeMetadataDimensionsResponse.dimensions
      );
      for (const { dimensionName, value } of initialEpigenomeFilters) {
        dispatch(
          addSelectionCriterion({
            genomeId: activeGenomeId,
            dimensionName,
            value
          })
        );
      }
    }
  }, [
    epigenomeMetadataDimensionsResponse,
    epigenomeSelectionState,
    activeGenomeId
  ]);
};

const getPreselectedDimensions = (dimensions: EpigenomeMetadataDimensions) => {
  const result: { dimensionName: string; value: string }[] = [];

  for (const [dimensionName, dimensionData] of Object.entries(dimensions)) {
    if (dimensionData.default_values.length) {
      for (const value of dimensionData.default_values) {
        result.push({ dimensionName, value });
      }
    }
  }

  return result;
};

export default usePreselectedEpigenomes;
