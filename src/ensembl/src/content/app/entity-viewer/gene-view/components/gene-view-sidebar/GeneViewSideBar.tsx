import React from 'react';
import ApolloClient from 'apollo-boost';
import { connect } from 'react-redux';
import { ApolloProvider } from '@apollo/react-hooks';

import GeneOverview from 'src/content/app/entity-viewer/gene-view/components/gene-view-sidebar/overview/GeneOverview';
import GeneExternalReferences from 'src/content/app/entity-viewer/gene-view/components/gene-view-sidebar/external-references/GeneExternalReferences';

import { getEntityViewerSidebarTabName } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';

import { RootState } from 'src/store';
import { SidebarTabName } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarState';

type Props = {
  activeTabName: SidebarTabName | null;
};

const client = new ApolloClient({
  uri: '/thoas'
});

const GeneViewSidebar = (props: Props) => {
  return (
    <ApolloProvider client={client}>
      {props.activeTabName === SidebarTabName.OVERVIEW && <GeneOverview />}
      {props.activeTabName === SidebarTabName.EXTERNAL_REFERENCES && (
        <GeneExternalReferences />
      )}
    </ApolloProvider>
  );
};

const mapStateToProps = (state: RootState) => ({
  activeTabName: getEntityViewerSidebarTabName(state)
});

export default connect(mapStateToProps)(GeneViewSidebar);
