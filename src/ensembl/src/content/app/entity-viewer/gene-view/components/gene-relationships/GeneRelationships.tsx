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
import { connect } from 'react-redux';

import { isEntityViewerSidebarOpen } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';
import { getEntityViewerActiveGeneRelationships } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewSelectors';
import { setActiveGeneRelationshipsTab } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewActions';

import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';
import Panel from 'src/shared/components/panel/Panel';

import { RootState } from 'src/store';
import { GeneRelationshipsTabName } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewState.ts';

import styles from './GeneRelationships.scss';

const tabsData: Tab[] = [
  { title: 'Orthologues' },
  { title: 'Gene families' },
  { title: 'Gene panels' }
];

const tabClassNames = {
  selected: styles.selectedTabName
};

type Props = {
  isSidebarOpen: boolean;
  selectedTabName: GeneRelationshipsTabName;
  changeViewMode: (tab?: string) => void;
  setActiveGeneRelationshipsTab: (tab: string) => void;
};

const GeneRelationships = (props: Props) => {
  useEffect(() => {
    props.changeViewMode(props.selectedTabName);
  }, []);

  const TabWrapper = () => {
    const onTabChange = (tab: string) => {
      props.changeViewMode(tab);
    };

    return (
      <Tabs
        tabs={tabsData}
        selectedTab={props.selectedTabName}
        classNames={tabClassNames}
        onTabChange={onTabChange}
      />
    );
  };

  return (
    <Panel
      header={<TabWrapper />}
      classNames={{
        panel: props.isSidebarOpen ? styles.narrowPanel : styles.fullWidthPanel,
        body: styles.panelBody
      }}
    >
      <div>Panel content is coming...</div>
    </Panel>
  );
};

const mapStateToProps = (state: RootState) => ({
  isSidebarOpen: isEntityViewerSidebarOpen(state),
  selectedTabName: getEntityViewerActiveGeneRelationships(state).selectedTabName
});

const mapDispatchToProps = {
  setActiveGeneRelationshipsTab
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneRelationships);
