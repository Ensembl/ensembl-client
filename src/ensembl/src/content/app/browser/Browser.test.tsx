import React from 'react';
import { MemoryRouter } from 'react-router';
import { mount } from 'enzyme';
import faker from 'faker';

import { BreakpointWidth } from 'src/global/globalConfig';

import { Browser, BrowserProps, ExampleObjectLinks } from './Browser';
import BrowserImage from './browser-image/BrowserImage';
import TrackPanel from './track-panel/TrackPanel';
import BrowserNavBar from './browser-nav/BrowserNavBar';

import { createChrLocationValues } from 'tests/fixtures/browser';

jest.mock('./browser-bar/BrowserBar', () => () => <div>BrowserBar</div>);
jest.mock('./browser-image/BrowserImage', () => () => <div>BrowserImage</div>);
jest.mock('./browser-nav/BrowserNavBar', () => () => <div>BrowserNavBar</div>);
jest.mock('./track-panel/TrackPanel', () => () => <div>TrackPanel</div>);
jest.mock('./browser-app-bar/BrowserAppBar', () => () => (
  <div>BrowserAppBar</div>
));
jest.mock('./track-panel/track-panel-bar/TrackPanelBar', () => () => (
  <div>TrackPanelBar</div>
));
jest.mock('./track-panel/track-panel-tabs/TrackPanelTabs', () => () => (
  <div>TrackPanelTabs</div>
));
jest.mock('./drawer/Drawer', () => () => <div>Drawer</div>);
jest.mock('ensembl-genome-browser', () => {
  return;
});

describe('<Browser />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: BrowserProps = {
    activeGenomeId: faker.lorem.words(),
    activeEnsObjectId: faker.lorem.words(),
    allActiveEnsObjectIds: {
      [faker.lorem.words()]: faker.lorem.words()
    },
    allChrLocations: {
      [faker.lorem.words()]: createChrLocationValues().tupleValue
    },
    browserActivated: false,
    browserNavOpened: false,
    browserQueryParams: {},
    chrLocation: createChrLocationValues().tupleValue,
    isDrawerOpened: false,
    isTrackPanelOpened: false,
    exampleEnsObjects: [],
    committedSpecies: [],
    changeBrowserLocation: jest.fn(),
    changeFocusObject: jest.fn(),
    restoreBrowserTrackStates: jest.fn(),
    fetchGenomeData: jest.fn(),
    replace: jest.fn(),
    toggleTrackPanel: jest.fn(),
    toggleDrawer: jest.fn(),
    setActiveComponentId: jest.fn(),
    setDataFromUrlAndSave: jest.fn(),
    viewportWidth: BreakpointWidth.DESKTOP
  };

  const wrappingComponent = (props: any) => (
    <MemoryRouter>{props.children}</MemoryRouter>
  );

  const mountBrowserComponent = (props?: Partial<BrowserProps>) =>
    mount(<Browser {...defaultProps} {...props} />, { wrappingComponent });

  describe('rendering', () => {
    test('does not render when no activeGenomeId', () => {
      const wrapper = mountBrowserComponent({ activeGenomeId: null });
      expect(wrapper.html()).toBe(null);
    });

    test('renders links to example objects only if there is no selected focus feature', () => {
      const wrapper = mountBrowserComponent();
      expect(wrapper.find(ExampleObjectLinks)).toHaveLength(1);

      wrapper.setProps({
        browserQueryParams: {
          focus: faker.lorem.words()
        }
      });
      expect(wrapper.find(ExampleObjectLinks)).toHaveLength(0);
    });

    test('renders the genome browser and track panel only when there is a selected focus feature', () => {
      const wrapper = mountBrowserComponent();

      expect(wrapper.find(BrowserImage)).toHaveLength(0);
      expect(wrapper.find(TrackPanel)).toHaveLength(0);

      wrapper.setProps({
        browserQueryParams: { focus: faker.lorem.words() }
      });

      expect(wrapper.find(BrowserImage)).toHaveLength(1);
      expect(wrapper.find(TrackPanel)).toHaveLength(1);
    });

    describe('BrowserNavBar', () => {
      const props = {
        ...defaultProps,
        browserActivated: true,
        browserQueryParams: { focus: 'foo' }
      };

      it('is rendered when props.browserNavOpened is true', () => {
        const wrapper = mountBrowserComponent(props);
        expect(wrapper.find(BrowserNavBar).length).toBe(0);

        wrapper.setProps({ browserNavOpened: true });
        expect(wrapper.find(BrowserNavBar).length).toBe(1);
      });

      it('is not rendered if drawer is opened', () => {
        const wrapper = mountBrowserComponent({
          ...props,
          browserNavOpened: true
        });
        expect(wrapper.find(BrowserNavBar).length).toBe(1);

        wrapper.setProps({ isDrawerOpened: true });
        expect(wrapper.find(BrowserNavBar).length).toBe(0);
      });
    });
  });

  describe('behaviour', () => {
    test('fetches genome data when selected genome changes', () => {
      const wrapper = mountBrowserComponent({ activeGenomeId: null });
      expect(wrapper.props().fetchGenomeData).toHaveBeenCalledTimes(0);

      wrapper.setProps({ activeGenomeId: faker.lorem.words() });
      expect(wrapper.props().fetchGenomeData).toHaveBeenCalledTimes(1);

      wrapper.setProps({ activeGenomeId: faker.lorem.words() });
      expect(wrapper.props().fetchGenomeData).toHaveBeenCalledTimes(2);
    });
  });
});
