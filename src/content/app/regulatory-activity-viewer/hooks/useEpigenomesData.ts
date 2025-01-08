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

import useActivityViewerIds from './useActivityViewerIds';
import {
  useEpigenomeMetadataDimensionsQuery,
  useBaseEpigenomesQuery
} from 'src/content/app/regulatory-activity-viewer/state/api/activityViewerApiSlice';

/**
 * This hook fetches a list of base epigenomes associated with a given assembly,
 * as well as a summary of metadata of these epigenomes, i.e. which "metadata dimensions"
 * (e.g. organ, life stage, sex) are available, and what the possible values within those
 * metadata dimensions are.
 */

const useEpigenomeData = () => {
  const { assemblyName } = useActivityViewerIds();

  const { isLoading: areBaseEpigenomesLoading, currentData: baseEpigenomes } =
    useBaseEpigenomesQuery(
      {
        assemblyName: assemblyName ?? ''
      },
      {
        skip: !assemblyName
      }
    );
  const {
    isLoading: areMetadataDimensionsLoading,
    currentData: epigenomeMetadataDimensionsResponse
  } = useEpigenomeMetadataDimensionsQuery(
    {
      assemblyName: assemblyName ?? ''
    },
    {
      skip: !assemblyName
    }
  );

  return {
    isLoading: areBaseEpigenomesLoading || areMetadataDimensionsLoading,
    baseEpigenomes,
    epigenomeMetadataDimensionsResponse
  };
};

export default useEpigenomeData;
