import React, { useState } from 'react';
import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';
import Panel from 'src/shared/components/panel/Panel';

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
  selected: styles.selectedTab,
  default: styles.defaultTab
};

const TabWrapper = () => {
  const [selectedTab, setselectedTab] = useState('Proteins');

  const onTabChange = (tab: string) => {
    setselectedTab(tab);
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

const GeneFunction = () => {
  return (
    <Panel
      header={<TabWrapper />}
      classNames={{
        panel: styles.fullWidthPanel
      }}
    >
      <div>Panel Content</div>
    </Panel>
  );
};

export default GeneFunction;
