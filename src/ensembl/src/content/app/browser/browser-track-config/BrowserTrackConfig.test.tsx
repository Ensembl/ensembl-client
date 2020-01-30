import React from 'react';
import { mount } from 'enzyme';

import {
  BrowserTrackConfig,
  BrowserTrackConfigProps
} from './BrowserTrackConfig';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import SlideToggle from 'src/shared/components/slide-toggle/SlideToggle';

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

  describe('behaviour', () => {
    test('sets all tracks to be updated when the all tracks checkbox is selected', () => {
      wrapper
        .find(Checkbox)
        .props()
        .onChange(true);
      expect(wrapper.props().updateApplyToAll).toHaveBeenCalledTimes(1);
    });

    test('passes updateTrackConfigNames to track name toggler', () => {
      const toggle = wrapper
        .find('label')
        .filterWhere((wrapper: any) => wrapper.text() === 'Track name')
        .parents()
        .first() // <- enzyme's .parent method doesnt seem to be reliably working for mount
        .find(SlideToggle);
      toggle.prop('onChange')(true);
      expect(defaultProps.updateTrackConfigNames).toHaveBeenCalledTimes(1);
      expect(defaultProps.updateTrackConfigNames).toHaveBeenCalledWith(
        defaultProps.selectedCog,
        false
      );
    });

    test('toggles track label when the toggle name slider is clicked', () => {
      const toggle = wrapper
        .find('label')
        .filterWhere((wrapper: any) => wrapper.text() === 'Feature labels')
        .parents()
        .first() // <- enzyme's .parent method doesnt seem to be reliably working for mount
        .find(SlideToggle);
      toggle.prop('onChange')(true);
      expect(defaultProps.updateTrackConfigLabel).toHaveBeenCalledTimes(1);
      expect(defaultProps.updateTrackConfigLabel).toHaveBeenCalledWith(
        defaultProps.selectedCog,
        false
      );
    });
  });
});
