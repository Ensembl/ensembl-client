import React from 'react';
import { storiesOf } from '@storybook/react';

import ColourCard from './ColourCard';
import variables from 'src/styles/_settings.scss';

const colours = [
  {
    name: 'Ensembl blue',
    variableName: '$ens-blue',
    value: variables['ens-blue']
  },
  {
    name: 'Ensembl black',
    variableName: '$ens-black',
    value: variables['ens-black']
  },
  {
    name: 'Ensembl dark grey',
    variableName: '$ens-dark-grey',
    value: variables['ens-dark-grey']
  },
  {
    name: 'Ensembl grey',
    variableName: '$ens-grey',
    value: variables['ens-grey']
  },
  {
    name: 'Ensembl medium grey',
    variableName: '$ens-medium-grey',
    value: variables['ens-medium-grey']
  },
  {
    name: 'Ensembl light grey',
    variableName: '$ens-light-grey',
    value: variables['ens-light-grey']
  },
  {
    name: 'Ensembl white',
    variableName: '$ens-white',
    value: variables['ens-white']
  }
];

storiesOf('Design Primitives|Colours', module).add('colour palette', () => (
  <>
    {colours.map((colourData) => (
      <ColourCard {...colourData} />
    ))}
  </>
));
