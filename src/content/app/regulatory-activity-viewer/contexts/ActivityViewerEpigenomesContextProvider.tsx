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
  useBaseEpigenomesQuery,
  useEpigenomeLabelsQuery
} from 'src/content/app/regulatory-activity-viewer/state/api/activityViewerApiSlice';

import { ActivityViewerEpigenomesContext } from './ActivityViewerEpigenomesContext';

import type { LabelledEpigenome } from '../types/epigenome';

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
  const { genomeId, assemblyAccessionId } = useActivityViewerIds();
  const epigenomeSelectionCriteria = useAppSelector((state) =>
    getEpigenomeSelectionCriteria(state, genomeId ?? '')
  );
  const epigenomeCombiningDimensions = useAppSelector((state) =>
    getEpigenomeCombiningDimensions(state, genomeId ?? '')
  );
  const storedEpigenomeSortingDimensions = useAppSelector((state) =>
    getEpigenomeSortingDimensions(state, genomeId ?? '')
  );

  const {
    isLoading: areBaseEpigenomesLoading,
    isError: isBaseEpigenomesError,
    currentData: baseEpigenomes
  } = useBaseEpigenomesQuery(
    {
      assemblyId: assemblyAccessionId ?? ''
    },
    {
      skip: !assemblyAccessionId
    }
  );
  const {
    isLoading: areMetadataDimensionsLoading,
    isError: isEpigenomeMetadataError,
    currentData: epigenomeMetadataDimensionsResponse
  } = useEpigenomeMetadataDimensionsQuery(
    {
      assemblyId: assemblyAccessionId ?? ''
    },
    {
      skip: !assemblyAccessionId
    }
  );

  const allEpigenomeDimensions = useMemo(() => {
    if (!epigenomeMetadataDimensionsResponse) {
      return [];
    }
    return Object.keys(epigenomeMetadataDimensionsResponse.dimensions);
  }, [epigenomeMetadataDimensionsResponse]);

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
    if (!epigenomeCombiningDimensions.length) {
      return filteredEpigenomes;
    }

    return getCombinedEpigenomes({
      baseEpigenomes: filteredEpigenomes,
      combiningDimensions: epigenomeCombiningDimensions,
      allEpigenomeDimensions
    });
  }, [
    filteredEpigenomes,
    epigenomeCombiningDimensions,
    allEpigenomeDimensions
  ]);

  const {
    isLoading: areEpigenomeLabelsLoading,
    isError: isEpigenomeLabelsError,
    currentData: epigenomeLabels
  } = useEpigenomeLabelsQuery(
    {
      assemblyId: assemblyAccessionId ?? '',
      combiningDimensions: epigenomeCombiningDimensions,
      epigenomeIds: combinedEpigenomes.map(({ id }) => id)
    },
    {
      skip: !assemblyAccessionId || !combinedEpigenomes.length
    }
  );

  const combinedEpigenomesWithLabels = useMemo(() => {
    return combinedEpigenomes.map((epigenome, index) => ({
      ...epigenome,
      label: epigenomeLabels?.[index].label ?? ''
    })) as LabelledEpigenome[];
  }, [epigenomeLabels, combinedEpigenomes]);

  const epigenomeSortableDimensions = useMemo(
    () =>
      getSortableDimensions({
        storedSortingDimensions: storedEpigenomeSortingDimensions,
        allSortableDimensions:
          epigenomeMetadataDimensionsResponse?.ui_spec.sortable ?? [],
        combiningDimensions: epigenomeCombiningDimensions
      }),
    [
      storedEpigenomeSortingDimensions,
      epigenomeMetadataDimensionsResponse,
      epigenomeCombiningDimensions
    ]
  );

  // use up to three first dimensions for sorting
  const dimensionsForSorting = epigenomeSortableDimensions.slice(0, 3);

  const sortedEpigenomes = sortEpigenomes({
    epigenomes: combinedEpigenomesWithLabels,
    sortingDimensions: dimensionsForSorting
  });

  return {
    isLoading:
      areBaseEpigenomesLoading ||
      areMetadataDimensionsLoading ||
      areEpigenomeLabelsLoading,
    isError:
      isBaseEpigenomesError ||
      isEpigenomeMetadataError ||
      isEpigenomeLabelsError,
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

/**
 * Get the full list of dimensions that CAN be used for the sorting of epigenomes.
 * Consider that dimensions in this list should NOT include ones that were used
 * to combine base epigenomes into combined epigenomes, because
 * such dimensions can no longer function to distinguish epigenomes.
 */
const getSortableDimensions = ({
  storedSortingDimensions,
  allSortableDimensions,
  combiningDimensions
}: {
  storedSortingDimensions: string[] | null; // this array has order defined by the user
  allSortableDimensions: string[]; // this array has a full list of sortable dimensions with a default order defined by the api
  combiningDimensions: string[];
}) => {
  storedSortingDimensions = storedSortingDimensions ?? [];
  const storedDimensionsSet = new Set(storedSortingDimensions);
  const remainingDimensions = allSortableDimensions.filter(
    (dimension) => !storedDimensionsSet.has(dimension)
  );

  // this will prevent some of the sortable dimensions from disappearing from the list,
  // which may happen if the user first combines epigenomes, then changes the sorting order, then uncombines
  const sortableDimensions = [...storedSortingDimensions].concat(
    remainingDimensions
  );

  return sortableDimensions.filter(
    (dimension) => !combiningDimensions.includes(dimension)
  );
};

export default ActivityViewerEpigenomesContextProvider;
