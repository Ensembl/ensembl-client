import React from 'react';
import { shallow } from 'enzyme';

import { BrowserNavBar } from './BrowserNavBar';
import { BrowserNavStates, ChrLocation } from '../browserState';

import styles from './BrowserNavBar.scss';

const browserStates = [...Array(6)].map(() => false);
const chrLocation: ChrLocation = ['13', 1, 114364328];
const toggleRegionEditorActive: any = jest.fn();
const toggleRegionFieldActive: any = jest.fn();

describe('<BrowserNavBar />', () => {
  test('renders with appropriate classes', () => {
    expect(
      shallow(
        <BrowserNavBar
          browserNavStates={browserStates as BrowserNavStates}
          chrLocation={chrLocation}
          genomeKaryotypes={[]}
          isTrackPanelOpened={true}
          regionEditorActive={true}
          regionFieldActive={false}
          toggleRegionEditorActive={toggleRegionEditorActive}
          toggleRegionFieldActive={toggleRegionFieldActive}
        />
      ).hasClass(styles.browserNavBarExpanded)
    ).toBe(false);

    expect(
      shallow(
        <BrowserNavBar
          browserNavStates={browserStates as BrowserNavStates}
          chrLocation={chrLocation}
          genomeKaryotypes={[]}
          isTrackPanelOpened={false}
          regionEditorActive={true}
          regionFieldActive={false}
          toggleRegionEditorActive={toggleRegionEditorActive}
          toggleRegionFieldActive={toggleRegionFieldActive}
        />
      ).hasClass(styles.browserNavBarExpanded)
    ).toBe(true);
  });
});
