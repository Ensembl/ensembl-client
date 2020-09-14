/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
      (wrapper) => wrapper.prop('app') === 'genome-browser'
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
      (wrapper) => wrapper.prop('app') === 'genome-browser'
    );

    expect(genomeBrowserButton.prop('enabled')).toBe(true);
  });
});
