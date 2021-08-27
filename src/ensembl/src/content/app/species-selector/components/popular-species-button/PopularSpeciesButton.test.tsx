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
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import set from 'lodash/fp/set';
import { push } from 'connected-react-router';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { PopularSpeciesButton } from './PopularSpeciesButton';

import { createPopularSpecies } from 'tests/fixtures/popular-species';

jest.mock('src/shared/components/inline-svg/InlineSvg', () => () => <div />);
jest.mock('connected-react-router', () => ({
  push: jest.fn(() => ({ type: 'push' }))
}));

jest.mock('src/shared/hooks/useAnalyticsService', () =>
  jest.fn(() => ({
    trackPopularSpeciesSelect: jest.fn()
  }))
);

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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('not available', () => {
    it('has appropriate class', () => {
      const props = set('species.is_available', false, commonProps);
      const { container } = render(<PopularSpeciesButton {...props} />);
      const button = container.querySelector(
        '.popularSpeciesButton'
      ) as HTMLElement;
      expect(button.classList.contains('popularSpeciesButtonDisabled')).toBe(
        true
      );
    });

    it('does not call handleSelectedSpecies prop when clicked', () => {
      const props = set('species.is_available', false, commonProps);
      const { container } = render(<PopularSpeciesButton {...props} />);
      const button = container.querySelector(
        '.popularSpeciesButton'
      ) as HTMLElement;
      userEvent.click(button);

      expect(handleSelectedSpecies).not.toHaveBeenCalled();
    });
  });

  describe('not selected', () => {
    it('has appropriate class', () => {
      const { container } = render(<PopularSpeciesButton {...commonProps} />);
      const button = container.querySelector(
        '.popularSpeciesButton'
      ) as HTMLElement;
      expect(button.classList.length).toBe(1); // has only .popularSpeciesButton class
    });

    it('calls handleSelectedSpecies prop when clicked', () => {
      const { container } = render(<PopularSpeciesButton {...commonProps} />);
      const button = container.querySelector(
        '.popularSpeciesButton'
      ) as HTMLElement;
      const speciesData = commonProps.species;

      userEvent.click(button);

      expect(handleSelectedSpecies).toHaveBeenCalledWith(speciesData);
    });
  });

  describe('selected', () => {
    it('has appropriate class', () => {
      const { container } = render(
        <PopularSpeciesButton {...commonProps} isSelected={true} />
      );
      const button = container.querySelector(
        '.popularSpeciesButton'
      ) as HTMLElement;
      expect(button.classList.contains('popularSpeciesButtonSelected')).toBe(
        true
      );
    });

    it('clears selected species when clicked', () => {
      const { container } = render(
        <PopularSpeciesButton {...commonProps} isSelected={true} />
      );
      const button = container.querySelector(
        '.popularSpeciesButton'
      ) as HTMLElement;

      userEvent.click(button);

      expect(clearSelectedSpecies).toHaveBeenCalled();
      expect(handleSelectedSpecies).not.toHaveBeenCalled();
      expect(push).not.toHaveBeenCalled();
    });
  });

  describe('committed', () => {
    it('has appropriate class', () => {
      const { container } = render(
        <PopularSpeciesButton {...commonProps} isCommitted={true} />
      );
      const button = container.querySelector(
        '.popularSpeciesButton'
      ) as HTMLElement;
      expect(button.classList.contains('popularSpeciesButtonCommitted')).toBe(
        true
      );
    });

    it('opens species page when it is clicked', () => {
      const { container } = render(
        <PopularSpeciesButton {...commonProps} isCommitted={true} />
      );
      const button = container.querySelector(
        '.popularSpeciesButton'
      ) as HTMLElement;

      userEvent.click(button);

      expect(push).toHaveBeenCalledWith(
        urlFor.speciesPage({
          genomeId: commonProps.species.genome_id
        })
      );

      expect(clearSelectedSpecies).not.toHaveBeenCalled();
      expect(handleSelectedSpecies).not.toHaveBeenCalled();
    });
  });
});
