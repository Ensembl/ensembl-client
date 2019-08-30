import React from 'react';
import { storiesOf } from '@storybook/react';

import ColourCard from './ColourCard';
import variables from 'src/styles/_settings.scss';

const colours = [
  {
    name: 'Ensembl black',
    variableName: '$black',
    value: variables['black']
  },
  {
    name: 'Ensembl blue',
    variableName: '$blue',
    value: variables['blue']
  },
  {
    name: 'Ensembl dark blue',
    variableName: '$dark-blue',
    value: variables['dark-blue']
  },
  {
    name: 'Ensembl light blue',
    variableName: '$light-blue',
    value: variables['light-blue']
  },
  {
    name: 'Ensembl red',
    variableName: '$red',
    value: variables['red']
  },
  {
    name: 'Ensembl grey',
    variableName: '$grey',
    value: variables['grey']
  },
  {
    name: 'Ensembl medium dark grey',
    variableName: '$medium-dark-grey',
    value: variables['medium-dark-grey']
  },
  {
    name: 'Ensembl dark grey',
    variableName: '$dark-grey',
    value: variables['dark-grey']
  },
  {
    name: 'Ensembl medium light grey',
    variableName: '$medium-light-grey',
    value: variables['medium-light-grey']
  },
  {
    name: 'Ensembl light grey',
    variableName: '$light-grey',
    value: variables['light-grey']
  },
  {
    name: 'Ensembl green',
    variableName: '$green',
    value: variables['green']
  },
  {
    name: 'Ensembl white',
    variableName: '$white',
    value: variables['white']
  }
];

storiesOf('Design Primitives|Colours', module).add(
  'colour palette',
  () => (
    <>
      {colours.map((colourData, index) => (
        <ColourCard key={index} {...colourData} />
      ))}
    </>
  ),
  {
    notes: "Basic Ensembl palette as per Andrea's design mockups"
  }
);
