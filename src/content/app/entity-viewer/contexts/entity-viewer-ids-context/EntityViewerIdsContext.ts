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

import type { FocusObjectIdConstituents } from 'src/shared/types/focus-object/focusObjectTypes';

/**
 * Lots of ids present here. Here’s what they all mean
 *
 * - genomeIdInUrl — could be the actual id of a genome, or a genome tag used instead of genome id for url stability over time
 * - genomeIdForUrl — same; but generated considering what the active genome id is
 * - entityIdInUrl — a combination of the entity type with the stable id of the entity
 * - genomeId — actual id of a genome, as retrieved from the backend
 * - entityId — the full id that is used on the client as a key when storing entity information;
 *   is comprised of genome id, entity type, and entity stable id
 * - activeGenomeId — the id of the genome that is currently being viewed
 * - activeEntityId — the full id of the entity that that is currently being viewed
 */

export type EntityViewerIdsContextType = {
  activeGenomeId: string | null;
  activeEntityId: string | null;
  genomeIdInUrl: string | undefined;
  entityIdInUrl: string | undefined;
  genomeIdForUrl: string | undefined;
  entityIdForUrl: string | undefined;
  genomeId: string | undefined;
  entityId: string | undefined;
  parsedEntityId: FocusObjectIdConstituents | undefined;
  hasActiveGenomeIdChanged: boolean;
  hasActiveEntityIdChanged: boolean;
  isMissingGenomeId: boolean;
  isMalformedEntityId: boolean;
};

const defaultContext: EntityViewerIdsContextType = {
  activeGenomeId: null,
  activeEntityId: null,
  genomeIdInUrl: undefined,
  entityIdInUrl: undefined,
  genomeIdForUrl: undefined,
  entityIdForUrl: undefined,
  genomeId: undefined,
  entityId: undefined,
  parsedEntityId: undefined,
  hasActiveGenomeIdChanged: false,
  hasActiveEntityIdChanged: false,
  isMissingGenomeId: false,
  isMalformedEntityId: false
};

export const EntityViewerIdsContext =
  React.createContext<EntityViewerIdsContextType>(defaultContext);
