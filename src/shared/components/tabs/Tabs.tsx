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

import classNames from 'classnames';
import noop from 'lodash/noop';

import styles from './Tabs.module.css';

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
  selectedTab: string | null;
  onTabChange: (selectedTab: string) => void;
};

export const Tabs = (props: TabsProps) => {
  const getTabClassNames = (tab: Tab) => {
    const defaultClassNames = classNames(styles.tab, props.classNames?.default);

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
      [selectedClassNames]: !tab.isDisabled && tab.title === props.selectedTab
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
