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
import { mount, render } from 'enzyme';
import set from 'lodash/fp/set';
import { push } from 'connected-react-router';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { PopularSpeciesButton } from './PopularSpeciesButton';

import { createPopularSpecies } from 'tests/fixtures/popular-species';

import styles from './PopularSpeciesButton.scss';

jest.mock('src/shared/components/inline-svg/InlineSvg', () => () => <div />);
jest.mock('connected-react-router', () => ({
  push: jest.fn(() => ({ type: 'push' }))
}));

const handleSelectedSpecies = jest.fn();
const clearSelectedSpecies = jest.fn();

const commonProps = {
  species: createPopularSpecies(),
  isSelected: false,
  isCommitted: false,
  handleSelectedSpecies,
  clearSelectedSpecies,
  push
};

describe('<PopularSpeciesButton />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('not available', () => {
    it('has appropriate class', () => {
      const props = set('species.is_available', false, commonProps);
      const renderedButton = render(<PopularSpeciesButton {...props} />).find(
        '.popularSpeciesButton'
      );
      expect(renderedButton.hasClass(styles.popularSpeciesButtonDisabled)).toBe(
        true
      );
    });

    it('does not call handleSelectedSpecies prop when clicked', () => {
      const props = set('species.is_available', false, commonProps);
      const wrapper = mount(<PopularSpeciesButton {...props} />).find(
        '.popularSpeciesButton'
      );
      wrapper.simulate('click');

      expect(handleSelectedSpecies).not.toHaveBeenCalled();
    });
  });

  describe('not selected', () => {
    it('has appropriate class', () => {
      const renderedButton = render(
        <PopularSpeciesButton {...commonProps} isSelected={false} />
      ).find('.popularSpeciesButton');
      expect(renderedButton.hasClass('popularSpeciesButtonActive')).toBe(false);
    });

    it('calls handleSelectedSpecies prop when clicked', () => {
      const wrapper = mount(<PopularSpeciesButton {...commonProps} />).find(
        '.popularSpeciesButton'
      );
      wrapper.simulate('click');

      const speciesData = commonProps.species;

      expect(handleSelectedSpecies).toHaveBeenCalledWith(speciesData);
    });
  });

  describe('selected', () => {
    it('has appropriate class', () => {
      const renderedButton = render(
        <PopularSpeciesButton {...commonProps} isSelected={true} />
      ).find('.popularSpeciesButton');
      expect(renderedButton.hasClass('popularSpeciesButtonSelected')).toBe(
        true
      );
    });

    it('clears selected species when clicked', () => {
      const wrapper = mount(
        <PopularSpeciesButton {...commonProps} isSelected={true} />
      ).find('.popularSpeciesButton');
      wrapper.simulate('click');

      expect(clearSelectedSpecies).toHaveBeenCalled();
      expect(handleSelectedSpecies).not.toHaveBeenCalled();
      expect(push).not.toHaveBeenCalled();
    });
  });

  describe('committed', () => {
    it('has appropriate class', () => {
      const renderedButton = render(
        <PopularSpeciesButton {...commonProps} isCommitted={true} />
      ).find('.popularSpeciesButton');
      expect(renderedButton.hasClass('popularSpeciesButtonCommitted')).toBe(
        true
      );
    });

    it('opens species homepage when it is clicked', () => {
      const wrapper = mount(
        <PopularSpeciesButton {...commonProps} isCommitted={true} />
      ).find('.popularSpeciesButton');

      wrapper.simulate('click');

      expect(push).toHaveBeenCalledWith(
        urlFor.speciesHomepage({
          genomeId: commonProps.species.genome_id
        })
      );

      expect(clearSelectedSpecies).not.toHaveBeenCalled();
      expect(handleSelectedSpecies).not.toHaveBeenCalled();
    });
  });
});
