import React from 'react';
import { storiesOf } from '@storybook/react';

import ColourCard from './ColourCard';
import variables from 'src/styles/_settings.scss';

const colours = [
  {
    name: 'Ensembl black',
    variableName: '$ens-black',
    value: variables['ens-black']
  },
  {
    name: 'Ensembl blue',
    variableName: '$ens-blue',
    value: variables['ens-blue']
  },
  {
    name: 'Ensembl dark blue',
    variableName: '$ens-dark-blue',
    value: variables['ens-dark-blue']
  },
  {
    name: 'Ensembl light blue',
    variableName: '$ens-light-blue',
    value: variables['ens-light-blue']
  },
  {
    name: 'Ensembl red',
    variableName: '$ens-red',
    value: variables['ens-red']
  },
  {
    name: 'Ensembl grey',
    variableName: '$ens-grey',
    value: variables['ens-grey']
  },
  {
    name: 'Ensembl medium dark grey',
    variableName: '$ens-medium-dark-grey',
    value: variables['ens-medium-dark-grey']
  },
  {
    name: 'Ensembl dark grey',
    variableName: '$ens-dark-grey',
    value: variables['ens-dark-grey']
  },
  {
    name: 'Ensembl medium light grey',
    variableName: '$ens-medium-light-grey',
    value: variables['ens-medium-light-grey']
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
