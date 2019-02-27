import React from 'react';
import { mount } from 'enzyme';

import PopularSpeciesButton from './PopularSpeciesButton';

import styles from './PopularSpeciesButton.scss';

const onClick = jest.fn;
const onStrainSelect = jest.fn;
// const strains = [...new Array(4)].map((item, index) => ({
//   name: `strain-${index}`,
//   isSelected: Boolean(index % 2)
// }));
const species = 'mouse';

const commonProps = {
  species,
  onClick,
  onStrainSelect
};

describe('<PopularSpeciesButton />', () => {
  describe('not selected', () => {
    test('has appropriate class', () => {
      const renderedButton = (
        <PopularSpeciesButton {...commonProps} isSelected={false} />
      );
      const component = mount(renderedButton);
      console.log('component', component.at(0).html());
      console.log('styles', styles);
    });
  });
});
