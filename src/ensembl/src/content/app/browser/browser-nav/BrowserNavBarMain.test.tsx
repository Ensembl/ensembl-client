import React from 'react';
import { mount } from 'enzyme';

import { BrowserNavBarMain, BrowserNavBarMainProps } from './BrowserNavBarMain';

import ChromosomeNavigator from 'src/content/app/browser/chromosome-navigator/ChromosomeNavigator';
import BrowserNavBarRegionSwitcher from './BrowserNavBarRegionSwitcher';
import { BreakpointWidth } from 'src/global/globalConfig';

jest.mock(
  'src/content/app/browser/chromosome-navigator/ChromosomeNavigator',
  () => () => <div>ChromosomeNavigator</div>
);
jest.mock('./BrowserNavBarRegionSwitcher', () => () => (
  <div>BrowserNavBarRegionSwitcher</div>
));

const props: BrowserNavBarMainProps = {
  viewportWidth: BreakpointWidth.TABLET
};

describe('BrowserNavBarMain', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(<BrowserNavBarMain {...props} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('does not render chromosome visualization by default for screens smaller than laptops', () => {
    expect(wrapper.find(ChromosomeNavigator).length).toBe(0);
  });

  it('renders chromosome visualization by default for laptops or bigger screens', () => {
    wrapper.setProps({ viewportWidth: BreakpointWidth.LAPTOP });

    expect(wrapper.find(ChromosomeNavigator).length).toBe(1);
    expect(wrapper.find(BrowserNavBarRegionSwitcher).length).toBe(0);
  });

  it('renders RegionSwitcher when user clicks on Change', () => {
    wrapper.setProps({ viewportWidth: BreakpointWidth.LAPTOP });

    const changeButton = wrapper.find('.contentSwitcher');
    changeButton.simulate('click');
    expect(wrapper.find(ChromosomeNavigator).length).toBe(0);
    expect(wrapper.find(BrowserNavBarRegionSwitcher).length).toBe(1);
  });

  it('renders chromosome visualization when user closes RegionSwitcher', () => {
    wrapper.setProps({ viewportWidth: BreakpointWidth.LAPTOP });

    const changeButton = wrapper.find('.contentSwitcher');
    changeButton.simulate('click');

    const closeButton = wrapper.find('.contentSwitcherClose');
    closeButton.simulate('click');

    expect(wrapper.find(ChromosomeNavigator).length).toBe(1);
    expect(wrapper.find(BrowserNavBarRegionSwitcher).length).toBe(0);
  });
});
