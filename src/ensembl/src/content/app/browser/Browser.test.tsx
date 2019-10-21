import React from 'react';
import { MemoryRouter } from 'react-router';
import { mount } from 'enzyme';
import faker from 'faker';

import { Browser, BrowserProps, ExampleObjectLinks } from './Browser';
import BrowserImage from './browser-image/BrowserImage';
import TrackPanel from './track-panel/TrackPanel';

jest.mock('./browser-bar/BrowserBar', () => () => <div>BrowserBar</div>);
jest.mock('./browser-image/BrowserImage', () => () => <div>BrowserImage</div>);
jest.mock('./browser-nav/BrowserNavBar', () => () => <div>BrowserNavBar</div>);
jest.mock('./track-panel/TrackPanel', () => () => <div>TrackPanel</div>);
jest.mock('src/shared/components/app-bar/AppBar', () => () => (
  <div>AppBar</div>
));
jest.mock('static/browser/browser.js', () => {});

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
    allChrLocations: { [faker.lorem.words()]: ['1', 10, 5000] },
    browserActivated: false,
    browserNavOpened: false,
    browserQueryParams: {},
    chrLocation: ['1', 10, 5000],
    isDrawerOpened: false,
    isTrackPanelOpened: false,
    launchbarExpanded: false,
    exampleEnsObjects: [],
    committedSpecies: [],
    changeBrowserLocation: jest.fn(),
    changeFocusObject: jest.fn(),
    changeDrawerView: jest.fn(),
    closeDrawer: jest.fn(),
    fetchGenomeData: jest.fn(),
    replace: jest.fn(),
    toggleDrawer: jest.fn(),
    setDataFromUrlAndSave: jest.fn()
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
  });

  describe('behaviour', () => {
    test('fetches genome data when selected genome changes', () => {
      const wrapper = mountBrowserComponent({ activeGenomeId: null });
      wrapper.setProps({ activeGenomeId: faker.lorem.words() });
      expect(wrapper.props().fetchGenomeData).toHaveBeenCalledTimes(1);
    });

    test('closes drawer when clicked on genome browser area', () => {
      const wrapper = mountBrowserComponent({
        browserQueryParams: { focus: faker.lorem.words() },
        isDrawerOpened: true,
        isTrackPanelOpened: true
      });
      wrapper.find('.browserImageWrapper').simulate('click');
      expect(wrapper.props().closeDrawer).toHaveBeenCalled();
    });
  });
});
