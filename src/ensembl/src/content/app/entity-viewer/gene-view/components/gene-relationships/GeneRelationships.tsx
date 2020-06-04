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

// TODO: the isDisabled flags are hardcoded here since we do not have any data available.
// We need to update this logic once we have the data available
const tabsData: Tab[] = [
  { title: GeneRelationshipsTabName.ORTHOLOGUES, isDisabled: true },
  { title: GeneRelationshipsTabName.PARALOGUES, isDisabled: true },
  { title: GeneRelationshipsTabName.GENE_FAMILIES, isDisabled: true },
  { title: GeneRelationshipsTabName.GENE_CLUSTERS, isDisabled: true },
  { title: GeneRelationshipsTabName.GENE_PANELS, isDisabled: true },
  { title: GeneRelationshipsTabName.GENE_NEIGHBOUTHOOD, isDisabled: true },
  { title: GeneRelationshipsTabName.GENE_SIMILARITY, isDisabled: true }
];

const tabClassNames = {
  selected: styles.selectedTabName
};

type Props = {
  isSidebarOpen: boolean;
  selectedTabName: GeneRelationshipsTabName | null;
  changeViewMode: (tab?: string) => void;
  setActiveGeneRelationshipsTab: (tab: string) => void;
};

const GeneRelationships = (props: Props) => {
  let { selectedTabName } = props;

  useEffect(() => {
    props.changeViewMode(selectedTabName);
  }, []);

  // If the selectedTab is disabled or if there is no selectedtab, pick the first available tab
  const selectedTabIndex = tabsData.findIndex(
    (tab) => tab.title === selectedTabName
  );
  if (!selectedTabIndex || tabsData[selectedTabIndex].isDisabled) {
    const nextAvailableTab = tabsData.find((tab) => !tab.isDisabled);

    selectedTabName =
      (nextAvailableTab?.title as GeneRelationshipsTabName) || null;
  }

  const TabWrapper = () => {
    const onTabChange = (tab: string) => {
      props.changeViewMode(tab);
    };

    return (
      <Tabs
        tabs={tabsData}
        selectedTab={selectedTabName}
        classNames={tabClassNames}
        onTabChange={onTabChange}
      />
    );
  };

  const getCurrentTabContent = () => {
    switch (selectedTabName) {
      case GeneRelationshipsTabName.GENE_FAMILIES:
        return <>Gene families data</>;
      default:
        return <>Data for these views will be available soon...</>;
    }
  };

  return (
    <Panel
      header={<TabWrapper />}
      classNames={{
        panel: props.isSidebarOpen ? styles.narrowPanel : styles.fullWidthPanel,
        body: styles.panelBody
      }}
    >
      {getCurrentTabContent()}
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
