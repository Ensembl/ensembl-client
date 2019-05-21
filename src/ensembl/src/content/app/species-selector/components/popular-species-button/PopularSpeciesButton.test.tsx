import React from 'react';
import { mount, render } from 'enzyme';
import set from 'lodash/fp/set';

import { PopularSpeciesButton } from './PopularSpeciesButton';

import { createPopularSpecies } from 'tests/fixtures/popular-species';

import styles from './PopularSpeciesButton.scss';

jest.mock('src/shared/inline-svg/InlineSvg', () => () => <div />);

const handleSelectedSpecies = jest.fn();

const commonProps = {
  species: createPopularSpecies(),
  isSelected: false,
  isCommitted: false,
  handleSelectedSpecies
};

describe('<PopularSpeciesButton />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('not available', () => {
    it('has appropriate class', () => {
      const props = set('species.isAvailable', false, commonProps);
      const renderedButton = render(<PopularSpeciesButton {...props} />);
      expect(renderedButton.hasClass(styles.popularSpeciesButton)).toBe(true);
      expect(renderedButton.hasClass(styles.popularSpeciesButtonDisabled)).toBe(
        true
      );
    });

    it('does not call handleSelectedSpecies prop when clicked', () => {
      const props = set('species.isAvailable', false, commonProps);
      const wrapper = mount(<PopularSpeciesButton {...props} />);
      wrapper.simulate('click');

      expect(handleSelectedSpecies).not.toHaveBeenCalled();
    });
  });

  describe('not selected', () => {
    it('has appropriate class', () => {
      const renderedButton = render(
        <PopularSpeciesButton {...commonProps} isSelected={false} />
      );
      expect(renderedButton.hasClass(styles.popularSpeciesButton)).toBe(true);
      expect(renderedButton.hasClass(styles.popularSpeciesButtonActive)).toBe(
        false
      );
    });

    it('calls handleSelectedSpecies prop when clicked', () => {
      const wrapper = mount(<PopularSpeciesButton {...commonProps} />);
      wrapper.simulate('click');

      const speciesData = commonProps.species;

      expect(handleSelectedSpecies).toHaveBeenCalledWith(speciesData);
    });
  });

  describe('selected', () => {
    it('has appropriate class', () => {
      const renderedButton = render(
        <PopularSpeciesButton {...commonProps} isSelected={true} />
      );
      expect(renderedButton.hasClass(styles.popularSpeciesButtonActive)).toBe(
        true
      );
    });
  });
});
