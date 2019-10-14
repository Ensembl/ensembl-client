import React from 'react';
import { mount } from 'enzyme';

import {
  BrowserTrackConfig,
  BrowserTrackConfigProps
} from './BrowserTrackConfig';
import Checkbox from 'src/shared/components/checkbox/Checkbox';

import {
  createTrackConfigLabel,
  createTrackConfigNames,
  createCogTrackList
} from 'tests/fixtures/browser';

describe('<BrowserTrackConfig />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: BrowserTrackConfigProps = {
    applyToAll: false,
    browserCogTrackList: createCogTrackList(),
    selectedCog: 'track:gc',
    trackConfigLabel: createTrackConfigLabel(),
    trackConfigNames: createTrackConfigNames(),
    updateApplyToAll: jest.fn(),
    updateTrackConfigLabel: jest.fn(),
    updateTrackConfigNames: jest.fn(),
    onClose: jest.fn()
  };

  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(<BrowserTrackConfig {...defaultProps} />);
  });

  describe('rendering', () => {
    test('renders the all tracks checkbox', () => {
      expect(wrapper.find(Checkbox)).toHaveLength(1);
    });

    test('renders all the buttons', () => {
      expect(wrapper.find('button')).toHaveLength(6);
    });
  });

  describe('behaviour', () => {
    test('sets all tracks to be updated when the all tracks checkbox is selected', () => {
      wrapper
        .find(Checkbox)
        .props()
        .onChange(true);
      expect(wrapper.props().updateApplyToAll).toHaveBeenCalledTimes(1);
    });

    test('toggles track name when the toggle name slider is clicked', () => {
      wrapper.find('.trackConfig-trackName').simulate('click');
      expect(wrapper.props().updateTrackConfigNames).toHaveBeenCalledTimes(1);
    });

    test('toggles track label when the toggle name slider is clicked', () => {
      wrapper.find('.trackConfig-featureLabels').simulate('click');
      expect(wrapper.props().updateTrackConfigLabel).toHaveBeenCalledTimes(1);
    });
  });
});
