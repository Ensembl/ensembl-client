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
  parseFocusObjectId,
  buildFocusObjectId,
  parseFocusIdFromUrl,
  buildFocusIdForUrl
} from 'src/shared/helpers/focusObjectHelpers';

import { useAppSelector } from 'src/store';
import usePrevious from 'src/shared/hooks/usePrevious';
import { useUrlParams } from 'src/shared/hooks/useUrlParams';
import { useGenomeInfoQuery } from 'src/shared/state/genome/genomeApiSlice';

import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEntityId,
  getEntityViewerActiveEntityIds
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

/**
 * Lots of ids going on here. Here’s what they mean
 *
 * - genomeIdInUrl — could be the actual id of a genome, or a url slug used instead of genome id for url stability over time
 * - genomeIdForUrl — same; but generated considering what the active genome id is
 * - entityIdInUrl — combines the type of the entity with the stable id of the entity
 * - genomeId — actual id of a genome, as retrieved from the backend
 * - entityId — the full id that is used on the client as a key when storing entity information;
 *   is comprised of genome id, entity type, and entity stable id
 * - activeGenomeId — the genome id that the user is currently focused on
 * - activeEntityId — the full id of the entity that the user is currently focused on
 *
 */

const useEntityViewerIds = () => {
  const activeGenomeId = useAppSelector(getEntityViewerActiveGenomeId);
  const allActiveEntityIds = useAppSelector(getEntityViewerActiveEntityIds);
  const activeEntityId = useAppSelector(getEntityViewerActiveEntityId);
  const savedGenomeInfo = useAppSelector((state) =>
    getCommittedSpeciesById(state, activeGenomeId ?? '')
  );
  const previousActiveGenomeId = usePrevious(activeGenomeId);
  const previousActiveEntityId = usePrevious(activeEntityId);
  const params = useUrlParams<'genomeId' | 'entityId'>([
    '/entity-viewer/:genomeId',
    '/entity-viewer/:genomeId/:entityId'
  ]);
  const { genomeId: genomeIdInUrl, entityId: entityIdInUrl } = params;

  const { currentData: genomeInfo, error } = useGenomeInfoQuery(
    genomeIdInUrl ?? '',
    {
      skip: !genomeIdInUrl
    }
  );

  const genomeId = genomeInfo?.genomeId;
  const genomeIdForUrl =
    genomeIdInUrl ??
    genomeInfo?.urlSlug ??
    genomeInfo?.genomeId ??
    savedGenomeInfo?.url_slug ??
    savedGenomeInfo?.genome_id;

  let entityId;
  let parsedEntityId;
  let isMalformedEntityId = false;

  if (genomeId && params.entityId) {
    try {
      parsedEntityId = {
        genomeId,
        ...parseFocusIdFromUrl(params.entityId)
      };
      entityId = buildFocusObjectId(parsedEntityId);
    } catch {
      isMalformedEntityId = true;
    }
  }

  // FIXME: sometimes we actually want to generate entity id for url from a provided genome id
  // (e.g. from active entity id); whereas other times, we want to use the entity id from the url
  const entityIdForUrl =
    genomeId && allActiveEntityIds[genomeId]
      ? buildFocusIdForUrl(parseFocusObjectId(allActiveEntityIds[genomeId]))
      : undefined;

  const hasActiveGenomeIdChanged =
    activeGenomeId &&
    previousActiveGenomeId &&
    activeGenomeId !== previousActiveGenomeId;

  const hasActiveEntityIdChanged =
    activeEntityId &&
    previousActiveEntityId &&
    activeEntityId !== previousActiveEntityId;

  const isMissingGenomeId =
    typeof (error as FetchBaseQueryError)?.status === 'number' &&
    (error as FetchBaseQueryError).status >= 400; // FIXME change status to 404 when the backend behaves

  return {
    activeGenomeId,
    activeEntityId,
    genomeIdInUrl,
    entityIdInUrl,
    genomeIdForUrl,
    entityIdForUrl,
    genomeId,
    entityId,
    parsedEntityId,
    hasActiveGenomeIdChanged,
    hasActiveEntityIdChanged,
    isMissingGenomeId,
    isMalformedEntityId
  };
};

export default useEntityViewerIds;
