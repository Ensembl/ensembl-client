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

import {
  defaultView,
  type ViewName
} from 'src/content/app/entity-viewer/state/transcript-view/general/transcriptViewGeneralSlice';

import Tabs from 'src/shared/components/tabs/Tabs';

import styles from './TranscriptViewTabs.module.css';

const tabsData: Array<{ title: string; view: ViewName }> = [
  { title: 'Transcript', view: defaultView },
  { title: 'Exons', view: 'exons' },
  { title: 'Transcript function', view: 'protein' }
];

const TranscriptViewTabs = ({
  activeView,
  onViewChange
}: {
  activeView: string;
  onViewChange: (view: string) => void;
}) => {
  const tabClassNames = {
    default: styles.tab,
    selected: styles.tabSelected,
    tabsContainer: styles.geneViewTabs //FIXME: Pass this as a props so that it can be styled from the parent
  };

  const handleTabChange = (tabTitle: string) => {
    const tab = tabsData.find((tab) => tab.title === tabTitle) as {
      view: string;
    };
    onViewChange(tab.view);
  };

  const selectedTab = tabsData.find((tab) => tab.view === activeView) as {
    title: string;
  };

  return (
    <Tabs
      tabs={tabsData}
      classNames={tabClassNames}
      selectedTab={selectedTab.title}
      onTabChange={handleTabChange}
    />
  );
};

export default TranscriptViewTabs;
