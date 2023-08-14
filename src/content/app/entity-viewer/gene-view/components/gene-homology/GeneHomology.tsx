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

import React from 'react';

import { useEvGeneHomologyQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

import GeneHomologyTable from './GeneHomologyTable';
import { CircleLoader } from 'src/shared/components/loader';

const GeneHomology = () => {
  const { currentData, isFetching, isError } = useEvGeneHomologyQuery({
    genomeId: '',
    geneId: ''
  });

  if (isFetching) {
    return <CircleLoader />;
  } else if (isError) {
    return 'Failed to fetch homology data';
  } else if (!currentData) {
    return null; // this should not happen; but will make typescript happy
  }

  return <GeneHomologyTable homologies={currentData.homologies} />;
};

export default GeneHomology;
