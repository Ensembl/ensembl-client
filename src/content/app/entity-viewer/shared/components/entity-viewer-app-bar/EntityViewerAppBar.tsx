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

import React, { memo, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import isEqual from 'lodash/isEqual';

import { useAppSelector } from 'src/store';
import * as urlFor from 'src/shared/helpers/urlHelper';
import { AppName } from 'src/global/globalConfig';
import {
  parseFocusObjectId,
  buildFocusIdForUrl
} from 'src/shared/helpers/focusObjectHelpers';

import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEntityIds
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';
import { getAllGeneViews } from 'src/content/app/entity-viewer/state/gene-view/view/geneViewViewSelectors';

import useEntityViewerAnalytics from 'src/content/app/entity-viewer/hooks/useEntityViewerAnalytics';

import AppBar from 'src/shared/components/app-bar/AppBar';
import { SelectedSpecies } from 'src/shared/components/selected-species';
import SpeciesTabsWrapper from 'src/shared/components/species-tabs-wrapper/SpeciesTabsWrapper';
import { HelpPopupButton } from 'src/shared/components/help-popup';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

const EntityViewerAppBar = () => {
  const navigate = useNavigate();
  const speciesList = useAppSelector(getEnabledCommittedSpecies);
  const activeGenomeId = useAppSelector(getEntityViewerActiveGenomeId);
  const allActiveEntityIds = useAppSelector(getEntityViewerActiveEntityIds);
  const allGeneViews = useAppSelector(getAllGeneViews) ?? {};

  const { trackSpeciesChange } = useEntityViewerAnalytics();
  const onSpeciesTabClick = (species: CommittedItem) => {
    const genomeId = species.genome_id;
    const genomeIdForUrl = species.genome_tag ?? species.genome_id;
    const activeEntityId = allActiveEntityIds[genomeId];
    const parsedEntityId = activeEntityId
      ? parseFocusObjectId(activeEntityId)
      : null;
    const entityType = parsedEntityId?.type;
    const entityIdForUrl = parsedEntityId
      ? buildFocusIdForUrl(parsedEntityId)
      : null;
    const geneView = activeEntityId
      ? allGeneViews?.[genomeId]?.[activeEntityId]?.current ?? null
      : null;

    const url = urlFor.entityViewer({
      genomeId: genomeIdForUrl,
      entityId: entityIdForUrl,
      view: entityType === 'gene' ? geneView : null
    });
    navigate(url);
  };

  const speciesTabs = speciesList.map((species, index) => (
    <SelectedSpecies
      key={index}
      species={species}
      isActive={species.genome_id === activeGenomeId}
      onClick={onSpeciesTabClick}
    />
  ));
  const speciesSelectorLink = useMemo(() => {
    return (
      <Link to={urlFor.speciesSelector()} onClick={trackSpeciesChange}>
        Change
      </Link>
    );
  }, []);

  const wrappedSpecies = (
    <SpeciesTabsWrapper
      isWrappable={false}
      speciesTabs={speciesTabs}
      link={speciesSelectorLink}
    />
  );

  const mainContent = activeGenomeId
    ? wrappedSpecies
    : 'To start using this app...';

  return (
    <AppBar
      appName={AppName.ENTITY_VIEWER}
      mainContent={mainContent}
      aside={<HelpPopupButton slug="entity-viewer" />}
    />
  );
};

export default memo(EntityViewerAppBar, isEqual);
