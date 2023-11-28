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
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { getSelectedGeneViewTabs } from 'src/content/app/entity-viewer/state/gene-view/view/geneViewViewSelectors';

import {
  GeneViewTabMap,
  GeneViewTabName,
  GeneRelationshipsTabName,
  View
} from 'src/content/app/entity-viewer/state/gene-view/view/geneViewViewSlice';

import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';
import Panel from 'src/shared/components/panel/Panel';
import GeneHomology from 'src/content/app/entity-viewer/gene-view/components/gene-homology/GeneHomology';

import styles from './GeneRelationships.scss';

const shouldDisableTab = (tabName: View) => {
  return tabName !== View.HOMOLOGY;
};

const tabsData = [...GeneViewTabMap.values()]
  .filter(({ primaryTab }) => primaryTab === GeneViewTabName.GENE_RELATIONSHIPS)
  .map((item) => ({
    title: item.secondaryTab,
    isDisabled: shouldDisableTab(item.view) // TODO Use real data for tab availability if it becomes available
  })) as Tab[];

const tabClassNames = {
  selected: styles.selectedTabName
};

const GeneRelationships = () => {
  const navigate = useNavigate();
  const { genomeId, entityId } = useParams() as { [key: string]: string };
  const selectedTabNameFromRedux = useSelector(getSelectedGeneViewTabs)
    .secondaryTab as GeneRelationshipsTabName;

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

    navigate(url);
  };

  // If the selectedTab is disabled or if there is no selectedtab, pick the first available tab
  const selectedTab =
    tabsData.find(
      (tab) => tab.title === selectedTabNameFromRedux && !tab.isDisabled
    ) || tabsData.find((tab) => !tab.isDisabled);
  const selectedTabName = selectedTab?.title || null;

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
      case GeneRelationshipsTabName.HOMOLOGY:
        return <GeneHomology />;
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

export default GeneRelationships;
