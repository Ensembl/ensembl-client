import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';
import times from 'lodash/times';

import Tabs, { Tab, TabsProps } from './Tabs';

const onTabSelect = jest.fn();

const createTabGroup = (): Tab[] => {
  const options = times(10, () => ({
    title: faker.random.words(),
    isDisabled: faker.random.boolean()
  }));

  // Make sure we have atleast one enabled and one disabled entry
  options.push({
    title: faker.random.words(),
    isDisabled: true
  });
  options.push({
    title: faker.random.words(),
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
  selectedTab: tabsData.find((tab) => !tab.isDisabled)?.title || '',
  selectTab: onTabSelect,
  classNames: tabClassNames
};

const renderTabs = (props: TabsProps) => <Tabs {...props}></Tabs>;

describe('<Tabs />', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(renderTabs({ ...defaultProps }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('displays all the tabs passed in', () => {
    expect(wrapper.find('.tab')).toHaveLength(defaultProps.tabs.length);
  });

  it('adds respective class to the disabled tabs', () => {
    const disabledTabIndex = tabsData.findIndex((tab) => tab.isDisabled);
    expect(
      wrapper
        .find('.tab')
        .at(disabledTabIndex)
        .prop('className')
    ).toContain('disabled');
  });

  it('adds respective class to the selected tab', () => {
    const selectedTabIndex = tabsData.findIndex(
      (tab) => tab.title === defaultProps.selectedTab
    );
    expect(
      wrapper
        .find('.tab')
        .at(selectedTabIndex)
        .prop('className')
    ).toContain('selected');
  });

  it('calls the onTabSelect function when a tab is selected', () => {
    const unselectedTabIndex = tabsData.findIndex(
      (tab) => tab.title !== defaultProps.selectedTab && !tab.isDisabled
    );
    wrapper
      .find('.tab')
      .at(unselectedTabIndex)
      .simulate('click');

    expect(onTabSelect).toBeCalledWith(tabsData[unselectedTabIndex].title);
  });

  it(' does not call the onTabSelect if the tab is disabled', () => {
    const unselectedDisabledTabIndex = tabsData.findIndex(
      (tab) => tab.title !== defaultProps.selectedTab && tab.isDisabled
    );
    wrapper
      .find('.tab')
      .at(unselectedDisabledTabIndex)
      .simulate('click');

    expect(onTabSelect).not.toBeCalled();
  });

  it(' applies the passed in default className', () => {
    expect(
      wrapper
        .find('.tab')
        .first()
        .prop('className')
    ).toContain(tabClassNames.default);
  });

  it(' applies the passed in selected className', () => {
    const selectedTabIndex = tabsData.findIndex(
      (tab) => tab.title === defaultProps.selectedTab
    );
    expect(
      wrapper
        .find('.tab')
        .at(selectedTabIndex)
        .prop('className')
    ).toContain(tabClassNames.selected);
  });

  it(' applies the passed in disabled className', () => {
    const disabledTabIndex = tabsData.findIndex((tab) => tab.isDisabled);
    expect(
      wrapper
        .find('.tab')
        .at(disabledTabIndex)
        .prop('className')
    ).toContain(tabClassNames.disabled);
  });

  it(' applies the passed in tabsContainer className', () => {
    expect(wrapper.find('.tabsContainer').prop('className')).toContain(
      tabClassNames.tabsContainer
    );
  });
});
