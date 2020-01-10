import React from 'react';
import { connect } from 'react-redux';
import { StandardAppLayout } from 'src/shared/components/layout';

import { BreakpointWidth } from 'src/global/globalConfig';

import { getBreakpointWidth } from 'src/global/globalSelectors';

import EntityViewerAppBar from 'src/content/app/entity-viewer/components/entity-viewer-app-bar/EntityViewerAppBar';

import styles from './EntityViewer.scss';

import { RootState } from 'src/store';

type Props = {
  viewportWidth: BreakpointWidth;
};

const EntityViewer = (props: Props) => {
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

export default connect(mapStateToProps)(EntityViewer);
