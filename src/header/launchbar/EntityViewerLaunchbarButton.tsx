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
import { useLocation } from 'react-router-dom';

import { useAppSelector } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import {
  parseFocusObjectId,
  buildFocusIdForUrl
} from 'src/shared/helpers/focusObjectHelpers';

import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEntityId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import { getCurrentView as getCurrentGeneView } from 'src/content/app/entity-viewer/state/gene-view/view/geneViewViewSelectors';

import LaunchbarButton from './LaunchbarButton';
import { EntityViewerIcon } from 'src/shared/components/app-icon';

const EntityViewerLaunchbarButton = () => {
  const entityViewerActiveGenomeId = useAppSelector(
    getEntityViewerActiveGenomeId
  );
  const entityViewerActiveEntityId = useAppSelector(
    getEntityViewerActiveEntityId
  );
  const entityViewerActiveSpecies = useAppSelector((state) =>
    getCommittedSpeciesById(state, entityViewerActiveGenomeId)
  );
  const geneView = useAppSelector(getCurrentGeneView) ?? null;
  const location = useLocation();

  const parsedEntityId = entityViewerActiveEntityId
    ? parseFocusObjectId(entityViewerActiveEntityId)
    : null;
  const entityType = parsedEntityId?.type;

  const genomeIdForUrl =
    entityViewerActiveSpecies?.genome_tag ?? entityViewerActiveGenomeId;
  const entityIdForUrl = parsedEntityId
    ? buildFocusIdForUrl(parsedEntityId)
    : null;

  const entityViewerPath = urlFor.entityViewer({
    genomeId: genomeIdForUrl ?? null,
    entityId: entityIdForUrl,
    view: entityType === 'gene' ? geneView : null
  });

  return (
    <LaunchbarButton
      path={entityViewerPath}
      description="Entity Viewer"
      icon={EntityViewerIcon}
      enabled={true}
      isActive={location.pathname.startsWith('/entity-viewer')}
    />
  );
};

export default EntityViewerLaunchbarButton;
