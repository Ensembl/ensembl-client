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
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import faker from 'faker';
import times from 'lodash/times';

import { createEnsObject } from 'tests/fixtures/ens-object';
import { TrackPanelBookmarks } from './TrackPanelBookmarks';

import { PreviouslyViewedObject } from '../../trackPanelState';

jest.mock('react-router-dom', () => ({
  Link: (props: any) => (
    <div {...props} className={'link'}>
      {props.children}
    </div>
  )
}));

const createPreviouslyViewedLink = (): PreviouslyViewedObject => ({
  genome_id: faker.random.word(),
  object_id: `${faker.random.word()}:gene:${faker.random.uuid()}`,
  object_type: 'gene',
  label: faker.random.word()
});

const closeTrackPanelModal = jest.fn();
const updateTrackStatesAndSave = jest.fn();
const fetchExampleEnsObjects = jest.fn();
const changeDrawerViewAndOpen = jest.fn();

describe('<TrackPanelBookmarks />', () => {
  const numberOfExampleObjects = faker.random.number({ min: 5, max: 10 });
  const numberOfPreviouslyViewedObjects = faker.random.number({
    min: 5,
    max: 20
  });

  const props = {
    activeGenomeId: faker.random.word(),
    exampleEnsObjects: times(numberOfExampleObjects, () => createEnsObject()),
    previouslyViewedObjects: times(numberOfPreviouslyViewedObjects, () =>
      createPreviouslyViewedLink()
    ),
    fetchExampleEnsObjects,
    updateTrackStatesAndSave,
    closeTrackPanelModal,
    changeDrawerViewAndOpen
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders previously viewed links', () => {
    const { container } = render(<TrackPanelBookmarks {...props} />);
    const links = [...container.querySelectorAll('.link')] as HTMLElement[];
    const linkTexts = props.previouslyViewedObjects.map(({ label }) => label);

    expect(
      linkTexts.every((text) =>
        links.find((link) => {
          return link.innerHTML === text;
        })
      )
    ).toBe(true);
  });

  it('closes the bookmarks modal when a bookmark link is clicked', () => {
    render(<TrackPanelBookmarks {...props} />);
    const previouslyViewedLinksContainer = screen.getByText('Previously viewed')
      .nextSibling;
    const firstLink = (previouslyViewedLinksContainer as HTMLElement).querySelector(
      '.link'
    );

    userEvent.click(firstLink as HTMLElement);
    expect(closeTrackPanelModal).toBeCalled();
  });

  it('shows the ellipsis only when the total objects is more than 20', () => {
    const previouslyViewedObjects = times(20, () =>
      createPreviouslyViewedLink()
    );
    const { rerender } = render(
      <TrackPanelBookmarks
        {...props}
        previouslyViewedObjects={previouslyViewedObjects}
      />
    );
    const previouslyViewedSection = screen.getByText('Previously viewed');

    expect(previouslyViewedSection.querySelector('button')).toBeFalsy();

    // Add another link to make it 21 links
    previouslyViewedObjects.push(createPreviouslyViewedLink());
    rerender(
      <TrackPanelBookmarks
        {...props}
        previouslyViewedObjects={previouslyViewedObjects}
      />
    );

    expect(previouslyViewedSection.querySelector('button')).toBeTruthy();
  });

  it('calls changeDrawerViewAndOpen when the ellipsis is clicked', () => {
    const previouslyViewedObjects = times(21, () =>
      createPreviouslyViewedLink()
    );
    render(
      <TrackPanelBookmarks
        {...props}
        previouslyViewedObjects={previouslyViewedObjects}
      />
    );
    const previouslyViewedSection = screen.getByText('Previously viewed');
    const ellipsisButton = previouslyViewedSection.querySelector(
      'button'
    ) as HTMLElement;

    userEvent.click(ellipsisButton);

    expect(changeDrawerViewAndOpen).toBeCalled();
  });

  it('renders correct number of links to example objects', () => {
    render(<TrackPanelBookmarks {...props} />);
    const exampleLinksWrapper = screen.getByText('Example links').parentElement;

    expect(exampleLinksWrapper?.querySelectorAll('.link').length).toBe(
      numberOfExampleObjects
    );
  });

  it('calls closeTrackPanelModal when an example object link is clicked', () => {
    render(<TrackPanelBookmarks {...props} />);
    const exampleLinksWrapper = screen.getByText('Example links').parentElement;
    const exampleLink = exampleLinksWrapper?.querySelector('.link');

    userEvent.click(exampleLink as HTMLElement);

    expect(closeTrackPanelModal).toBeCalled();
  });
});
