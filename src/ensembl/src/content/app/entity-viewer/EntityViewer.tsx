import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import { BreakpointWidth } from 'src/global/globalConfig';
import * as urlHelper from 'src/shared/helpers/urlHelper';

import { getBreakpointWidth } from 'src/global/globalSelectors';
import { getExampleGenes } from 'src/shared/state/ens-object/ensObjectSelectors';
import { getEntityViewerActiveGenomeId } from 'src/content/app/entity-viewer/state/entityViewerSelectors';

import { fetchGenomeData } from 'src/shared/state/genome/genomeActions';
import { setDataFromUrl } from 'src/content/app/entity-viewer/state/entityViewerActions';

import { StandardAppLayout } from 'src/shared/components/layout';
import EntityViewerAppBar from 'src/content/app/entity-viewer/components/entity-viewer-app-bar/EntityViewerAppBar';

import styles from './EntityViewer.scss';

import { RootState } from 'src/store';
import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

type Props = {
  activeGenomeId: string | null;
  exampleGenes: EnsObject[];
  viewportWidth: BreakpointWidth;
  setDataFromUrl: (params: EntityViewerParams) => void;
  fetchGenomeData: (genomeId: string) => void;
};

export type EntityViewerParams = {
  genomeId?: string;
  entityId?: string;
};

const EntityViewer = (props: Props) => {
  const params: EntityViewerParams = useParams(); // NOTE: will likely cause a problem when server-side rendering

  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // TODO: push this bit ot state to redux soon

  useEffect(() => {
    props.setDataFromUrl(params);
  }, [params.genomeId, params.entityId]);

  return (
    <div className={styles.entityViewer}>
      <EntityViewerAppBar />
      {params.entityId ? (
        <StandardAppLayout
          mainContent={<div>Main content is coming...</div>}
          sidebarContent={<div>Sidebar content is coming...</div>}
          sidebarNavigation={<div>Sidebar navigation goes here</div>}
          topbarContent={<div>Entity info summary goes here</div>}
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
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
      <div className={styles.exampleLinks__emptyTopBar} />
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
    viewportWidth: getBreakpointWidth(state)
  };
};

const mapDispatchToProps = {
  setDataFromUrl,
  fetchGenomeData
};

export default connect(mapStateToProps, mapDispatchToProps)(EntityViewer);
