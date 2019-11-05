import React from 'react';
import { render } from 'enzyme';

jest.mock('./BrowserNavBarControls', () => () => (
  <div>BrowserNavBarControls</div>
));
jest.mock('./BrowserNavBarMain', () => () => <div>BrowserNavBarControls</div>);

import { BrowserNavBar } from './BrowserNavBar';

describe('<BrowserNavBar />', () => {
  describe('rendering', () => {
    it('correctly interprets the "expanded" prop', () => {
      const contractedBar = render(<BrowserNavBar expanded={false} />);
      expect(contractedBar.hasClass('browserNavBarExpanded')).toBe(false);

      const expandedBar = render(<BrowserNavBar expanded={true} />);
      expect(expandedBar.hasClass('browserNavBarExpanded')).toBe(true);
    });
  });
});
