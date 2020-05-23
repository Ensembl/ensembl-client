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

import { RootState } from 'src/store';
import { getEntityViewerActiveGeneTab } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewSelectors';
import { setActiveGeneTab } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewActions';

import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';

import styles from './GeneViewTabs.scss';

const tabsData: Tab[] = [
  { title: 'Transcripts' },
  { title: 'Gene function' },
  { title: 'Gene relationships' }
];

const DEFAULT_TAB = tabsData[0].title;

type Props = {
  selectedGeneTabName: string | null;
  setActiveGeneTab: (selectedTabName: string) => void;
};

const GeneViewTabs = (props: Props) => {
  const tabClassNames = {
    default: styles.geneTab,
    selected: styles.selectedGeneTab,
    disabled: styles.disabledGeneTab,
    tabsContainer: styles.geneViewTabs
  };

  const onTabChange = (selectedTabName: string) => {
    if (selectedTabName === props.selectedGeneTabName) {
      props.setActiveGeneTab(DEFAULT_TAB);
    } else {
      props.setActiveGeneTab(selectedTabName);
    }
  };

  return (
    <Tabs
      classNames={tabClassNames}
      tabs={tabsData}
      selectedTab={props.selectedGeneTabName || DEFAULT_TAB}
      onTabChange={onTabChange}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  selectedGeneTabName: getEntityViewerActiveGeneTab(state)
});

const mapDispatchToProps = {
  setActiveGeneTab
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneViewTabs);
