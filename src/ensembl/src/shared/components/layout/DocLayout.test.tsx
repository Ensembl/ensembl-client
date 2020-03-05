import React from 'react';
import { render } from 'enzyme';

import DocLayout from './DocLayout';

import { BreakpointWidth } from 'src/global/globalConfig';

const MainContent = () => (
  <div className="mainContent">This is main content</div>
);
const SidebarContent = () => (
  <div className="sidebarContent">This is sidebar content</div>
);

const minimalProps = {
  mainContent: <MainContent />,
  sidebarContent: <SidebarContent />,
  viewportWidth: BreakpointWidth.DESKTOP
};

describe('DocLayout', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('renders the main content in the main section', () => {
      const wrapper = render(<DocLayout {...minimalProps} />);
      expect(wrapper.find('.main').find('.mainContent').length).toBe(1);
    });

    it('renders the sidebar content in the sidebar', () => {
      const wrapper = render(<DocLayout {...minimalProps} />);
      expect(wrapper.find('.sidebar').find('.sidebarContent').length).toBe(1);
    });
  });
});
