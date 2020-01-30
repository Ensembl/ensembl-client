import React from 'react';
import { mount } from 'enzyme';

import Launchbar from './Launchbar';

import { createSelectedSpecies } from 'tests/fixtures/selected-species';

jest.mock('./LaunchbarButton', () => () => <div>Launchbar Button</div>);

const defaultProps = {
  launchbarExpanded: true,
  committedSpecies: []
};

describe('<Launchbar />', () => {
  it('disables Genome Browser button when there are no committed species', () => {
    const wrapper = mount(<Launchbar {...defaultProps} />);
    const genomeBrowserButton = wrapper.findWhere(
      (wrapper) => wrapper.prop('app') === 'browser'
    );

    expect(genomeBrowserButton.prop('enabled')).toBe(false);
  });

  it('enables Genome Browser button when there are committed species', () => {
    const props = {
      ...defaultProps,
      committedSpecies: [createSelectedSpecies()]
    };
    const wrapper = mount(<Launchbar {...props} />);
    const genomeBrowserButton = wrapper.findWhere(
      (wrapper) => wrapper.prop('app') === 'browser'
    );

    expect(genomeBrowserButton.prop('enabled')).toBe(true);
  });
});
