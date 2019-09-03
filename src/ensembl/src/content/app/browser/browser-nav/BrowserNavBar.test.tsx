import React from 'react';
import { shallow } from 'enzyme';

import { BrowserNavBar } from './BrowserNavBar';
import { BrowserNavStates, ChrLocation } from '../browserState';

import styles from './BrowserNavBar.scss';

const browserStates = [...Array(6)].map(() => false);
const chrLocation: ChrLocation = ['13', 1, 114364328];
const toggleBrowserRegionEditorActive: any = jest.fn();
const toggleBrowserRegionFieldActive: any = jest.fn();

describe('<BrowserNavBar />', () => {
  test('renders with appropriate classes', () => {
    expect(
      shallow(
        <BrowserNavBar
          browserNavStates={browserStates as BrowserNavStates}
          browserRegionEditorActive={true}
          browserRegionFieldActive={false}
          chrLocation={chrLocation}
          genomeKaryotypes={[]}
          isTrackPanelOpened={true}
          toggleBrowserRegionEditorActive={toggleBrowserRegionEditorActive}
          toggleBrowserRegionFieldActive={toggleBrowserRegionFieldActive}
        />
      ).hasClass(styles.browserNavBarExpanded)
    ).toBe(false);

    expect(
      shallow(
        <BrowserNavBar
          browserNavStates={browserStates as BrowserNavStates}
          browserRegionEditorActive={true}
          browserRegionFieldActive={false}
          chrLocation={chrLocation}
          genomeKaryotypes={[]}
          isTrackPanelOpened={false}
          toggleBrowserRegionEditorActive={toggleBrowserRegionEditorActive}
          toggleBrowserRegionFieldActive={toggleBrowserRegionFieldActive}
        />
      ).hasClass(styles.browserNavBarExpanded)
    ).toBe(true);
  });
});
