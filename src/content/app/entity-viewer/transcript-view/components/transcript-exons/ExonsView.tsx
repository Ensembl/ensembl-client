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
import useExonsData from './useExonsData';

import ExonsTable from './exons-table/ExonsTable';
import ExonsContinuous from './exons-continuous/ExonsContinous';
import Panel from 'src/shared/components/panel/Panel';
import Tabs from 'src/shared/components/tabs/Tabs';

import styles from './ExonsView.module.css';

// const HUMAN_GENOME = 'a7335667-93e7-11ec-a39d-005056b38ce3';
// const EXAMPLE_TRANSCRIPT_ID = 'ENST00000589042.5'; // One of the main transcripts of TTN, 109,224bp long

const subviews = ['tabular', 'continuous'] as const;
const defaultSubview = subviews[0];

type Subview = (typeof subviews)[number];

const ExonsView = ({
  genomeId,
  transcriptId
}: {
  genomeId: string;
  transcriptId: string;
}) => {
  const [presentation, setPresentation] = useState<Subview>(defaultSubview);
  const { data } = useExonsData({
    genomeId,
    transcriptId
  });

  if (!data) {
    return null; // FIXME: show spinner
  }

  const onPresentationChange = (subview: Subview) => {
    setPresentation(subview);
  };

  const panelClasses = {
    body: styles.panelBody
  };

  return (
    <Panel
      header={
        <PanelHeader
          currentSubview={presentation}
          onSubviewChange={onPresentationChange}
        />
      }
      classNames={panelClasses}
    >
      {presentation === 'tabular' && (
        <ExonsTable exons={data.exons} exonsAndIntrons={data.exonsAndIntrons} />
      )}
      {presentation === 'continuous' && (
        <ExonsContinuous
          exons={data.exons}
          introns={data.introns}
          exonsAndIntrons={data.exonsAndIntrons}
        />
      )}
    </Panel>
  );
};

const tabsData: Array<{ title: string; subview: Subview }> = [
  { title: 'Tabular view', subview: 'tabular' },
  { title: 'Continuous view', subview: 'continuous' }
];

const PanelHeader = ({
  currentSubview,
  onSubviewChange
}: {
  currentSubview: Subview;
  onSubviewChange: (subview: Subview) => void;
}) => {
  const selectedTab = tabsData.find(
    (tab) => tab.subview === currentSubview
  ) as (typeof tabsData)[number];

  const onTabChange = (selectedTab: string) => {
    const selectedSubview = tabsData.find(
      (tab) => tab.title === selectedTab
    ) as (typeof tabsData)[number];
    onSubviewChange(selectedSubview.subview);
  };

  //         classNames={tabClassNames}

  return (
    <div>
      <Tabs
        tabs={tabsData}
        selectedTab={selectedTab.title}
        onTabChange={onTabChange}
      />
    </div>
  );
};

export default ExonsView;
