import React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';

import styles from './Tabs.scss';

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
  onTabChange: (selectedTab: string) => void;
};

export const Tabs = (props: TabsProps) => {
  const getTabClassNames = (tab: Tab) => {
    const defaultClassNames = classNames(props.classNames?.default, styles.tab);

    const disabledClassNames = classNames(
      styles.disabled,
      props.classNames?.disabled
    );

    const selectedClassNames = classNames(
      styles.selected,
      props.classNames?.selected
    );

    return classNames(defaultClassNames, {
      [disabledClassNames]: tab.isDisabled,
      [selectedClassNames]: tab.title === props.selectedTab
    });
  };

  const tabsContainerClassName = classNames(
    styles.tabsContainer,
    props.classNames?.tabsContainer
  );

  const onTabSelect = (tabTitle: string) => {
    props.onTabChange(tabTitle);
  };

  return (
    <div className={tabsContainerClassName}>
      {Object.values(props.tabs).map((tab: Tab) => (
        <span
          className={getTabClassNames(tab)}
          key={tab.title}
          onClick={tab.isDisabled ? noop : () => onTabSelect(tab.title)}
        >
          {tab.title}
        </span>
      ))}
    </div>
  );
};

export default Tabs;
