import React from 'react';
import { mount, render } from 'enzyme';
import set from 'lodash/fp/set';

import { PopularSpeciesButton } from './PopularSpeciesButton';

import { createPopularSpecies } from 'tests/fixtures/popular-species';

import styles from './PopularSpeciesButton.scss';

jest.mock('src/shared/inline-svg/InlineSvg', () => () => <div />);

const handleSelectedSpecies = jest.fn();
const clearSelectedSpecies = jest.fn();
const deleteCommittedSpecies = jest.fn();

const commonProps = {
  species: createPopularSpecies(),
  isSelected: false,
  isCommitted: false,
  handleSelectedSpecies,
  clearSelectedSpecies,
  deleteCommittedSpecies
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
      expect(renderedButton.hasClass('popularSpeciesButton')).toBe(true);
      expect(renderedButton.hasClass('popularSpeciesButtonActive')).toBe(false);
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
      expect(renderedButton.hasClass('popularSpeciesButtonSelected')).toBe(
        true
      );
    });

    it('clears selected species when clicked', () => {
      const wrapper = mount(
        <PopularSpeciesButton {...commonProps} isSelected={true} />
      );
      wrapper.simulate('click');

      expect(clearSelectedSpecies).toHaveBeenCalled();
      expect(handleSelectedSpecies).not.toHaveBeenCalled();
      expect(deleteCommittedSpecies).not.toHaveBeenCalled();
    });
  });

  describe('committed', () => {
    it('has appropriate class', () => {
      const renderedButton = render(
        <PopularSpeciesButton {...commonProps} isCommitted={true} />
      );
      expect(renderedButton.hasClass('popularSpeciesButtonCommitted')).toBe(
        true
      );
    });

    it('deletes committed species when clicked', () => {
      const wrapper = mount(
        <PopularSpeciesButton {...commonProps} isCommitted={true} />
      );
      wrapper.simulate('click');

      expect(deleteCommittedSpecies).toHaveBeenCalled();
      expect(clearSelectedSpecies).not.toHaveBeenCalled();
      expect(handleSelectedSpecies).not.toHaveBeenCalled();
    });
  });
});
