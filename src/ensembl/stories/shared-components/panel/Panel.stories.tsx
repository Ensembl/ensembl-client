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
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import faker from 'faker';

import Panel from 'src/shared/components/panel/Panel';
import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';

import styles from './Panel.stories.scss';

const onClose = () => {
  action('panel-closed')();
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

const TabWrapper = () => {
  const [selectedTab, setselectedTab] = useState('Proteins');

  const onTabChange = (tab: string) => {
    setselectedTab(tab);
    action('selected-tab')(tab);
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

storiesOf('Components|Shared Components/Panel', module)
  .add('default', () => (
    <div className={styles.fullPageWrapper}>
      <Panel header={'Default Panel'} onClose={onClose}>
        <div>Panel Content</div>
      </Panel>
    </div>
  ))
  .add('full-page', () => (
    <div className={styles.fullPageWrapper}>
      <Panel
        header={'Full Page Panel'}
        onClose={onClose}
        classNames={{
          panel: styles.fullPagePanel
        }}
      >
        <div>Panel Content</div>
      </Panel>
    </div>
  ))
  .add('with-tabs', () => {
    return (
      <div className={styles.fullPageWrapper}>
        <Panel
          header={<TabWrapper />}
          onClose={onClose}
          classNames={{
            panel: styles.fullPagePanel
          }}
        >
          <div>Panel Content</div>
        </Panel>
      </div>
    );
  })
  .add('long-header', () => {
    return (
      <div className={styles.fullPageWrapper}>
        <Panel header={<TabWrapper />} onClose={onClose}>
          <div>{faker.lorem.paragraphs(100)}</div>
        </Panel>
      </div>
    );
  })
  .add('long-content', () => {
    return (
      <div className={styles.fullPageWrapper}>
        <Panel
          header={<TabWrapper />}
          onClose={onClose}
          classNames={{
            panel: styles.fullPagePanel
          }}
        >
          <div>{faker.lorem.paragraphs(100)}</div>
        </Panel>
      </div>
    );
  });
