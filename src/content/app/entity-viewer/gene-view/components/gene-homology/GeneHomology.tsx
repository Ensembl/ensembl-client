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

import {
  useGeneSummaryQuery,
  useEvGeneHomologyQuery
} from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';
import useEntityViewerIds from 'src/content/app/entity-viewer/hooks/useEntityViewerIds';

import GeneHomologyTable from './GeneHomologyTable';
import { CircleLoader } from 'src/shared/components/loader';

import type { GeneHomology as GeneHomologyType } from 'src/content/app/entity-viewer/state/api/types/geneHomology';

const GeneHomology = () => {
  const { activeGenomeId, parsedEntityId } = useEntityViewerIds();

  const geneUnversionedStableId = parsedEntityId?.objectId;

  const { currentData: geneSummaryData } = useGeneSummaryQuery(
    {
      genomeId: activeGenomeId || '',
      geneId: geneUnversionedStableId ?? ''
    },
    {
      skip: !activeGenomeId || !geneUnversionedStableId
    }
  );

  const geneStableId = geneSummaryData?.gene.stable_id;

  const { currentData, isFetching, isError } = useEvGeneHomologyQuery(
    {
      genomeId: activeGenomeId || '',
      geneId: geneStableId ?? ''
    },
    {
      skip: !activeGenomeId || !geneStableId
    }
  );

  if (isFetching) {
    return <CircleLoader />;
  } else if (isError) {
    // might be smarter, and show this message only in 404-like errors; while showing something like 'Failed to fetch homology data' otherwise
    return 'No data';
  } else if (currentData?.homologies === null) {
    // This means that Compara pipelines have not been run for this genome.
    // We might want to show a more meaningful message here
    return 'No data';
  } else if (!currentData) {
    return null; // this should not happen; but will make typescript happy
  }

  // We have checked above that both currentData and currentData.homologies exist;
  // but typescript cannot see this
  return (
    <GeneHomologyTable
      homologies={currentData.homologies as GeneHomologyType[]}
    />
  );
};

export default GeneHomology;
