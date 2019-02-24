import React from 'react';
import { storiesOf } from '@storybook/react';

import ColorCard from './ColorCard';

const colors = [
  {
    name: 'Foundation primary',
    variableName: '$primary-color',
    value: '#1779ba'
  },
  {
    name: 'Foundation secondary',
    variableName: '$secondary-color',
    value: '#767676'
  },
  {
    name: 'Foundation success',
    variableName: '$success-color',
    value: '#3adb76'
  },
  {
    name: 'Foundation warning',
    variableName: '$warning-color',
    value: '#ffae00'
  },
  {
    name: 'Foundation alert',
    variableName: '$alert-color',
    value: '#cc4b37'
  },
  {
    name: 'Light gray',
    variableName: '$light-gray',
    value: '#e6e6e6'
  },
  {
    name: 'Medium gray',
    variableName: '$medium-gray',
    value: '#cacaca'
  },
  {
    name: 'Dark gray',
    variableName: '$dark-gray',
    value: '#8a8a8a'
  },
  {
    name: 'Black',
    variableName: '$black',
    value: '#0a0a0a'
  },
  {
    name: 'White',
    variableName: '$white',
    value: '#fefefe'
  },
  {
    name: 'Ensembl black',
    variableName: '$ens-black',
    value: '#162f45'
  },
  {
    name: 'Ensembl blue',
    variableName: '$ens-blue',
    value: '#3894fb'
  },
  {
    name: 'Ensembl dark grey',
    variableName: '$ens-dark-grey',
    value: '#999'
  },
  {
    name: 'Ensembl grey',
    variableName: '$ens-grey',
    value: '#bdc5cd'
  },
  {
    name: 'Ensembl medium grey',
    variableName: '$ens-medium-grey',
    value: '#d5dadf'
  },
  {
    name: 'Ensembl light grey',
    variableName: '$ens-light-grey',
    value: '#f1f3f5'
  },
  {
    name: 'Ensembl white',
    variableName: '$ens-white',
    value: '#fff'
  }
];

storiesOf('Design Primitives|Colors', module).add('color pallette', () => (
  <>
    {colors.map((colorData) => (
      <ColorCard {...colorData} />
    ))}
  </>
));
