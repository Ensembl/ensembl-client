import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import classNames from 'classnames';

import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';

import styles from './Tabs.stories.scss';

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
    action('selected-tab')(tab);
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

storiesOf('Components|Shared Components/Tabs', module)
  .add('default', () => {
    return <div className={styles.fullPageWrapper}>{<Wrapper />}</div>;
  })
  .add('panel-header-style', () => {
    const tabClassNames = {
      default: styles.defaultTabPanel,
      selected: styles.selectedTabPanel,
      disabled: styles.disabledTabPanel,
      tabsContainer: styles.panelTabsContainer
    };

    return (
      <div className={styles.fullPageWrapper}>
        {<Wrapper classNames={tabClassNames} />}
      </div>
    );
  })
  .add('entity-viewer-style', () => {
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
        {<Wrapper classNames={tabClassNames} />}
      </div>
    );
  });
