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
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import faker from '@faker-js/faker';
import times from 'lodash/times';
import random from 'lodash/random';

import AutosuggestSearchField from './AutosuggestSearchField';
import { GroupOfMatchesType } from './AutosuggestionPanel';

const generateMatch = () => {
  const text = faker.lorem.words();
  return {
    data: { text },
    element: <div>{text}</div>
  };
};

const generateGroupOfMatches = (numberOfMatches = 2, title?: string) => {
  const result: GroupOfMatchesType = {
    matches: times(numberOfMatches, generateMatch)
  };
  if (title) {
    result.title = title;
  }
  return result;
};

describe('<AutosuggestSearchField />', () => {
  const search = faker.lorem.word();
  const onChange = jest.fn();
  const onSelect = jest.fn();
  const onSubmit = jest.fn();
  const groupsOfMatches = times(2, () => generateGroupOfMatches());

  const minimalProps = {
    search,
    onChange,
    onSelect
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('appearance', () => {
    it('renders only search field if no matches have been found', () => {
      const { container } = render(
        <AutosuggestSearchField {...minimalProps} />
      );

      expect(container.querySelector('.searchField')).toBeTruthy();
      expect(container.querySelector('input')?.value).toBe(search);
      expect(container.querySelector('.autosuggestionPlate')).toBeFalsy();
    });

    it('renders AutosuggestionPanel with matches if they are provided', () => {
      const { container } = render(
        <AutosuggestSearchField
          {...minimalProps}
          matchGroups={groupsOfMatches}
        />
      );

      const expectedNumberOfMatches = groupsOfMatches.reduce((sum, group) => {
        const numberOfMatchesInGroup = group.matches.length;
        return sum + numberOfMatchesInGroup;
      }, 0);

      expect(container.querySelector('.searchField')).toBeTruthy();
      expect(container.querySelector('input')?.value).toBe(search);
      expect(container.querySelector('.autosuggestionPlate')).toBeTruthy();
      expect(
        container.querySelectorAll('.autosuggestionPlateItem').length
      ).toBe(expectedNumberOfMatches);
    });
  });

  describe('behaviour', () => {
    describe('general behavour', () => {
      const props = {
        ...minimalProps,
        matchGroups: groupsOfMatches
      };

      it('clicking on a suggested match submits its data', async () => {
        const { container } = render(<AutosuggestSearchField {...props} />);
        const suggestedItems = container.querySelectorAll(
          '.autosuggestionPlateItem'
        );

        const randomItemIndex = random(0, suggestedItems.length - 1);
        const randomItem = suggestedItems[randomItemIndex];
        const itemsData = groupsOfMatches.reduce((result, group) => {
          return [...result, ...group.matches.map(({ data }) => data)];
        }, [] as any);

        const expectedItemData = itemsData[randomItemIndex];

        await userEvent.click(randomItem);

        expect(onSelect).toHaveBeenCalledWith(expectedItemData);
      });

      it('pressing the ArrowDown button selects next item', () => {
        const { container } = render(<AutosuggestSearchField {...props} />);
        const searchField = container.querySelector(
          'input'
        ) as HTMLInputElement;

        fireEvent.keyDown(searchField, {
          key: 'ArrowDown'
        });

        const suggestedItems = container.querySelectorAll(
          '.autosuggestionPlateItem'
        );

        // initially, the first item was selected; so we now expect the second one to be
        expect(
          suggestedItems[1].classList.contains(
            'autosuggestionPlateHighlightedItem'
          )
        ).toBe(true);
      });

      it('pressing the ArrowUp button selects previous item', () => {
        const { container } = render(<AutosuggestSearchField {...props} />);
        const searchField = container.querySelector(
          'input'
        ) as HTMLInputElement;

        fireEvent.keyDown(searchField, {
          key: 'ArrowUp'
        });

        const suggestedItems = container.querySelectorAll(
          '.autosuggestionPlateItem'
        );
        const expectedIndex = suggestedItems.length - 1; // wrap to the end of the list

        // initially, the first item was selected; so we now expect the last one to be
        expect(
          suggestedItems[expectedIndex].classList.contains(
            'autosuggestionPlateHighlightedItem'
          )
        ).toBe(true);
      });
    });

    describe('when raw input submission is not allowed', () => {
      const props = {
        ...minimalProps,
        matchGroups: groupsOfMatches
      };

      it('first match in AutosuggestionPanel is pre-selected', () => {
        const { container } = render(<AutosuggestSearchField {...props} />);
        const suggestedItems = container.querySelectorAll(
          '.autosuggestionPlateItem'
        );
        const highlightedItems = [...suggestedItems].filter((el) =>
          el.classList.contains('autosuggestionPlateHighlightedItem')
        );

        expect(highlightedItems.length).toBe(1);
        expect(
          suggestedItems[0].classList.contains(
            'autosuggestionPlateHighlightedItem'
          )
        ).toBe(true);
      });

      it('triggering submit event confirms selection of a match', () => {
        const { container } = render(<AutosuggestSearchField {...props} />);
        const searchField = container.querySelector(
          'input'
        ) as HTMLInputElement;
        fireEvent.submit(searchField);

        const firstMatchData = groupsOfMatches[0].matches[0].data;

        expect(onSelect).toHaveBeenCalledWith(firstMatchData);
      });
    });

    describe('when raw input submission is allowed', () => {
      const props = {
        ...minimalProps,
        matchGroups: groupsOfMatches,
        allowRawInputSubmission: true,
        onSubmit
      };

      it('first match in AutosuggestionPanel is not pre-selected', () => {
        const { container } = render(<AutosuggestSearchField {...props} />);
        const highlightedItems = container.querySelectorAll(
          '.autosuggestionPlateHighlightedItem'
        );

        expect(highlightedItems.length).toBe(0);
      });

      it('triggering submit event submits current search value if no match is selected', () => {
        const { container } = render(<AutosuggestSearchField {...props} />);
        const searchField = container.querySelector(
          'input'
        ) as HTMLInputElement;
        fireEvent.submit(searchField);

        expect(onSubmit).toHaveBeenCalledWith(search);
        expect(onSelect).not.toHaveBeenCalled();
      });

      it('triggering submit event confirms selection of a match if the match is selected', () => {
        const { container } = render(<AutosuggestSearchField {...props} />);
        const searchField = container.querySelector(
          'input'
        ) as HTMLInputElement;

        // highlight the first match, then submit
        fireEvent.keyDown(searchField, {
          key: 'ArrowDown'
        });
        fireEvent.submit(searchField);

        const firstMatchData = groupsOfMatches[0].matches[0].data;

        expect(onSubmit).not.toHaveBeenCalled();
        expect(onSelect).toHaveBeenCalledWith(firstMatchData);
      });
    });

    describe('when no matches are found', () => {
      const props = {
        ...minimalProps,
        notFound: true
      };

      it('shows a "not found" message', () => {
        const { container } = render(<AutosuggestSearchField {...props} />);

        const panel = container.querySelector('.autosuggestionPlate');
        const defaultMessage = AutosuggestSearchField.defaultProps.notFoundText;

        expect(panel?.textContent).toBe(defaultMessage);
      });

      it('respects the notFoundText prop when displaying the message', () => {
        const notFoundText = faker.lorem.words();
        const { container } = render(
          <AutosuggestSearchField {...props} notFoundText={notFoundText} />
        );

        const panel = container.querySelector('.autosuggestionPlate');

        expect(panel?.textContent).toBe(notFoundText);
      });
    });
  });
});
