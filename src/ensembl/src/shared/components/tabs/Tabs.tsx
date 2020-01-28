import React, { useState } from 'react';
import classNames from 'classnames';

import defaultStyles from './Tabs.scss';

export type Tab = {
  title: string;
  isDisabled?: boolean;
};

export type TabsProps = {
  tabs: Tab[];
  classNames?: {
    default?: string;
    disabled?: string;
    selected?: string;
    tabsContainer?: string;
  };
  selectedTab: string;
  selectTab: (selectedTab: string) => void;
};

export const Tabs = (props: TabsProps) => {
  const [selectedTab, setSelectedTab] = useState(props.selectedTab);

  const getTabClassNames = (tab: Tab) => {
    const defaultClassNames = classNames(
      props.classNames?.default,
      defaultStyles.tab
    );

    const disabledClassNames = classNames(
      props.classNames?.disabled,
      defaultStyles.disabled
    );

    const selectedClassNames = classNames(
      props.classNames?.selected,
      defaultStyles.selected
    );

    return classNames(defaultClassNames, {
      [disabledClassNames]: tab.isDisabled,
      [selectedClassNames]: tab.title === selectedTab
    });
  };

  const tabsContainerClassName = classNames(
    defaultStyles.tabsContainer,
    props.classNames?.tabsContainer
  );

  const onTabSelect = (tabTitle: string) => {
    setSelectedTab(tabTitle);
    props.selectTab(tabTitle);
  };

  return (
    <div className={tabsContainerClassName}>
      {Object.values(props.tabs).map((tab: Tab) => (
        <span
          className={getTabClassNames(tab)}
          key={tab.title}
          onClick={tab.isDisabled ? () => null : () => onTabSelect(tab.title)}
        >
          {tab.title}
        </span>
      ))}
    </div>
  );
};

export default Tabs;
