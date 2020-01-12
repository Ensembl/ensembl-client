import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import { BreakpointWidth } from 'src/global/globalConfig';

import { getBreakpointWidth } from 'src/global/globalSelectors';

import { fetchGenomeData } from 'src/shared/state/genome/genomeActions';
import { setDataFromUrl } from 'src/content/app/entity-viewer/state/entityViewerActions';

import { StandardAppLayout } from 'src/shared/components/layout';
import EntityViewerAppBar from 'src/content/app/entity-viewer/components/entity-viewer-app-bar/EntityViewerAppBar';

import styles from './EntityViewer.scss';

import { RootState } from 'src/store';

type Props = {
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

  useEffect(() => {
    props.setDataFromUrl(params);
  }, [params.genomeId, params.entityId]);

  return (
    <div className={styles.entityViewer}>
      <EntityViewerAppBar />
      <StandardAppLayout
        mainContent={<div>Main content is coming...</div>}
        sidebarContent={<div>Sidebar content is coming...</div>}
        sidebarNavigation={<div>Sidebar navigation goes here</div>}
        topbarContent={<div>Entity info summary goes here</div>}
        isSidebarOpen={true}
        onSidebarToggle={() => console.log('not now')}
        isDrawerOpen={false}
        viewportWidth={props.viewportWidth}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  viewportWidth: getBreakpointWidth(state)
});

const mapDispatchToProps = {
  setDataFromUrl,
  fetchGenomeData
};

export default connect(mapStateToProps, mapDispatchToProps)(EntityViewer);
