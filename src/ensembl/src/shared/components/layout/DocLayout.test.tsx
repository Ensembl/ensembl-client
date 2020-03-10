import React from 'react';
import { render } from 'enzyme';

import DocLayout from './DocLayout';

import { BreakpointWidth } from 'src/global/globalConfig';

const MainContent = () => (
  <div className="mainContent">This is main content</div>
);
const GlobalNavContent = () => (
  <div className="globalNavContent">This is global navigation</div>
);
const LocalNavContent = () => (
  <div className="localNavContent">This is local navigation</div>
);

const minimalProps = {
  mainContent: <MainContent />,
  globalNavContent: <GlobalNavContent />,
  localNavContent: <LocalNavContent />,
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

    it('renders the global navigation in the lefthand sidebar', () => {
      const wrapper = render(<DocLayout {...minimalProps} />);
      expect(wrapper.find('.globalNav').find('.globalNavContent').length).toBe(
        1
      );
    });

    it('renders the local navigation in the righthand sidebar', () => {
      const wrapper = render(<DocLayout {...minimalProps} />);
      expect(wrapper.find('.localNav').find('.localNavContent').length).toBe(1);
    });
  });
});
