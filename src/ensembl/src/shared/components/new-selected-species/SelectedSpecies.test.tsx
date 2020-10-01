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

import SelectedSpecies, {
  Props as SelectedSpeciesProps
} from './SelectedSpecies';
import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

const speciesData = {
  genome_id: 'homo_sapiens38',
  reference_genome_id: null,
  common_name: 'Human',
  scientific_name: 'Homo sapiens',
  assembly_name: 'GRCh38',
  isEnabled: true
};

const propsObj = {
  species: speciesData as CommittedItem,
  isActive: true,
  onClick: jest.fn()
};

describe('<SelectedSpecies />', () => {
  const renderSelectedSpecies = (props: SelectedSpeciesProps) =>
    mount(<SelectedSpecies {...speciesData} {...props} />);

  it('renders without error', () => {
    expect(() => renderSelectedSpecies(propsObj)).not.toThrow();
  });

  describe('lozenge', () => {
    it('is active and enabled', () => {
      const wrapper = renderSelectedSpecies(propsObj);
      expect(wrapper.children('div').hasClass('inUseActive')).toEqual(true);
    });
    it('is active and not enabled', () => {
      propsObj.species.isEnabled = false;
      const wrapper = renderSelectedSpecies(propsObj);
      expect(wrapper.children('div').hasClass('notInUseActive')).toEqual(true);
    });
    it('is inactive and enabled', () => {
      propsObj.isActive = false;
      propsObj.species.isEnabled = true;
      const wrapper = renderSelectedSpecies(propsObj);
      expect(wrapper.children('div').hasClass('inUseInactive')).toEqual(true);
    });
    it('is inactive and disabled', () => {
      propsObj.species.isEnabled = false;
      propsObj.isActive = false;
      const wrapper = renderSelectedSpecies(propsObj);
      expect(wrapper.children('div').hasClass('notInUseInactive')).toEqual(
        true
      );
    });
  });

  describe('prop onClick', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('calls the onClick prop when clicked if species is enabled but inactive', () => {
      propsObj.isActive = false;
      propsObj.species.isEnabled = true;
      const wrapper = renderSelectedSpecies(propsObj);
      wrapper.simulate('click');
      expect(propsObj.onClick).toBeCalled();
    });

    it('does not call the onClick prop when clicked if species is enabled and active', () => {
      propsObj.isActive = true;
      propsObj.species.isEnabled = true;
      const wrapper = renderSelectedSpecies(propsObj);
      wrapper.simulate('click');
      expect(propsObj.onClick).not.toBeCalled();
    });
  });
});
