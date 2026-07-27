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

import { useState } from 'react';
import { faker } from '@faker-js/faker';

import {
  Panel,
  PanelHeader,
  PanelBody
} from 'src/shared/components/panel/Panel';
import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';

import styles from './Panel.stories.module.css';

type DefaultArgs = {
  onClose: (...args: any) => void;
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

const tabClassNames = {
  selected: styles.selectedTab,
  default: styles.defaultTab
};

const TabWrapper = (args: DefaultArgs) => {
  const [selectedTab, setSelectedTab] = useState('Proteins');

  const onTabChange = (tab: string) => {
    setSelectedTab(tab);
    args.onTabChange(tab);
  };

  return (
    <Tabs
      tabs={tabsData}
      selectedTab={selectedTab}
      classNames={tabClassNames}
      onTabChange={onTabChange}
    />
  );
};

export const DefaultPanelStory = () => (
  <div className={styles.fullPageWrapper}>
    <Panel>
      <PanelHeader>Default Panel</PanelHeader>
      <PanelBody>
        <div>Panel Content</div>
      </PanelBody>
    </Panel>
  </div>
);

DefaultPanelStory.storyName = 'default';

export const PanelWithTabsStory = (args: DefaultArgs) => (
  <div className={styles.fullPageWrapper}>
    <Panel>
      <PanelHeader>
        <TabWrapper {...args} />
      </PanelHeader>
      <PanelBody>
        <div>Panel Content</div>
      </PanelBody>
    </Panel>
  </div>
);

PanelWithTabsStory.storyName = 'with tabs';

export const PanelWithLongContentStory = (args: DefaultArgs) => (
  <div className={styles.fullPageWrapper}>
    <Panel>
      <PanelHeader>
        <TabWrapper {...args} />
      </PanelHeader>
      <PanelBody>
        <div className={styles.preWrap}>{faker.lorem.paragraphs(100)}</div>
      </PanelBody>
    </Panel>
  </div>
);

PanelWithLongContentStory.storyName = 'long content';

export default {
  title: 'Components/Shared Components/Panel',
  argTypes: {
    onClose: { action: 'closed' },
    onTabChange: { action: 'tab changed' }
  }
};
