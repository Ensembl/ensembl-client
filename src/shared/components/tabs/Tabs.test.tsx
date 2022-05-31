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

import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';
import times from 'lodash/times';

import Tabs, { Tab } from './Tabs';

const onTabChange = jest.fn();

const createTabGroup = (): Tab[] => {
  const options = times(10, () => ({
    title: faker.datatype.uuid(),
    isDisabled: faker.datatype.boolean()
  }));

  // Make sure we have atleast one enabled and one disabled entry
  options.push({
    title: faker.datatype.uuid(),
    isDisabled: true
  });
  options.push({
    title: faker.datatype.uuid(),
    isDisabled: false
  });

  return options;
};

const tabsData = createTabGroup();

const tabClassNames = {
  selected: faker.lorem.word(),
  default: faker.lorem.word(),
  disabled: faker.lorem.word(),
  tabsContainer: faker.lorem.word()
};

const defaultProps = {
  tabs: tabsData,
  selectedTab: (tabsData.find((tab) => !tab.isDisabled) as Tab).title,
  onTabChange,
  classNames: tabClassNames
};

const renderTabs = () => render(<Tabs {...defaultProps} />);

describe('<Tabs />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('displays all the tabs passed in', () => {
    const { container } = renderTabs();
    expect(container.querySelectorAll('.tab')).toHaveLength(
      defaultProps.tabs.length
    );
  });

  it('adds respective class to the disabled tabs', () => {
    const { container } = renderTabs();
    const disabledTabIndex = tabsData.findIndex((tab) => tab.isDisabled);
    expect(
      container
        .querySelectorAll('.tab')
        [disabledTabIndex].classList.contains('disabled')
    ).toBe(true);
  });

  it('adds respective class to the selected tab', () => {
    const { container } = renderTabs();
    const selectedTabIndex = tabsData.findIndex(
      (tab) => tab.title === defaultProps.selectedTab
    );
    expect(
      container
        .querySelectorAll('.tab')
        [selectedTabIndex].classList.contains('selected')
    ).toBe(true);
  });

  it('calls the onTabChange function when a tab is selected', async () => {
    const { container } = renderTabs();
    const unselectedTabIndex = tabsData.findIndex(
      (tab) => tab.title !== defaultProps.selectedTab && !tab.isDisabled
    );
    const unselectedTab =
      container.querySelectorAll('.tab')[unselectedTabIndex];

    await userEvent.click(unselectedTab);

    expect(onTabChange).toBeCalledWith(tabsData[unselectedTabIndex].title);
  });

  it('does not call the onTabChange if the tab is disabled', async () => {
    const { container } = renderTabs();
    const unselectedDisabledTabIndex = tabsData.findIndex(
      (tab) => tab.title !== defaultProps.selectedTab && tab.isDisabled
    );
    const disabledTab =
      container.querySelectorAll('.tab')[unselectedDisabledTabIndex];

    await userEvent.click(disabledTab);

    expect(onTabChange).not.toBeCalled();
  });

  it('applies the passed in default class', () => {
    const { container } = renderTabs();
    const tab = container.querySelector('.tab');
    expect(tab?.classList.contains(tabClassNames.default)).toBe(true);
  });

  it('applies the passed in selected class', () => {
    const { container } = renderTabs();
    const selectedTabIndex = tabsData.findIndex(
      (tab) => tab.title === defaultProps.selectedTab
    );
    const selectedTab = container.querySelectorAll('.tab')[selectedTabIndex];
    expect(selectedTab.classList.contains(tabClassNames.selected)).toBe(true);
  });

  it('applies the passed in disabled class', () => {
    const { container } = renderTabs();
    const disabledTabIndex = tabsData.findIndex((tab) => tab.isDisabled);
    const disabledTab = container.querySelectorAll('.tab')[disabledTabIndex];
    expect(disabledTab.classList.contains(tabClassNames.disabled)).toBe(true);
  });

  it('applies the passed in tabsContainer class', () => {
    const { container } = renderTabs();
    const tabsContainer = container.querySelector('.tabsContainer');
    expect(tabsContainer?.classList.contains(tabClassNames.tabsContainer)).toBe(
      true
    );
  });
});
