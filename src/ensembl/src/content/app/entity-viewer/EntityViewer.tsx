import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import { BreakpointWidth } from 'src/global/globalConfig';
import * as urlHelper from 'src/shared/helpers/urlHelper';

import { getBreakpointWidth } from 'src/global/globalSelectors';
import { getExampleGenes } from 'src/shared/state/ens-object/ensObjectSelectors';
import { getEntityViewerActiveGenomeId } from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import { isEntityViewerSidebarOpen } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';

import { fetchGenomeData } from 'src/shared/state/genome/genomeActions';
import {
  setDataFromUrl,
  updateEnsObject
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralActions';
import { toggleSidebar } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarActions';

import { StandardAppLayout } from 'src/shared/components/layout';
import EntityViewerAppBar from './shared/components/entity-viewer-app-bar/EntityViewerAppBar';
import EntityViewerSidebarToolstrip from './shared/components/entity-viewer-sidebar-toolstrip/EntityViewerSidebarToolstrip';
import EntityViewerTopbar from './shared/components/entity-viewer-topbar/EntityViewerTopbar';
import GeneView from './gene-view/GeneView';
import GeneViewSideBar from './gene-view/components/gene-view-sidebar/GeneViewSideBar';
import GeneViewSidebarTabs from './gene-view/components/gene-view-sidebar-tabs/GeneViewSidebarTabs';

import { RootState } from 'src/store';
import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';
import { SidebarStatus } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarState';

import styles from './EntityViewer.scss';

type Props = {
  activeGenomeId: string | null;
  isSidebarOpen: boolean;
  exampleGenes: EnsObject[];
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

const EntityViewer = (props: Props) => {
  const params: EntityViewerParams = useParams(); // NOTE: will likely cause a problem when server-side rendering

  useEffect(() => {
    props.setDataFromUrl(params);
  }, [params.genomeId, params.entityId]);

  return (
    <div className={styles.entityViewer}>
      <EntityViewerAppBar />
      {params.entityId ? (
        <StandardAppLayout
          mainContent={<GeneView />}
          sidebarContent={<GeneViewSideBar />}
          sidebarNavigation={<GeneViewSidebarTabs />}
          sidebarToolstripContent={<EntityViewerSidebarToolstrip />}
          topbarContent={<EntityViewerTopbar />}
          isSidebarOpen={props.isSidebarOpen}
          onSidebarToggle={props.toggleSidebar}
          isDrawerOpen={false}
          viewportWidth={props.viewportWidth}
        />
      ) : (
        <ExampleLinks {...props} />
      )}
    </div>
  );
};

const ExampleLinks = (props: Props) => {
  const links = props.exampleGenes.map((gene) => {
    const path = urlHelper.entityViewer({
      genomeId: props.activeGenomeId,
      entityId: gene.object_id
    });

    return (
      <Link key={gene.object_id} to={path}>
        <span className={styles.exampleLinks__label}>Gene</span>
        <span>{gene.label}</span>
      </Link>
    );
  });

  return (
    <div>
      <div className={styles.exampleLinks__emptyTopbar} />
      <div className={styles.exampleLinks}>{links}</div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  const exampleGenes = activeGenomeId
    ? getExampleGenes(activeGenomeId, state)
    : [];

  return {
    activeGenomeId,
    exampleGenes,
    isSidebarOpen: isEntityViewerSidebarOpen(state),
    viewportWidth: getBreakpointWidth(state)
  };
};

const mapDispatchToProps = {
  setDataFromUrl,
  fetchGenomeData,
  toggleSidebar,
  updateEnsObject
};

export default connect(mapStateToProps, mapDispatchToProps)(EntityViewer);
