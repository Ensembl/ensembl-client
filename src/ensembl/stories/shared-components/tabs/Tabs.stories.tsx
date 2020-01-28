import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import classNames from 'classnames';

import Tabs, { TabsProps, Tab } from 'src/shared/components/tabs/Tabs';

import styles from './Tabs.stories.scss';

const tabsData: Tab[] = [
  { title: 'Proteins' },
  { title: 'Variants' },
  { title: 'Phenotypes' },
  { title: 'Gene expression' },
  { title: 'Gene ontology', isDisabled: true },
  { title: 'Gene pathways' }
];

const defaultProps = {
  tabs: tabsData,
  selectedTab: 'Proteins',
  selectTab: (tab: string) => action('selected-tab')(tab)
};
const renderTabs = (props: TabsProps) => {
  return <Tabs {...props}></Tabs>;
};

storiesOf('Components|Shared Components/Tabs', module)
  .add('default', () => {
    return (
      <div className={styles.fullPageWrapper}>{renderTabs(defaultProps)}</div>
    );
  })
  .add('panel-header', () => {
    const tabClassNames = {
      default: styles.defaultTabPanel,
      selected: styles.selectedTabPanel,
      disabled: styles.disabledTabPanel,
      tabsContainer: styles.panelTabsContainer
    };

    return (
      <div className={styles.fullPageWrapper}>
        {renderTabs({ ...defaultProps, classNames: tabClassNames })}
      </div>
    );
  })
  .add('entity-viewer', () => {
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
        {renderTabs({ ...defaultProps, classNames: tabClassNames })}
      </div>
    );
  });
