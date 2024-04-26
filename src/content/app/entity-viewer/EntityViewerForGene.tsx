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

import { useNavigate } from 'react-router-dom';

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

import { deleteActiveEntityIdAndSave } from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSlice';
import { toggleSidebar } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSlice';

import { StandardAppLayout } from 'src/shared/components/layout';
import EntityViewerSidebarToolstrip from './shared/components/entity-viewer-sidebar/entity-viewer-sidebar-toolstrip/EntityViewerSidebarToolstrip';
import EntityViewerSidebarModal from 'src/content/app/entity-viewer/shared/components/entity-viewer-sidebar/entity-viewer-sidebar-modal/EntityViewerSidebarModal';
import EntityViewerTopbar from './shared/components/entity-viewer-topbar/EntityViewerTopbar';
import GeneView from './gene-view/GeneView';
import GeneViewSidebar from './gene-view/components/gene-view-sidebar/GeneViewSideBar';
import GeneViewSidebarTabs from './gene-view/components/gene-view-sidebar-tabs/GeneViewSidebarTabs';
import MissingFeatureError from 'src/shared/components/error-screen/url-errors/MissingFeatureError';

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

  return (
    <StandardAppLayout
      mainContent={<GeneView />}
      topbarContent={<EntityViewerTopbar />}
      sidebarContent={
        <SidebarContent isSidebarModalOpen={isSidebarModalOpen} />
      }
      sidebarNavigation={<GeneViewSidebarTabs />}
      sidebarToolstripContent={<EntityViewerSidebarToolstrip />}
      isSidebarOpen={isSidebarOpen}
      onSidebarToggle={() => dispatch(toggleSidebar())}
      isDrawerOpen={false}
      viewportWidth={viewportWidth}
    />
  );
};

const SidebarContent = (props: { isSidebarModalOpen: boolean }) => {
  return props.isSidebarModalOpen ? (
    <EntityViewerSidebarModal />
  ) : (
    <GeneViewSidebar />
  );
};

export default EntityViewerForGene;
