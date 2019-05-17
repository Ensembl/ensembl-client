import React from 'react';
import { mount, render } from 'enzyme';
import set from 'lodash/fp/set';

import { PopularSpeciesButton } from './PopularSpeciesButton';

import { createPopularSpecies } from 'tests/fixtures/popular-species';

import styles from './PopularSpeciesButton.scss';
import strainSelectorStyles from ',,/strain-selector/StrainSelector.scss';

const onClick = jest.fn;
// const onStrainSelect = jest.fn;
const strains = [...new Array(4)].map((_, index) => ({
  name: `strain-${index}`,
  isSelected: Boolean(index % 2)
}));

const commonProps = {
  species: createPopularSpecies(),
  onClick
};

const strainSelectorClassName = `.${strainSelectorStyles.strainSelector}`;

describe('<PopularSpeciesButton />', () => {
  describe('not available', () => {
    it('has appropriate class', () => {
      const props = set('species.isAvailable', false, commonProps);
      const renderedButton = render(
        <PopularSpeciesButton {...props} isSelected={false} />
      );
      expect(renderedButton.hasClass(styles.popularSpeciesButton)).toBe(true);
      expect(renderedButton.hasClass(styles.popularSpeciesButtonDisabled)).toBe(
        true
      );
    });
  });

  describe('not selected', () => {
    test('has appropriate class', () => {
      const renderedButton = render(
        <PopularSpeciesButton {...commonProps} isSelected={false} />
      );
      expect(renderedButton.hasClass(styles.popularSpeciesButton)).toBe(true);
      expect(renderedButton.hasClass(styles.popularSpeciesButtonActive)).toBe(
        false
      );
    });

    test('does not render strain selector even if provided with a list of strains', () => {
      const renderedButton = mount(
        <PopularSpeciesButton {...commonProps} isSelected={false} />
      );
      expect(renderedButton.find(strainSelectorClassName).length).toBe(0);
    });
  });

  describe('selected', () => {
    test('has appropriate class', () => {
      const renderedButton = render(
        <PopularSpeciesButton {...commonProps} isSelected={true} />
      );
      expect(renderedButton.hasClass(styles.popularSpeciesButtonActive)).toBe(
        true
      );
    });

    test('does not render strain selector if none are available', () => {
      const renderedButton = mount(
        <PopularSpeciesButton {...commonProps} isSelected={true} />
      );
      expect(renderedButton.find(strainSelectorClassName).length).toBe(0);
    });

    test.skip('renders strain selector if a list of strains is provided', () => {
      const renderedButton = mount(
        <PopularSpeciesButton {...commonProps} isSelected={true} />
      );
      expect(renderedButton.find(strainSelectorClassName).length).toBe(1);
    });
  });
});
