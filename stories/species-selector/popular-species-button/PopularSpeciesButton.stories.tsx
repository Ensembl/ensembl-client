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
import noop from 'lodash/noop';

import PopularSpeciesButton from 'src/content/app/species-selector/components/popular-species-button/PopularSpeciesButton';

import humanIconUrl from './homo_sapiens.svg?url';
import zebrafishIconUrl from './danio_rerio.svg?url';

import type { PopularSpecies } from 'src/content/app/species-selector/types/popularSpecies';

const humanData: PopularSpecies = {
  species_taxonomy_id: 1,
  name: 'Human',
  image: humanIconUrl,
  genomes_count: 2
};

const humanWithManyGenomesData = {
  ...humanData,
  members_count: 5289
};

const zebrafishData: PopularSpecies = {
  species_taxonomy_id: 2,
  name: 'Zebrafish',
  image: zebrafishIconUrl,
  genomes_count: 1
};

export const UnselectedSmallCountStory = {
  name: 'Unselected, small count',
  render: () => (
    <PopularSpeciesButton
      species={humanData}
      isSelected={false}
      onClick={noop}
    />
  )
};

export const SelectedSmallCountStory = {
  name: 'Selected, small count',
  render: () => (
    <PopularSpeciesButton
      species={humanData}
      isSelected={true}
      onClick={noop}
    />
  )
};

export const UnselectedLargeCountStory = {
  name: 'Unselected, large count',
  render: () => (
    <PopularSpeciesButton
      species={humanWithManyGenomesData}
      isSelected={false}
      onClick={noop}
    />
  )
};

export const SelectedLargeCountStory = {
  name: 'Selected, large count',
  render: () => (
    <PopularSpeciesButton
      species={humanWithManyGenomesData}
      isSelected={true}
      onClick={noop}
    />
  )
};

export const UnselectedNoCountStory = {
  name: 'Unselected, no count',
  render: () => (
    <PopularSpeciesButton
      species={zebrafishData}
      isSelected={false}
      onClick={noop}
    />
  )
};

export const SelectedNoCountStory = {
  name: 'Selected, no count',
  render: () => (
    <PopularSpeciesButton
      species={zebrafishData}
      isSelected={true}
      onClick={noop}
    />
  )
};

export default {
  title: 'Components/Species Selector/Popular species button'
};
