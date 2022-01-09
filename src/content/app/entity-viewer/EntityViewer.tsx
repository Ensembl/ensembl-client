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

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';

import { useUrlParams } from 'src/shared/hooks/useUrlParams';

import { getBreakpointWidth } from 'src/global/globalSelectors';
import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEntityId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import {
  isEntityViewerSidebarOpen,
  getEntityViewerSidebarModalView
} from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';

import { setDataFromUrl } from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSlice';
import {
  toggleSidebar,
  initializeSidebar
} from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSlice';

import { StandardAppLayout } from 'src/shared/components/layout';
import EntityViewerAppBar from './shared/components/entity-viewer-app-bar/EntityViewerAppBar';
import EntityViewerSidebarToolstrip from './shared/components/entity-viewer-sidebar/entity-viewer-sidebar-toolstrip/EntityViewerSidebarToolstrip';
import EntityViewerSidebarModal from 'src/content/app/entity-viewer/shared/components/entity-viewer-sidebar/entity-viewer-sidebar-modal/EntityViewerSidebarModal';
import EntityViewerTopbar from './shared/components/entity-viewer-topbar/EntityViewerTopbar';
import EntityViewerInterstitial from './interstitial/EntityViewerInterstitial';
import GeneView from './gene-view/GeneView';
import GeneViewSidebar from './gene-view/components/gene-view-sidebar/GeneViewSideBar';
import GeneViewSidebarTabs from './gene-view/components/gene-view-sidebar-tabs/GeneViewSidebarTabs';

import styles from './EntityViewer.scss';

const EntityViewer = () => {
  const activeGenomeId = useSelector(getEntityViewerActiveGenomeId);
  const dispatch = useDispatch();

  useEntityViewerRouting();

  useEffect(() => {
    if (activeGenomeId) {
      dispatch(initializeSidebar(activeGenomeId));
    }
  }, [activeGenomeId]);

  return (
    <div className={styles.entityViewer}>
      <EntityViewerAppBar />
      <Routes>
        <Route index element={<EntityViewerInterstitial />} />
        <Route path="/:genomeId" element={<EntityViewerInterstitial />} />
        <Route path="/:genomeId/:entityId" element={<EntityViewerForGene />} />
      </Routes>
    </div>
  );
};

const EntityViewerForGene = () => {
  const isSidebarOpen = useSelector(isEntityViewerSidebarOpen);
  const isSidebarModalOpen = Boolean(
    useSelector(getEntityViewerSidebarModalView)
  );
  const viewportWidth = useSelector(getBreakpointWidth);
  const { genomeId, entityId } = useParams<'genomeId' | 'entityId'>();
  const dispatch = useDispatch();

  const SideBarContent = isSidebarModalOpen ? (
    <EntityViewerSidebarModal />
  ) : (
    <GeneViewSidebar />
  );

  return (
    <StandardAppLayout
      mainContent={<GeneView />}
      topbarContent={
        <EntityViewerTopbar
          genomeId={genomeId as string}
          entityId={entityId as string}
        />
      }
      sidebarContent={SideBarContent}
      sidebarNavigation={<GeneViewSidebarTabs />}
      sidebarToolstripContent={<EntityViewerSidebarToolstrip />}
      isSidebarOpen={isSidebarOpen}
      onSidebarToggle={() => dispatch(toggleSidebar())}
      isDrawerOpen={false}
      viewportWidth={viewportWidth}
    />
  );
};

const useEntityViewerRouting = () => {
  const activeGenomeId = useSelector(getEntityViewerActiveGenomeId);
  const activeEntityId = useSelector(getEntityViewerActiveEntityId);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const params = useUrlParams<'genomeId' | 'entityId'>([
    '/entity-viewer/:genomeId',
    '/entity-viewer/:genomeId/:entityId'
  ]);
  const { genomeId, entityId } = params;

  useEffect(() => {
    if (!genomeId && activeGenomeId) {
      // the url is /entity-viewer; but the user has already viewed some species in EntityViewer
      const entityIdForUrl = activeEntityId
        ? buildFocusIdForUrl(activeEntityId)
        : undefined;
      const newUrl = urlFor.entityViewer({
        genomeId: activeGenomeId,
        entityId: entityIdForUrl
      });
      navigate(newUrl, { replace: true });
    } else if (
      activeGenomeId &&
      activeGenomeId === genomeId &&
      activeEntityId &&
      !entityId
    ) {
      // the url is /entity-viewer/:genome_id; but the user has already viewed a gene
      const entityIdForUrl = buildFocusIdForUrl(activeEntityId);
      const replacementUrl = urlFor.entityViewer({
        genomeId: activeGenomeId,
        entityId: entityIdForUrl
      });
      navigate(replacementUrl, { replace: true });
    }
    dispatch(setDataFromUrl(params));
  }, [params.genomeId, params.entityId, activeGenomeId, activeEntityId]);
};

export default EntityViewer;
