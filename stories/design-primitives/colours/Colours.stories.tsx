/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';

import ColourCard from './ColourCard';
import variables from 'src/styles/_settings.scss';

const colours = [
  {
    name: 'Black',
    variableName: '$black',
    value: variables['black']
  },
  {
    name: 'Soft black',
    variableName: '$soft-black',
    value: variables['soft-black']
  },
  {
    name: 'Blue',
    variableName: '$blue',
    value: variables['blue']
  },
  {
    name: 'Light blue',
    variableName: '$light-blue',
    value: variables['light-blue']
  },
  {
    name: 'Ice blue',
    variableName: '$ice-blue',
    value: variables['ice-blue']
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
    name: 'Mustard',
    variableName: '$mustard',
    value: variables['mustard']
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

export const ColoursStory = () => (
  <>
    {colours.map((colourData, index) => (
      <ColourCard key={index} {...colourData} />
    ))}
  </>
);

ColoursStory.storyName = 'colour palette';

export default {
  title: 'Design Primitives/Colours'
};
