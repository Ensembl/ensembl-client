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

import { useMemo, type ReactNode } from 'react';

import { useAppSelector } from 'src/store';

import { filterEpigenomes } from 'src/content/app/regulatory-activity-viewer/helpers/filter-epigenomes/filterEpigenomes';
import { getCombinedEpigenomes } from 'src/content/app/regulatory-activity-viewer/helpers/combine-epigenomes/combineEpigenomes';
import { sortEpigenomes } from 'src/content/app/regulatory-activity-viewer/components/selected-epigenomes/epigenomes-sorter/sortEpigenomes';

import {
  getEpigenomeSelectionCriteria,
  getEpigenomeCombiningDimensions,
  getEpigenomeSortingDimensions
} from 'src/content/app/regulatory-activity-viewer/state/epigenome-selection/epigenomeSelectionSelectors';

import useActivityViewerIds from 'src/content/app/regulatory-activity-viewer/hooks//useActivityViewerIds';
import {
  useEpigenomeMetadataDimensionsQuery,
  useBaseEpigenomesQuery
} from 'src/content/app/regulatory-activity-viewer/state/api/activityViewerApiSlice';

import { ActivityViewerEpigenomesContext } from './ActivityViewerEpigenomesContext';

const ActivityViewerEpigenomesContextProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const epigenomesData = useEpigenomesData();

  return (
    <ActivityViewerEpigenomesContext value={epigenomesData}>
      {children}
    </ActivityViewerEpigenomesContext>
  );
};

const useEpigenomesData = () => {
  const { activeGenomeId, assemblyName } = useActivityViewerIds();
  const epigenomeSelectionCriteria = useAppSelector((state) =>
    getEpigenomeSelectionCriteria(state, activeGenomeId ?? '')
  );
  const epigenomeCombiningDimensions = useAppSelector((state) =>
    getEpigenomeCombiningDimensions(state, activeGenomeId ?? '')
  );
  const storedEpigenomeSortingDimensions = useAppSelector((state) =>
    getEpigenomeSortingDimensions(state, activeGenomeId ?? '')
  );

  const {
    isLoading: areBaseEpigenomesLoading,
    isError: isBaseEpigenomesError,
    currentData: baseEpigenomes
  } = useBaseEpigenomesQuery(
    {
      assemblyName: assemblyName ?? ''
    },
    {
      skip: !assemblyName
    }
  );
  const {
    isLoading: areMetadataDimensionsLoading,
    isError: isEpigenomeMetadataError,
    currentData: epigenomeMetadataDimensionsResponse
  } = useEpigenomeMetadataDimensionsQuery(
    {
      assemblyName: assemblyName ?? ''
    },
    {
      skip: !assemblyName
    }
  );

  const filteredEpigenomes = useMemo(() => {
    if (!baseEpigenomes) {
      return [];
    }
    return filterEpigenomes({
      epigenomes: baseEpigenomes,
      selectionCriteria: epigenomeSelectionCriteria
    });
  }, [baseEpigenomes, epigenomeSelectionCriteria]);

  const combinedEpigenomes = useMemo(() => {
    return getCombinedEpigenomes({
      baseEpigenomes: filteredEpigenomes,
      combiningDimensions: epigenomeCombiningDimensions
    });
  }, [filteredEpigenomes]);

  // List of dimensions actually used to sort the epigenomes (up to three dimensions)
  const epigenomeSortableDimensions =
    storedEpigenomeSortingDimensions ??
    epigenomeMetadataDimensionsResponse?.ui_spec.sortable ??
    [];

  const dimensionsForSorting = epigenomeSortableDimensions.slice(0, 3); // use up to three first dimensions for sorting

  const sortedEpigenomes = sortEpigenomes({
    epigenomes: combinedEpigenomes,
    sortingDimensions: dimensionsForSorting
  });

  return {
    isLoading: areBaseEpigenomesLoading || areMetadataDimensionsLoading,
    isError: isBaseEpigenomesError || isEpigenomeMetadataError,
    baseEpigenomes: baseEpigenomes ?? null,
    epigenomeMetadataDimensionsResponse:
      epigenomeMetadataDimensionsResponse ?? null,
    filteredCombinedEpigenomes: combinedEpigenomes,
    sortedCombinedEpigenomes: sortedEpigenomes,
    epigenomeSortingDimensions: dimensionsForSorting,
    allEpigenomeSortableDimensions: epigenomeSortableDimensions,
    epigenomeCombiningDimensions
  };
};

export default ActivityViewerEpigenomesContextProvider;
