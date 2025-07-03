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

import useEntityViewerIds from 'src/content/app/entity-viewer/hooks/useEntityViewerIds';
import { useGeneSummaryQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

/**
 * A hook for validating individual parts of the url.
 * TODO: might be worth adding validation of the 'location' parameter in the future
 */

const useEntityViewerUrlCheck = () => {
  const {
    genomeId,
    genomeIdInUrl,
    isMissingGenomeId,
    isMalformedEntityId,
    entityIdInUrl,
    parsedEntityId
  } = useEntityViewerIds();

  const isGene = parsedEntityId?.type === 'gene';
  let geneId;

  if (isGene) {
    geneId = parsedEntityId.objectId;
  }

  const {
    isFetching: isGeneQueryFetching,
    isError: isGeneQueryError,
    error: geneQueryError
  } = useGeneSummaryQuery(
    {
      genomeId: genomeId ?? '',
      geneId: geneId ?? ''
    },
    {
      skip: !genomeId || !geneId
    }
  );

  const isMissingGene =
    isGeneQueryError &&
    'meta' in geneQueryError &&
    (geneQueryError.meta.data as any)?.gene === null;

  const isFetching = isGeneQueryFetching; // extend this when we start having other entities
  const isMissingEntity = isMissingGene; // extend this when we start having other entities

  return {
    isFetching,
    genomeIdInUrl,
    entityIdInUrl,
    isMissingGenomeId,
    isMalformedEntityId,
    isMissingEntity
  };
};

export default useEntityViewerUrlCheck;
