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
import { ApolloProvider } from '@apollo/client';
import { useSelector, useDispatch } from 'react-redux';
import { replace } from 'connected-react-router';
import { useParams } from 'react-router-dom';

import { client } from 'src/gql-client';
import * as urlFor from 'src/shared/helpers/urlHelper';
import { buildFocusIdForUrl } from 'src/shared/state/ens-object/ensObjectHelpers';

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
import ExampleLinks from './components/example-links/ExampleLinks';
import GeneView from './gene-view/GeneView';
import GeneViewSidebar from './gene-view/components/gene-view-sidebar/GeneViewSideBar';
import GeneViewSidebarTabs from './gene-view/components/gene-view-sidebar-tabs/GeneViewSidebarTabs';

import styles from './EntityViewer.scss';

export type EntityViewerParams = {
  genomeId?: string;
  entityId?: string;
};

const EntityViewer = () => {
  const activeGenomeId = useSelector(getEntityViewerActiveGenomeId);
  const isSidebarOpen = useSelector(isEntityViewerSidebarOpen);
  const viewportWidth = useSelector(getBreakpointWidth);

  const dispatch = useDispatch();

  useEntityViewerRouting();

  useEffect(() => {
    if (activeGenomeId) {
      dispatch(initializeSidebar(activeGenomeId));
    }
  }, [activeGenomeId]);

  const isSidebarModalOpen = Boolean(
    useSelector(getEntityViewerSidebarModalView)
  );

  const params: EntityViewerParams = useParams();
  const { genomeId, entityId } = params;

  const SideBarContent = isSidebarModalOpen ? (
    <EntityViewerSidebarModal />
  ) : (
    <GeneViewSidebar />
  );

  return (
    <ApolloProvider client={client}>
      <div className={styles.entityViewer}>
        <EntityViewerAppBar />
        {genomeId && entityId ? (
          <StandardAppLayout
            mainContent={<GeneView />}
            topbarContent={
              <EntityViewerTopbar genomeId={genomeId} entityId={entityId} />
            }
            sidebarContent={SideBarContent}
            sidebarNavigation={<GeneViewSidebarTabs />}
            sidebarToolstripContent={<EntityViewerSidebarToolstrip />}
            isSidebarOpen={isSidebarOpen}
            onSidebarToggle={() => dispatch(toggleSidebar())}
            isDrawerOpen={false}
            viewportWidth={viewportWidth}
          />
        ) : (
          <ExampleLinks />
        )}
      </div>
    </ApolloProvider>
  );
};

const useEntityViewerRouting = () => {
  const activeGenomeId = useSelector(getEntityViewerActiveGenomeId);
  const activeEntityId = useSelector(getEntityViewerActiveEntityId);

  const dispatch = useDispatch();

  const params: EntityViewerParams = useParams();
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
      dispatch(replace(newUrl));
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
      dispatch(replace(replacementUrl));
    }
    dispatch(setDataFromUrl(params));
  }, [params.genomeId, params.entityId, activeGenomeId, activeEntityId]);
};

export default EntityViewer;
