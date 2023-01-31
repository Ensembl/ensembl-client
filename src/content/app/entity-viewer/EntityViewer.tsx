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
import { Routes, Route, useNavigate } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { useAppSelector, useAppDispatch } from 'src/store';
import useEntityViewerIds from 'src/content/app/entity-viewer/hooks/useEntityViewerIds';
import useEntityViewerUrlCheck from 'src/content/app/entity-viewer/hooks/useEntityViewerUrlChecks';

import { getBreakpointWidth } from 'src/global/globalSelectors';
import { getGenomeById } from 'src/shared/state/genome/genomeSelectors';
import {
  isEntityViewerSidebarOpen,
  getEntityViewerSidebarModalView
} from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';

import {
  setActiveIds,
  deleteActiveEntityIdAndSave
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSlice';
import {
  toggleSidebar,
  initializeSidebar
} from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSlice';

import EntityViewerIdsContextProvider from 'src/content/app/entity-viewer/contexts/entity-viewer-ids-context/EntityViewerIdsContextProvider';
import { StandardAppLayout } from 'src/shared/components/layout';
import EntityViewerAppBar from './shared/components/entity-viewer-app-bar/EntityViewerAppBar';
import EntityViewerSidebarToolstrip from './shared/components/entity-viewer-sidebar/entity-viewer-sidebar-toolstrip/EntityViewerSidebarToolstrip';
import EntityViewerSidebarModal from 'src/content/app/entity-viewer/shared/components/entity-viewer-sidebar/entity-viewer-sidebar-modal/EntityViewerSidebarModal';
import EntityViewerTopbar from './shared/components/entity-viewer-topbar/EntityViewerTopbar';
import EntityViewerInterstitial from './interstitial/EntityViewerInterstitial';
import GeneView from './gene-view/GeneView';
import GeneViewSidebar from './gene-view/components/gene-view-sidebar/GeneViewSideBar';
import GeneViewSidebarTabs from './gene-view/components/gene-view-sidebar-tabs/GeneViewSidebarTabs';
import MissingGenomeError from 'src/shared/components/error-screen/url-errors/MissingGenomeError';
import MissingFeatureError from 'src/shared/components/error-screen/url-errors/MissingFeatureError';

import styles from './EntityViewer.scss';

const EntityViewer = () => {
  const {
    activeGenomeId,
    genomeIdInUrl,
    entityIdInUrl,
    isMissingGenomeId,
    isMalformedEntityId
  } = useEntityViewerIds();
  const genome = useAppSelector((state) =>
    getGenomeById(state, activeGenomeId ?? '')
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEntityViewerRouting();

  useEffect(() => {
    if (activeGenomeId) {
      dispatch(initializeSidebar(activeGenomeId));
    }
  }, [activeGenomeId]);

  const openEntityViewerInterstitial = () => {
    dispatch(deleteActiveEntityIdAndSave());
    navigate(urlFor.entityViewer({ genomeId: genomeIdInUrl }));
  };

  const renderEntityViewerRoutes = () => (
    <Routes>
      <Route index element={<EntityViewerInterstitial />} />
      <Route path="/:genomeId" element={<EntityViewerInterstitial />} />
      <Route path="/:genomeId/:entityId" element={<EntityViewerForGene />} />
    </Routes>
  );

  return (
    <EntityViewerIdsContextProvider>
      <div className={styles.entityViewer}>
        <EntityViewerAppBar />
        {isMissingGenomeId ? (
          <MissingGenomeError genomeId={genomeIdInUrl as string} />
        ) : isMalformedEntityId ? (
          <MissingFeatureError
            featureId={entityIdInUrl as string}
            genome={genome}
            showTopBar={true}
            onContinue={openEntityViewerInterstitial}
          />
        ) : (
          renderEntityViewerRoutes()
        )}
      </div>
    </EntityViewerIdsContextProvider>
  );
};

const EntityViewerForGene = () => {
  const { activeGenomeId, activeEntityId } = useEntityViewerIds();
  const {
    genomeIdInUrl,
    entityIdInUrl,
    isFetching: isVerifyingUrl,
    isMissingEntity
  } = useEntityViewerUrlCheck();
  const genome = useAppSelector((state) =>
    getGenomeById(state, activeGenomeId ?? '')
  );
  const isSidebarOpen = useAppSelector(isEntityViewerSidebarOpen);
  const isSidebarModalOpen = Boolean(
    useAppSelector(getEntityViewerSidebarModalView)
  );
  const viewportWidth = useAppSelector(getBreakpointWidth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const openEntityViewerInterstitial = () => {
    dispatch(deleteActiveEntityIdAndSave());
    navigate(urlFor.entityViewer({ genomeId: genomeIdInUrl }));
  };

  if (!activeGenomeId || !activeEntityId || isVerifyingUrl) {
    return null;
  }

  if (isMissingEntity) {
    return (
      <MissingFeatureError
        featureId={entityIdInUrl as string}
        genome={genome}
        showTopBar={true}
        onContinue={openEntityViewerInterstitial}
      />
    );
  }

  const SideBarContent = isSidebarModalOpen ? (
    <EntityViewerSidebarModal />
  ) : (
    <GeneViewSidebar />
  );

  return (
    <StandardAppLayout
      mainContent={<GeneView />}
      topbarContent={<EntityViewerTopbar />}
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
  const {
    activeGenomeId,
    activeEntityId,
    genomeIdInUrl,
    genomeIdForUrl,
    entityIdInUrl,
    entityIdForUrl,
    genomeId,
    entityId,
    hasActiveGenomeIdChanged
  } = useEntityViewerIds();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!genomeIdInUrl && genomeIdForUrl) {
      // the url is /entity-viewer; but the user has already viewed some species in EntityViewer
      const newUrl = urlFor.entityViewer({
        genomeId: genomeIdForUrl,
        entityId: entityIdForUrl
      });
      navigate(newUrl, { replace: true });
    } else if (
      !hasActiveGenomeIdChanged &&
      genomeIdForUrl &&
      entityIdForUrl &&
      !entityIdInUrl
    ) {
      // the url is /entity-viewer/:genome_id; but the user has already viewed a gene
      const replacementUrl = urlFor.entityViewer({
        genomeId: genomeIdForUrl,
        entityId: entityIdForUrl
      });
      navigate(replacementUrl, { replace: true });
    }
    dispatch(
      setActiveIds({
        genomeId,
        entityId
      })
    );
  }, [
    genomeIdInUrl,
    entityIdInUrl,
    genomeId,
    entityId,
    entityIdForUrl,
    activeGenomeId,
    activeEntityId
  ]);
};

export default EntityViewer;
