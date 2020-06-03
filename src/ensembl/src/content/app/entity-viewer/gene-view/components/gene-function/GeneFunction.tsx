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

import { isEntityViewerSidebarOpen } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';
import { getEntityViewerActiveGeneFunction } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewSelectors';
import { setActiveGeneFunctionTab } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewActions';

import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';
import Panel from 'src/shared/components/panel/Panel';
import ProteinsList from '../proteins-list/ProteinsList';

import { RootState } from 'src/store';
import { Gene } from 'src/content/app/entity-viewer/types/gene';
import { GeneFunctionTabName } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewState.ts';

import styles from './GeneFunction.scss';

// TODO: the isDisabled flags are hardcoded here since we do not have any data available.
// We need to update this logic once we have the data available
const tabsData: Tab[] = [
  { title: GeneFunctionTabName.PROTEINS },
  { title: GeneFunctionTabName.VARIANTS, isDisabled: true },
  { title: GeneFunctionTabName.PHENOTYPES, isDisabled: true },
  { title: GeneFunctionTabName.GENE_EXPRESSION, isDisabled: true },
  { title: GeneFunctionTabName.GENE_ONTOLOGY, isDisabled: true },
  { title: GeneFunctionTabName.GENE_PATHWAYS, isDisabled: true }
];

const tabClassNames = {
  default: styles.defaultTabName,
  selected: styles.selectedTabName
};

type Props = {
  geneId: string;
  gene: Gene;
  isNarrow: boolean;
  selectedTabName: GeneFunctionTabName | null;
  setActiveGeneFunctionTab: (tab: string) => void;
};

const GeneFunction = (props: Props) => {
  const {
    gene: { transcripts }
  } = props;
  let { selectedTabName } = props;

  // Disable the Proteins tab if there are no transcripts data
  // TODO: We need a better logic to disable tabs once we have the data available for other tabs
  if (!transcripts || !transcripts.length) {
    const proteinTabIndex = tabsData.findIndex(
      (tab) => tab.title === GeneFunctionTabName.PROTEINS
    );

    tabsData[proteinTabIndex].isDisabled = true;
  }

  // If the selectedTab is disabled or if there is no selectedtab, pick the first available tab
  const selectedTabIndex = tabsData.findIndex(
    (tab) => tab.title === selectedTabName
  );
  if (!selectedTabIndex || tabsData[selectedTabIndex].isDisabled) {
    const nextAvailableTab = tabsData.find((tab) => !tab.isDisabled);

    selectedTabName = (nextAvailableTab?.title as GeneFunctionTabName) || null;
  }

  const TabWrapper = () => {
    const onTabChange = (tab: string) => {
      props.setActiveGeneFunctionTab(tab);
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
      case GeneFunctionTabName.PROTEINS:
        return <ProteinsList geneId={props.geneId} />;
      default:
        return <>Data for these views will be available soon...</>;
    }
  };

  return (
    <Panel
      header={<TabWrapper />}
      classNames={{
        panel: props.isNarrow ? styles.narrowPanel : styles.fullWidthPanel,
        body: styles.panelBody
      }}
    >
      {getCurrentTabContent()}
    </Panel>
  );
};

const mapStateToProps = (state: RootState) => ({
  isNarrow: isEntityViewerSidebarOpen(state),
  selectedTabName: getEntityViewerActiveGeneFunction(state).selectedTabName
});

const mapDispatchToProps = {
  setActiveGeneFunctionTab
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneFunction);
