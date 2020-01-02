import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';

import { TrackPanel, TrackPanelProps } from './TrackPanel';
import TrackPanelList from './track-panel-list/TrackPanelList';
import TrackPanelModal from './track-panel-modal/TrackPanelModal';

import { createEnsObject } from 'tests/fixtures/ens-object';

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
    activeEnsObject: null,
    isTrackPanelModalOpened: false
  };

  const mountTrackPanel = (props?: Partial<TrackPanelProps>) =>
    mount(<TrackPanel {...defaultProps} {...props} />);

  describe('rendering', () => {
    test('does not render anything when not all rendering requirements are satisfied', () => {
      // defaultProps are insufficient for rendering anything useful
      // TODO: in the future, it might be a good idea to at least render a spinner here
      const wrapper = mountTrackPanel();
      expect(wrapper.html()).toBe(null);
    });

    test('renders TrackPanelList when necessary requirements are satisfied', () => {
      const wrapper = mountTrackPanel({
        browserActivated: true,
        activeEnsObject: createEnsObject(),
        activeGenomeId: faker.lorem.words()
      });
      expect(wrapper.find(TrackPanelList).length).toBe(1);
    });

    test('renders track panel modal when necessary requirements are satisfied', () => {
      const wrapper = mountTrackPanel({
        activeGenomeId: faker.lorem.words(),
        browserActivated: true,
        activeEnsObject: createEnsObject(),
        isTrackPanelModalOpened: true
      });
      expect(wrapper.find(TrackPanelModal)).toHaveLength(1);
    });
  });
});
