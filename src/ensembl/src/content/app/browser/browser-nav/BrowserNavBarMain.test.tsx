import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import BrowserNavBarMain, {
  Content as BrowserNavBarMainContent
} from './BrowserNavBarMain';

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
  describe('rendering', () => {
    it('renders without errors', () => {
      expect(() => mount(<BrowserNavBarMain />)).not.toThrow();
    });
  });

  describe('behaviour', () => {
    it('renders chromosome visualization by default', () => {
      const wrapper = mount(<BrowserNavBarMain />);
      expect(wrapper.find(ChromosomeNavigator).length).toBe(1);
      expect(wrapper.find(BrowserNavBarRegionSwitcher).length).toBe(0);
    });

    it('renders RegionSwitcher when user clicks on Change', () => {
      const wrapper = mount(<BrowserNavBarMain />);
      const changeButton = wrapper.find('.contentSwitcher');
      act(() => {
        changeButton.simulate('click');
      });
      wrapper.update();
      expect(wrapper.find(ChromosomeNavigator).length).toBe(0);
      expect(wrapper.find(BrowserNavBarRegionSwitcher).length).toBe(1);
    });

    it('renders chromosome visualization when user closes RegionSwitcher', () => {
      const wrapper = mount(<BrowserNavBarMain />);
      const changeButton = wrapper.find('.contentSwitcher');
      act(() => {
        changeButton.simulate('click');
      });
      wrapper.update();

      const closeButton = wrapper.find('.contentSwitcherClose');
      act(() => {
        closeButton.simulate('click');
      });
      wrapper.update();

      expect(wrapper.find(ChromosomeNavigator).length).toBe(1);
      expect(wrapper.find(BrowserNavBarRegionSwitcher).length).toBe(0);
    });
  });
});
