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
      expect(deleteCommittedSpecies).not.toHaveBeenCalled();
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

    it('deletes committed species when clicked', () => {
      const wrapper = mount(
        <PopularSpeciesButton {...commonProps} isCommitted={true} />
      ).find('.popularSpeciesButton');
      wrapper.simulate('click');

      expect(deleteCommittedSpecies).toHaveBeenCalled();
      expect(clearSelectedSpecies).not.toHaveBeenCalled();
      expect(handleSelectedSpecies).not.toHaveBeenCalled();
    });
  });
});
