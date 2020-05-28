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
import { getEntityViewerActiveGeneFunction } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewSelectors';
import { setActiveGeneFunctionTab } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewActions';

import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';
import Panel from 'src/shared/components/panel/Panel';
import ProteinsList from '../proteins-list/ProteinsList';

import { RootState } from 'src/store';
import { GeneFunctionTabName } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewState.ts';

import styles from './GeneFunction.scss';

const tabsData: Tab[] = [
  { title: 'Proteins' },
  { title: 'Variants' },
  { title: 'Phenotypes' },
  { title: 'Gene expression' },
  { title: 'Gene ontology', isDisabled: true },
  { title: 'Gene pathways' }
];

const tabClassNames = {
  default: styles.defaultTabName,
  selected: styles.selectedTabName
};

type Props = {
  geneId: string;
  isNarrow: boolean;
  selectedTabName: GeneFunctionTabName;
  changeViewMode: (tab?: string) => void;
  setActiveGeneFunctionTab: (tab: string) => void;
};

const GeneFunction = (props: Props) => {
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

  const getCurrentTabContent = () => {
    switch (props.selectedTabName) {
      case GeneFunctionTabName.PROTEINS:
        return <ProteinsList geneId={props.geneId} />;
      default:
        return <></>;
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
