import React from 'react';
import { mount, render } from 'enzyme';

import StandardAppLayout from './StandardAppLayout';

const MainContent = () => (
  <div className="mainContent">This is main content</div>
);
const SidebarContent = () => (
  <div className="sidebarContent">This is sidebar content</div>
);
const TopbarContent = () => (
  <div className="topbarContent">This is topbar content</div>
);

const defaultProps = {
  mainContent: <MainContent />,
  sidebarContent: <SidebarContent />,
  topbarContent: <TopbarContent />
};

describe('StandardAppLayout', () => {
  describe('rendering', () => {
    it('renders the main content in the main section', () => {
      const wrapper = render(<StandardAppLayout {...defaultProps} />);
      expect(wrapper.find('.main').find('.mainContent').length).toBe(1);
    });

    it('renders the top bar content in the top bar', () => {
      const wrapper = render(<StandardAppLayout {...defaultProps} />);
      expect(wrapper.find('.topBar').find('.topbarContent').length).toBe(1);
    });

    it('renders the sidebar content in the sidebar', () => {
      const wrapper = render(<StandardAppLayout {...defaultProps} />);
      expect(wrapper.find('.sideBar').find('.sidebarContent').length).toBe(1);
    });
  });
});
