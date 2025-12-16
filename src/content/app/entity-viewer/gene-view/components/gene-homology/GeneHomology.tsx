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

import styles from './GeneHomology.module.css';

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
  }

  if (
    isError ||
    !currentData ||
    !currentData.homologies ||
    currentData.homologies.length === 0
  ) {
    return <span className={styles.noData}>No data</span>;
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
