import React, { useState } from 'react';

import styles from './InfoButtonStrip.scss';

import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';

const tabsData: Tab[] = [
  { title: 'Transcripts' },
  { title: 'Gene function' },
  { title: 'Gene relationships' }
];

const InfoButtonStrip = () => {
  const [selectedTab, setselectedTab] = useState('Transcripts');

  const tabClassNames = {
    default: styles.defaultTabDark,
    selected:
      selectedTab === 'Transcripts'
        ? styles.selectedTabDarkSimple
        : styles.selectedTabDark,
    disabled: styles.disabledTabDark
  };

  const onTabChange = (tab: string) => {
    setselectedTab(tab);
  };

  return (
    <Tabs
      classNames={tabClassNames}
      tabs={tabsData}
      selectedTab={selectedTab}
      onTabChange={onTabChange}
    />
  );
};

export default InfoButtonStrip;
