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
import { useSelector } from 'react-redux';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import faker from 'faker';
import times from 'lodash/times';

import { createEnsObject } from 'tests/fixtures/ens-object';
import { TrackPanelBookmarks } from './TrackPanelBookmarks';

import { PreviouslyViewedObject } from '../../trackPanelState';

jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockImplementation((selector) => selector()),
  useDispatch: jest.fn()
}));

jest.mock('src/shared/state/ens-object/ensObjectSelectors', () => ({
  getExampleEnsObjects: jest.fn()
}));

jest.mock('src/content/app/browser/track-panel/trackPanelSelectors', () => ({
  getActiveGenomePreviouslyViewedObjects: jest.fn()
}));

jest.mock('src/content/app/browser/browserActions', () => ({
  changeFocusObject: jest.fn()
}));

jest.mock('src/content/app/browser/drawer/drawerActions', () => ({
  changeDrawerViewAndOpen: jest.fn()
}));

const createPreviouslyViewedLink = (): PreviouslyViewedObject => ({
  genome_id: faker.random.word(),
  object_id: `${faker.random.word()}:gene:${faker.random.uuid()}`,
  object_type: 'gene',
  label: faker.random.word()
});

const closeTrackPanelModal = jest.fn();
const changeDrawerViewAndOpen = jest.fn();

describe('<TrackPanelBookmarks />', () => {
  const numberOfExampleObjects = faker.random.number({ min: 5, max: 10 });
  const numberOfPreviouslyViewedObjects = faker.random.number({
    min: 5,
    max: 20
  });

  const exampleEnsObjects = times(numberOfExampleObjects, () =>
    createEnsObject()
  );

  const previouslyViewedObjects = times(numberOfPreviouslyViewedObjects, () =>
    createPreviouslyViewedLink()
  );

  beforeEach(() => {
    jest.resetAllMocks();

    (useSelector as any).mockReturnValue(exampleEnsObjects);
    (useSelector as any).mockReturnValue(previouslyViewedObjects);
  });

  it.only('renders previously viewed links', () => {
    const { container } = render(<TrackPanelBookmarks />);
    const links = [...container.querySelectorAll('.link')] as HTMLElement[];
    const linkTexts = previouslyViewedObjects.map(({ label }) => label);

    linkTexts.forEach((text) =>
      links.find((link) => {
        return link.innerHTML === text;
      })
    );

    expect(
      linkTexts.every((text) =>
        links.find((link) => {
          return link.innerHTML === text;
        })
      )
    ).toBe(true);
  });

  it('closes the bookmarks modal when a bookmark link is clicked', () => {
    render(<TrackPanelBookmarks />);
    const previouslyViewedLinksContainer = screen.getByTestId(
      'previously viewed links'
    );
    const firstLink = (previouslyViewedLinksContainer as HTMLElement).querySelector(
      '.link'
    );

    userEvent.click(firstLink as HTMLElement);
    expect(closeTrackPanelModal).toBeCalled();
  });

  it('shows the ellipsis only when the total objects is more than 20', () => {
    const newPreviouslyViewedObjects = times(20, () =>
      createPreviouslyViewedLink()
    );

    (useSelector as any).mockReturnValue(newPreviouslyViewedObjects);

    const { rerender } = render(<TrackPanelBookmarks />);
    const previouslyViewedSection = screen.getByText('Previously viewed');

    expect(previouslyViewedSection.querySelector('button')).toBeFalsy();

    // Add another link to make it 21 links
    newPreviouslyViewedObjects.push(createPreviouslyViewedLink());
    rerender(<TrackPanelBookmarks />);

    expect(previouslyViewedSection.querySelector('button')).toBeTruthy();
  });

  it('calls changeDrawerViewAndOpen when the ellipsis is clicked', () => {
    const newPreviouslyViewedObjects = times(21, () =>
      createPreviouslyViewedLink()
    );

    (useSelector as any).mockReturnValue(newPreviouslyViewedObjects);
    render(<TrackPanelBookmarks />);

    const previouslyViewedSection = screen.getByText('Previously viewed');
    const ellipsisButton = previouslyViewedSection.querySelector(
      'button'
    ) as HTMLElement;

    userEvent.click(ellipsisButton);

    expect(changeDrawerViewAndOpen).toBeCalled();
  });

  it('renders correct number of links to example objects', () => {
    render(<TrackPanelBookmarks />);
    const exampleLinksWrapper = screen.getByTestId('example links');

    expect(exampleLinksWrapper?.querySelectorAll('.link').length).toBe(
      numberOfExampleObjects
    );
  });

  it('calls closeTrackPanelModal when an example object link is clicked', () => {
    render(<TrackPanelBookmarks />);
    const exampleLinksWrapper = screen.getByTestId('example links');
    const exampleLink = exampleLinksWrapper?.querySelector('.link');

    userEvent.click(exampleLink as HTMLElement);

    expect(closeTrackPanelModal).toBeCalled();
  });
});
