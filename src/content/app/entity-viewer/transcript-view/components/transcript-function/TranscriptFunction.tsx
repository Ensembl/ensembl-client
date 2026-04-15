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

import noop from 'lodash/noop';

import Tabs, { type Tab } from 'src/shared/components/tabs/Tabs';
import Panel from 'src/shared/components/panel/Panel';

import styles from './TranscriptFunction.module.css';

const tabsData: Tab[] = [
  { title: 'Protein' },
  { title: 'Variants', isDisabled: true },
  { title: 'Phenotypes', isDisabled: true }
];

const tabClassNames = {
  default: styles.tab,
  selected: styles.selectedTab,
  tabsContainer: styles.tabsContainer
};

const TranscriptFunction = () => {
  return (
    <Panel
      header={<TabWrapper />}
      classNames={{
        panel: styles.panel,
        header: styles.header,
        body: styles.panelBody
      }}
    >
      Protein view
    </Panel>
  );
};

const TabWrapper = () => {
  return (
    <Tabs
      tabs={tabsData}
      selectedTab={tabsData[0].title}
      classNames={tabClassNames}
      onTabChange={noop}
    />
  );
};

export default TranscriptFunction;
