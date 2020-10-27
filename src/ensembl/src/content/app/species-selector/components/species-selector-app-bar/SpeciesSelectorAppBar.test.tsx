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
import times from 'lodash/times';
import { push } from 'connected-react-router';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { createSelectedSpecies } from 'tests/fixtures/selected-species';

import {
  SpeciesSelectorAppBar,
  PlaceholderMessage
} from './SpeciesSelectorAppBar';

jest.mock('react-router-dom', () => ({
  Link: (props: any) => <div>{props.children}</div>
}));

jest.mock('connected-react-router', () => ({
  push: jest.fn(() => ({ type: 'push' }))
}));

const defaultProps = {
  selectedSpecies: times(5, () => createSelectedSpecies()),
  push
};

describe('<SpeciesSelectorAppBar />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows placeholder message if no species are selected', () => {
    const props = { ...defaultProps, selectedSpecies: [] };
    const wrapper = mount(<SpeciesSelectorAppBar {...props} />);
    expect(wrapper.find(PlaceholderMessage).length).toBe(1);
  });

  it('does not show placeholder message if there are selected species', () => {
    const wrapper = mount(<SpeciesSelectorAppBar {...defaultProps} />);
    expect(wrapper.find(PlaceholderMessage).length).toBe(0);
  });

  it('renders the list of selected species if there are some', () => {
    const wrapper = mount(<SpeciesSelectorAppBar {...defaultProps} />);

    expect(wrapper.find('.species').length).toBe(
      defaultProps.selectedSpecies.length
    );
  });

  it('opens the species page when a SelectedSpecies tab button is clicked', () => {
    const wrapper = mount(<SpeciesSelectorAppBar {...defaultProps} />);

    const firstSelectedSpecies = wrapper.find('.species').first();

    firstSelectedSpecies.simulate('click');

    const firstSpeciesGenomeId = defaultProps.selectedSpecies[0].genome_id;

    const speciesPageUrl = urlFor.speciesPage({
      genomeId: firstSpeciesGenomeId
    });

    expect(push).toBeCalledWith(speciesPageUrl);
  });
});
