import React from 'react';
import { storiesOf } from '@storybook/react';

import ColourCard from './ColourCard';
import variables from 'src/styles/_settings.scss';

const colours = [
  {
    name: 'Black',
    variableName: '$black',
    value: variables['black']
  },
  {
    name: 'Blue',
    variableName: '$blue',
    value: variables['blue']
  },
  {
    name: 'Dark blue',
    variableName: '$dark-blue',
    value: variables['dark-blue']
  },
  {
    name: 'Light blue',
    variableName: '$light-blue',
    value: variables['light-blue']
  },
  {
    name: 'Red',
    variableName: '$red',
    value: variables['red']
  },
  {
    name: 'Orange',
    variableName: '$orange',
    value: variables['orange']
  },
  {
    name: 'Grey',
    variableName: '$grey',
    value: variables['grey']
  },
  {
    name: 'Medium-dark grey',
    variableName: '$medium-dark-grey',
    value: variables['medium-dark-grey']
  },
  {
    name: 'Dark grey',
    variableName: '$dark-grey',
    value: variables['dark-grey']
  },
  {
    name: 'Medium-light grey',
    variableName: '$medium-light-grey',
    value: variables['medium-light-grey']
  },
  {
    name: 'Light grey',
    variableName: '$light-grey',
    value: variables['light-grey']
  },
  {
    name: 'Green',
    variableName: '$green',
    value: variables['green']
  },
  {
    name: 'White',
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
    notes: "Basic palette as per Andrea's design mockups"
  }
);
