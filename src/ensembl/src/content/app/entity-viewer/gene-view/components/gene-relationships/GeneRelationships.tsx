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

import React from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { push, Push } from 'connected-react-router';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { isEntityViewerSidebarOpen } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';
import { getSelectedGeneViewTabs } from 'src/content/app/entity-viewer/state/gene-view/view/geneViewViewSelectors';

import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';
import Panel from 'src/shared/components/panel/Panel';

import { RootState } from 'src/store';
import {
  GeneViewTabMap,
  GeneViewTabName,
  GeneRelationshipsTabName
} from 'src/content/app/entity-viewer/state/gene-view/view/geneViewViewSlice';

import styles from './GeneRelationships.scss';

// TODO: the isDisabled flags are hardcoded here since we do not have any data available.
// We need to update this logic once we have the data available
const tabsData = [...GeneViewTabMap.values()]
  .filter(({ primaryTab }) => primaryTab === GeneViewTabName.GENE_RELATIONSHIPS)
  .map((item) => ({
    title: item.secondaryTab,
    isDisabled: true // TODO FIXME (Use real data when available)
  })) as Tab[];

const tabClassNames = {
  selected: styles.selectedTabName
};

type Props = {
  isSidebarOpen: boolean;
  selectedTabName: GeneRelationshipsTabName | null;
  push: Push;
};

const GeneRelationships = (props: Props) => {
  const { genomeId, entityId } = useParams() as { [key: string]: string };
  let { selectedTabName } = props;

  const changeTab = (tab: string) => {
    const match = [...GeneViewTabMap.entries()].find(
      ([, { secondaryTab }]) => secondaryTab === tab
    );
    if (!match) {
      return;
    }
    const [view] = match;
    const url = urlFor.entityViewer({
      genomeId,
      entityId,
      view
    });
    props.push(url);
  };

  // If the selectedTab is disabled or if there is no selectedtab, pick the first available tab
  const selectedTabIndex = tabsData.findIndex(
    (tab) => tab.title === selectedTabName
  );

  if (selectedTabIndex === -1 || tabsData[selectedTabIndex].isDisabled) {
    const nextAvailableTab = tabsData.find((tab) => !tab.isDisabled);

    selectedTabName =
      (nextAvailableTab?.title as GeneRelationshipsTabName) || null;
  }

  const TabWrapper = () => {
    return (
      <Tabs
        tabs={tabsData}
        selectedTab={selectedTabName}
        classNames={tabClassNames}
        onTabChange={changeTab}
      />
    );
  };

  const getCurrentTabContent = () => {
    switch (selectedTabName) {
      case GeneRelationshipsTabName.GENE_FAMILIES:
        return <>Gene families data</>;
      default:
        return <>No data</>;
    }
  };

  return (
    <Panel
      header={<TabWrapper />}
      classNames={{
        panel: styles.panel,
        body: styles.panelBody
      }}
    >
      {getCurrentTabContent()}
    </Panel>
  );
};

const mapStateToProps = (state: RootState) => ({
  isSidebarOpen: isEntityViewerSidebarOpen(state),
  selectedTabName: getSelectedGeneViewTabs(state)
    .secondaryTab as GeneRelationshipsTabName
});

const mapDispatchToProps = {
  push
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneRelationships);
