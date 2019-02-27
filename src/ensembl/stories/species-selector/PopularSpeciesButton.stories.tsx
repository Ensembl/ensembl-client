import React from 'react';
import { storiesOf } from '@storybook/react';

import PopularSpeciesButton from 'src/content/app/species-selector/components/popular-species-button/PopularSpeciesButton';

import { strains } from './StrainSelector.stories';

storiesOf('Components|Species Selector/Popular species button', module)
  .add('not selected', () => (
    <>
      <PopularSpeciesButton
        species="human"
        isSelected={false}
        onClick={() => {}}
        onStrainSelect={() => {}}
      />
      <PopularSpeciesButton
        species="aspergillus"
        isSelected={false}
        onClick={() => {}}
        onStrainSelect={() => {}}
      />
      <PopularSpeciesButton
        species="mouse"
        isSelected={false}
        strains={strains}
        onClick={() => {}}
        onStrainSelect={() => {}}
      />
    </>
  ))
  .add('selected', () => (
    <>
      <PopularSpeciesButton
        species="human"
        isSelected={true}
        onClick={() => {}}
        onStrainSelect={() => {}}
      />
      <PopularSpeciesButton
        species="aspergillus"
        isSelected={false}
        onClick={() => {}}
        onStrainSelect={() => {}}
      />
      <PopularSpeciesButton
        species="mouse"
        isSelected={true}
        strains={strains}
        onClick={() => {}}
        onStrainSelect={() => {}}
      />
    </>
  ));
