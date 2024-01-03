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

import React, { useState } from 'react';
import classNames from 'classnames';

import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';

import styles from './Tabs.stories.module.css';

type DefaultArgs = {
  onTabChange: (...args: any) => void;
};

const tabsData: Tab[] = [
  { title: 'Proteins' },
  { title: 'Variants' },
  { title: 'Phenotypes' },
  { title: 'Gene expression' },
  { title: 'Gene ontology', isDisabled: true },
  { title: 'Gene pathways' }
];

const Wrapper = (props: any) => {
  const [selectedTab, setselectedTab] = useState('Proteins');

  const onTabChange = (tab: string) => {
    setselectedTab(tab);
    props.onTabChange(tab);
  };

  return (
    <Tabs
      {...props}
      tabs={tabsData}
      selectedTab={selectedTab}
      onTabChange={onTabChange}
    ></Tabs>
  );
};

export const DefaultTabsStory = (args: DefaultArgs) => (
  <div className={styles.fullPageWrapper}>{<Wrapper {...args} />}</div>
);

DefaultTabsStory.storyName = 'default';

export const PanelHeaderTabsStory = (args: DefaultArgs) => {
  const tabClassNames = {
    default: styles.defaultTabPanel,
    selected: styles.selectedTabPanel,
    disabled: styles.disabledTabPanel,
    tabsContainer: styles.panelTabsContainer
  };

  return (
    <div className={styles.fullPageWrapper}>
      {<Wrapper classNames={tabClassNames} {...args} />}
    </div>
  );
};

PanelHeaderTabsStory.storyName = 'panel-header style';

export const EntityViewerTabsStory = (args: DefaultArgs) => {
  const tabClassNames = {
    default: styles.defaultTabDark,
    selected: styles.selectedTabDark,
    disabled: styles.disabledTabDark
  };

  const wrapperClassNames = classNames(
    styles.fullPageWrapper,
    styles.fullPageWrapperDark
  );
  return (
    <div className={wrapperClassNames}>
      {<Wrapper classNames={tabClassNames} {...args} />}
    </div>
  );
};

EntityViewerTabsStory.storyName = 'entity-viewer style';

export default {
  title: 'Components/Shared Components/Tabs',
  argTypes: { onTabChange: { action: 'tab changed' } }
};
