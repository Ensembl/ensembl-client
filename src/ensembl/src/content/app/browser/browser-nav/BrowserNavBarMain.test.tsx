import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import BrowserNavBarMain from './BrowserNavBarMain';

import ChromosomeNavigator from 'src/content/app/browser/chromosome-navigator/ChromosomeNavigator';
import BrowserNavBarRegionSwitcher from './BrowserNavBarRegionSwitcher';

jest.mock(
  'src/content/app/browser/chromosome-navigator/ChromosomeNavigator',
  () => () => <div>ChromosomeNavigator</div>
);
jest.mock('./BrowserNavBarRegionSwitcher', () => () => (
  <div>BrowserNavBarRegionSwitcher</div>
));

describe('BrowserNavBarMain', () => {
  it('renders chromosome visualization by default', () => {
    const wrapper = mount(<BrowserNavBarMain />);
    expect(wrapper.find(ChromosomeNavigator).length).toBe(1);
    expect(wrapper.find(BrowserNavBarRegionSwitcher).length).toBe(0);
  });

  it('renders RegionSwitcher when user clicks on Change', () => {
    const wrapper = mount(<BrowserNavBarMain />);
    const changeButton = wrapper.find('.contentSwitcher');
    changeButton.simulate('click');
    expect(wrapper.find(ChromosomeNavigator).length).toBe(0);
    expect(wrapper.find(BrowserNavBarRegionSwitcher).length).toBe(1);
  });

  it('renders chromosome visualization when user closes RegionSwitcher', () => {
    const wrapper = mount(<BrowserNavBarMain />);
    const changeButton = wrapper.find('.contentSwitcher');
    changeButton.simulate('click');

    const closeButton = wrapper.find('.contentSwitcherClose');
    closeButton.simulate('click');

    expect(wrapper.find(ChromosomeNavigator).length).toBe(1);
    expect(wrapper.find(BrowserNavBarRegionSwitcher).length).toBe(0);
  });
});
