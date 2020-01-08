import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';

import { TrackPanel, TrackPanelProps } from './TrackPanel';
import TrackPanelBar from './track-panel-bar/TrackPanelBar';
import TrackPanelList from './track-panel-list/TrackPanelList';
import TrackPanelModal from './track-panel-modal/TrackPanelModal';
import Drawer from '../drawer/Drawer';

import { createEnsObject } from 'tests/fixtures/ens-object';
import { BreakpointWidth } from 'src/global/globalConfig';

jest.mock('./track-panel-bar/TrackPanelBar', () => () => (
  <div>Track Panel</div>
));
jest.mock('./track-panel-list/TrackPanelList', () => () => (
  <div>Track Panel List</div>
));
jest.mock('./track-panel-modal/TrackPanelModal', () => () => (
  <div>Track Panel Modal</div>
));
jest.mock('../drawer/Drawer', () => () => <div>Drawer</div>);

describe('<TrackPanel />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: TrackPanelProps = {
    activeGenomeId: null,
    browserActivated: false,
    breakpointWidth: BreakpointWidth.LAPTOP,
    isDrawerOpened: false,
    activeEnsObject: null,
    isTrackPanelModalOpened: false,
    isTrackPanelOpened: true,
    toggleTrackPanel: jest.fn()
  };

  const mountTrackPanel = (props?: Partial<TrackPanelProps>) =>
    mount(<TrackPanel {...defaultProps} {...props} />);

  describe('rendering', () => {
    test('renders track panel when active genome is present', () => {
      const wrapper = mountTrackPanel({
        activeGenomeId: faker.lorem.words()
      });
      expect(wrapper.html()).not.toBe(null);
    });

    test('shows track panel only if the screen width is desktop or larger', () => {
      const wrapper = mountTrackPanel({
        breakpointWidth: BreakpointWidth.DESKTOP
      });
      expect(wrapper.props().toggleTrackPanel).toHaveBeenCalledWith(true);

      jest.resetAllMocks();

      wrapper.setProps({ breakpointWidth: BreakpointWidth.LAPTOP });
      wrapper.update();
      expect(wrapper.props().toggleTrackPanel).toHaveBeenCalledWith(false);
    });

    test('renders track panel bar and track panel list when browser is activated and active feature is selected', () => {
      const wrapper = mountTrackPanel({
        activeGenomeId: faker.lorem.words(),
        browserActivated: true,
        activeEnsObject: createEnsObject()
      });
      expect(wrapper.find(TrackPanelBar)).toHaveLength(1);
      expect(wrapper.find(TrackPanelList)).toHaveLength(1);
    });

    test('renders track panel modal view when a track panel modal is selected', () => {
      const wrapper = mountTrackPanel({
        activeGenomeId: faker.lorem.words(),
        browserActivated: true,
        activeEnsObject: createEnsObject(),
        isTrackPanelModalOpened: true
      });
      expect(wrapper.find(TrackPanelModal)).toHaveLength(1);
    });

    test('renders drawer when it is set to open', () => {
      const wrapper = mountTrackPanel({
        activeGenomeId: faker.lorem.words(),
        browserActivated: true,
        activeEnsObject: createEnsObject(),
        isDrawerOpened: true
      });
      expect(wrapper.find(Drawer)).toHaveLength(1);
    });
  });
});
