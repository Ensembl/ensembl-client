import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';
import { BrowserBar, BrowserInfo, BrowserBarProps } from './BrowserBar';

import { BreakpointWidth } from 'src/global/globalConfig';

import BrowserReset from 'src/content/app/browser/browser-reset/BrowserReset';
import TrackPanelTabs from '../track-panel/track-panel-tabs/TrackPanelTabs';

import { ChrLocation } from '../browserState';
import { TrackSet } from '../track-panel/trackPanelConfig';

import { createEnsObject } from 'tests/fixtures/ens-object';

jest.mock('src/content/app/browser/browser-reset/BrowserReset', () => () => (
  <div>BrowserReset</div>
));
jest.mock('../track-panel/track-panel-tabs/TrackPanelTabs', () => () => (
  <div>BrowserReset</div>
));

describe('<BrowserBar />', () => {
  const dispatchBrowserLocation: any = jest.fn();
  const selectTrackPanelTab: any = jest.fn();
  const toggleBrowserNav: any = jest.fn();
  const toggleDrawer: any = jest.fn();

  const defaultProps = {
    activeGenomeId: faker.lorem.word(),
    breakpointWidth: BreakpointWidth.LARGE,
    browserActivated: true,
    browserNavOpened: false,
    chrLocation: ['13', 32275301, 32433493] as ChrLocation,
    actualChrLocation: ['13', 32275301, 32433493] as ChrLocation,
    defaultChrLocation: ['13', 32271473, 32437359] as ChrLocation,
    drawerOpened: false,
    ensObject: createEnsObject(),
    selectedTrackPanelTab: TrackSet.GENOMIC,
    trackPanelModalOpened: false,
    trackPanelOpened: false,
    dispatchBrowserLocation,
    selectTrackPanelTab,
    toggleBrowserNav,
    toggleDrawer,
    isDrawerOpened: false,
    isTrackPanelModalOpened: false,
    isTrackPanelOpened: false,
    closeDrawer: jest.fn(),
    selectTrackPanelTabAndSave: jest.fn(),
    toggleTrackPanel: jest.fn()
  };

  const renderBrowserBar = (props?: Partial<BrowserBarProps>) => (
    <BrowserBar {...defaultProps} {...props} />
  );

  describe('general', () => {
    let renderedBrowserBar: any;

    beforeEach(() => {
      renderedBrowserBar = mount(renderBrowserBar());
    });

    test('contains a left bar', () => {
      expect(renderedBrowserBar.find('.browserInfoLeft')).toHaveLength(1);
    });

    test('contains a right bar', () => {
      expect(renderedBrowserBar.find('.browserInfoRight')).toHaveLength(1);
    });

    test('contains BrowserReset button', () => {
      expect(renderedBrowserBar.find(BrowserReset)).toHaveLength(1);
    });
  });

  describe('behaviour', () => {
    test('shows BrowserInfo panel by default', () => {
      const renderedBrowserBar = mount(renderBrowserBar());
      expect(renderedBrowserBar.find(BrowserInfo).length).toBe(1);
    });

    test('hides BrowserInfo panel if default location is not provided', () => {
      const renderedBrowserBar = mount(
        renderBrowserBar({ defaultChrLocation: null })
      );
      expect(renderedBrowserBar.find(BrowserInfo).length).toBe(0);
    });

    test('shows TrackPanelTabs if TrackPanel is open', () => {
      const renderedBrowserBar = mount(
        renderBrowserBar({ isTrackPanelOpened: true })
      );
      expect(renderedBrowserBar.find(TrackPanelTabs).length).toBe(1);
    });

    test('shows TrackPanelTabs on a wide display even if TrackPanel is closed', () => {
      const renderedBrowserBar = mount(renderBrowserBar());
      expect(renderedBrowserBar.find(TrackPanelTabs).length).toBe(1);
    });

    test('hides TrackPanelTabs on a small display if TrackPanel is closed', () => {
      const renderedBrowserBar = mount(
        renderBrowserBar({ breakpointWidth: BreakpointWidth.MEDIUM })
      );
      expect(renderedBrowserBar.find(TrackPanelTabs).length).toBe(0);
    });
  });
});
