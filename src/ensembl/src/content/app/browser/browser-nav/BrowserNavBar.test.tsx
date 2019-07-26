import React from 'react';
import { shallow } from 'enzyme';

import { BrowserNavBar } from './BrowserNavBar';

import { BrowserNavStates } from '../browserState';

import styles from './BrowserNavBar.scss';

const browserStates = [...Array(6)].map(() => false);

describe('<BrowserNavBar />', () => {
  test('renders with appropriate classes', () => {
    expect(
      shallow(
        <BrowserNavBar
          browserNavStates={browserStates as BrowserNavStates}
          isTrackPanelOpened={true}
        />
      ).hasClass(styles.browserNavBarExpanded)
    ).toBe(false);

    expect(
      shallow(
        <BrowserNavBar
          browserNavStates={browserStates as BrowserNavStates}
          isTrackPanelOpened={false}
        />
      ).hasClass(styles.browserNavBarExpanded)
    ).toBe(true);
  });
});
