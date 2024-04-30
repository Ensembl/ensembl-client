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

import ColourCard from './ColourCard';

const colours = [
  {
    name: 'Black',
    variableName: '--color-black'
  },
  {
    name: 'Soft black',
    variableName: '--color-soft-black'
  },
  {
    name: 'Blue',
    variableName: '--color-blue'
  },
  {
    name: 'Light blue',
    variableName: '--color-light-blue'
  },
  {
    name: 'Ice blue',
    variableName: '--color-ice-blue'
  },
  {
    name: 'Teal',
    variableName: '--color-teal'
  },
  {
    name: 'Duck-egg blue',
    variableName: '--color-duckegg-blue'
  },
  {
    name: 'Neon blue',
    variableName: '--color-neon-blue'
  },
  {
    name: 'Grey',
    variableName: '--color-grey'
  },
  {
    name: 'Medium-dark grey',
    variableName: '--color-medium-dark-grey'
  },
  {
    name: 'Dark grey',
    variableName: '--color-dark-grey'
  },
  {
    name: 'Medium-light grey',
    variableName: '--color-medium-light-grey'
  },
  {
    name: 'Light grey',
    variableName: '--color-light-grey'
  },
  {
    name: 'Red',
    variableName: '--color-red'
  },
  {
    name: 'Dark pink',
    variableName: '--color-dark-pink'
  },
  {
    name: 'Purple',
    variableName: '--color-purple'
  },
  {
    name: 'Orange',
    variableName: '--color-orange'
  },
  {
    name: 'Mustard',
    variableName: '--color-mustard'
  },
  {
    name: 'Dark yellow',
    variableName: '--color-dark-yellow'
  },
  {
    name: 'Green',
    variableName: '--color-green'
  },
  {
    name: 'Lime',
    variableName: '--color-lime'
  },
  {
    name: 'White',
    variableName: '--color-white'
  },
  {
    name: 'Off white',
    variableName: '--color-off-white'
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
