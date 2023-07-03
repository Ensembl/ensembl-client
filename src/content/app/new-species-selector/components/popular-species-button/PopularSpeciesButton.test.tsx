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
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PopularSpeciesButton from './PopularSpeciesButton';

import type { PopularSpecies } from 'src/content/app/new-species-selector/types/popularSpecies';

const humanData: PopularSpecies = {
  id: 1,
  name: 'Human',
  image: 'image.svg',
  members_count: 2,
  is_selected: false
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('<PopularSpeciesButton />', () => {
  it('applies correct classes when species is not selected', () => {
    const { container } = render(
      <PopularSpeciesButton species={humanData} onClick={jest.fn()} />
    );

    const button = container.querySelector('button') as HTMLElement;
    expect(button.classList.contains('popularSpeciesButton')).toBe(true);
    expect(button.classList.contains('popularSpeciesButtonSelected')).toBe(
      false
    );
  });

  it('applies correct classes when species is selected', () => {
    const { container } = render(
      <PopularSpeciesButton
        species={{ ...humanData, is_selected: true }}
        onClick={jest.fn()}
      />
    );

    const button = container.querySelector('button') as HTMLElement;
    expect(button.classList.contains('popularSpeciesButton')).toBe(true);
    expect(button.classList.contains('popularSpeciesButtonSelected')).toBe(
      true
    );
  });

  it('renders a pill with genomes count if it is greater than 1', () => {
    const { container } = render(
      <PopularSpeciesButton species={humanData} onClick={jest.fn()} />
    );

    const countPill = container.querySelector('.membersCount') as HTMLElement;

    expect(countPill).toBeTruthy();
    expect(countPill.innerHTML).toBe(`${humanData.members_count}`);
  });

  it('does not render a genomes count pill if species only has one genome', () => {
    const { container } = render(
      <PopularSpeciesButton
        species={{ ...humanData, members_count: 1 }}
        onClick={jest.fn()}
      />
    );

    const countPill = container.querySelector('.membersCount') as HTMLElement;

    expect(countPill).toBeFalsy();
  });

  it('calls the click handler when clicked', async () => {
    const clickHandler = jest.fn();
    const { container } = render(
      <PopularSpeciesButton
        species={{ ...humanData, members_count: 1 }}
        onClick={clickHandler}
      />
    );

    const button = container.querySelector('button') as HTMLElement;
    await userEvent.click(button);

    expect(clickHandler).toHaveBeenCalled();
  });
});
