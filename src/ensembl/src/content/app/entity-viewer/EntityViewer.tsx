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
import ApolloClient from 'apollo-boost';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';

import { BreakpointWidth } from 'src/global/globalConfig';

import { getBreakpointWidth } from 'src/global/globalSelectors';
import { isEntityViewerSidebarOpen } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';

import { fetchGenomeData } from 'src/shared/state/genome/genomeActions';
import {
  setDataFromUrl,
  updateEnsObject,
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralActions';
import { toggleSidebar } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarActions';

import { StandardAppLayout } from 'src/shared/components/layout';
import EntityViewerAppBar from './shared/components/entity-viewer-app-bar/EntityViewerAppBar';
import EntityViewerSidebarToolstrip from './shared/components/entity-viewer-sidebar-toolstrip/EntityViewerSidebarToolstrip';
import EntityViewerTopbar from './shared/components/entity-viewer-topbar/EntityViewerTopbar';
import ExampleLinks from './components/example-links/ExampleLinks';
import GeneView from './gene-view/GeneView';
import GeneViewSideBar from './gene-view/components/gene-view-sidebar/GeneViewSideBar';
import GeneViewSidebarTabs from './gene-view/components/gene-view-sidebar-tabs/GeneViewSidebarTabs';

import { RootState } from 'src/store';
import { SidebarStatus } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarState';
import { SidebarBehaviourType } from 'src/shared/components/layout/StandardAppLayout';

import styles from './EntityViewer.scss';

type Props = {
  isSidebarOpen: boolean;
  viewportWidth: BreakpointWidth;
  setDataFromUrl: (params: EntityViewerParams) => void;
  updateEnsObject: (objectId: string) => void;
  fetchGenomeData: (genomeId: string) => void;
  toggleSidebar: (status?: SidebarStatus) => void;
};

export type EntityViewerParams = {
  genomeId?: string;
  entityId?: string;
};

const client = new ApolloClient({
  uri: 'http://hx-rke-wp-webadmin-14-worker-1.caas.ebi.ac.uk:31770',
});

const EntityViewer = (props: Props) => {
  const params: EntityViewerParams = useParams(); // NOTE: will likely cause a problem when server-side rendering
  const { genomeId, entityId } = params;

  useEffect(() => {
    props.setDataFromUrl(params);
  }, [params.genomeId, params.entityId]);

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
            sidebarContent={<GeneViewSideBar />}
            sidebarNavigation={<GeneViewSidebarTabs />}
            sidebarToolstripContent={<EntityViewerSidebarToolstrip />}
            sidebarBehaviour={SidebarBehaviourType.SLIDEOVER}
            isSidebarOpen={props.isSidebarOpen}
            onSidebarToggle={props.toggleSidebar}
            isDrawerOpen={false}
            viewportWidth={props.viewportWidth}
          />
        ) : (
          <ExampleLinks />
        )}
      </div>
    </ApolloProvider>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    isSidebarOpen: isEntityViewerSidebarOpen(state),
    viewportWidth: getBreakpointWidth(state),
  };
};

const mapDispatchToProps = {
  setDataFromUrl,
  fetchGenomeData,
  toggleSidebar,
  updateEnsObject,
};

export default connect(mapStateToProps, mapDispatchToProps)(EntityViewer);
