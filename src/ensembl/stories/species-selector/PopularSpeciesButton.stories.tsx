import React from 'react';
import { storiesOf } from '@storybook/react';

import PopularSpeciesButton from 'src/content/app/species-selector/components/popular-species-button/PopularSpeciesButton';

storiesOf('Components|Species Selector/Popular species button', module)
  .add('not selected', () => (
    <>
      <PopularSpeciesButton
        species="human"
        isSelected={false}
        onClick={() => {}}
      />
      <PopularSpeciesButton
        species="aspergillus"
        isSelected={false}
        onClick={() => {}}
      />
      <PopularSpeciesButton
        species="mouse"
        isSelected={false}
        onClick={() => {}}
      />
    </>
  ))
  .add('selected', () => (
    <>
      <PopularSpeciesButton species="human" isSelected onClick={() => {}} />
      <PopularSpeciesButton
        species="aspergillus"
        isSelected={false}
        onClick={() => {}}
      />
      <PopularSpeciesButton
        species="mouse"
        isSelected={false}
        onClick={() => {}}
      />
    </>
  ));
