import React from 'react';
import { connect } from 'react-redux';

import Overview from 'src/content/app/entity-viewer/gene-view/components/gene-view-sidebar/overview/Overview';
import ExternalReferences from 'src/content/app/entity-viewer/gene-view/components/gene-view-sidebar/external-references/ExternalReferences';

import { getEntityViewerSidebarTabName } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';

import { RootState } from 'src/store';
import { SidebarTabName } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarState';

type Props = {
  activeTabName: SidebarTabName | null;
};

const GeneViewSidebar = (props: Props) => {
  if (props.activeTabName === SidebarTabName.OVERVIEW) {
    return <Overview />;
  } else if (props.activeTabName === SidebarTabName.EXTERNAL_REFERENCES) {
    return <ExternalReferences />;
  }

  return null;
};

const mapStateToProps = (state: RootState) => ({
  activeTabName: getEntityViewerSidebarTabName(state)
});

export default connect(mapStateToProps)(GeneViewSidebar);
