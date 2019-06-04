import React from 'react';
import { shallow } from 'enzyme';

import { LaunchbarContent } from './Launchbar';

import { createSelectedSpecies } from 'tests/fixtures/selected-species';

const defaultProps = {
  launchbarExpanded: true,
  committedSpecies: []
};

describe('<LaunchbarContent />', () => {
  it('disables Genome Browser button when there are no committed species', () => {
    const shallowWrapper = shallow(<LaunchbarContent {...defaultProps} />);
    const genomeBrowserButton = shallowWrapper.findWhere(
      (wrapper) => wrapper.prop('app') === 'browser'
    );

    expect(genomeBrowserButton.prop('enabled')).toBe(false);
  });

  it('enables Genome Browser button when there are committed species', () => {
    const props = {
      ...defaultProps,
      committedSpecies: [createSelectedSpecies()]
    };
    const shallowWrapper = shallow(<LaunchbarContent {...props} />);
    const genomeBrowserButton = shallowWrapper.findWhere(
      (wrapper) => wrapper.prop('app') === 'browser'
    );

    expect(genomeBrowserButton.prop('enabled')).toBe(true);
  });
});
