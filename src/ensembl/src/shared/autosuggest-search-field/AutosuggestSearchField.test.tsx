import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';
import times from 'lodash/times';
import random from 'lodash/random';

import * as keyCodes from 'src/shared/constants/keyCodes';

import AutosuggestSearchField from './AutosuggestSearchField';
import AutosuggestionPanel, { GroupOfMatchesType } from './AutosuggestionPanel';
import SearchField from 'src/shared/search-field/SearchField';
import Input from 'src/shared/input/Input';

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
  const onChange = jest.fn();
  const onSelect = jest.fn();
  const onSubmit = jest.fn();
  const search = faker.lorem.word();
  const groupsOfMatches = times(2, () => generateGroupOfMatches());

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('appearance', () => {
    test('renders only search field if no matches have been found', () => {
      const mountedComponent = mount(
        <AutosuggestSearchField
          search={search}
          onChange={onChange}
          onSelect={onSelect}
          matchGroups={[]}
        />
      );

      expect(mountedComponent.find(SearchField).length).toBe(1);
      expect(mountedComponent.find(Input).prop('value')).toBe(search);
      expect(mountedComponent.find(AutosuggestionPanel).length).toBe(0);
    });

    test('renders AutosuggestionPanel with matches if they are provided', () => {
      const mountedComponent = mount(
        <AutosuggestSearchField
          search={search}
          onChange={onChange}
          onSelect={onSelect}
          matchGroups={groupsOfMatches}
        />
      );

      const expectedNumberOfMatches = groupsOfMatches.reduce((sum, group) => {
        const numberOfMatchesInGroup = group.matches.length;
        return sum + numberOfMatchesInGroup;
      }, 0);

      expect(mountedComponent.find(SearchField).length).toBe(1);
      expect(mountedComponent.find(Input).prop('value')).toBe(search);
      expect(mountedComponent.find(AutosuggestionPanel).length).toBe(1);
      expect(mountedComponent.find('.autosuggestionPlateItem').length).toBe(
        expectedNumberOfMatches
      );
    });
  });

  describe('behaviour', () => {
    describe('general behavour', () => {
      let mountedComponent: any;

      beforeEach(() => {
        mountedComponent = mount(
          <AutosuggestSearchField
            search={search}
            onChange={onChange}
            onSelect={onSelect}
            matchGroups={groupsOfMatches}
          />
        );
      });

      test('clicking on a suggested match submits its data', () => {
        const suggestedItems = mountedComponent.find(
          '.autosuggestionPlateItem'
        );

        const randomItemIndex = random(0, suggestedItems.length - 1);
        const randomItem = suggestedItems.at(randomItemIndex);
        const itemsData = groupsOfMatches.reduce(
          (result, group) => {
            return [...result, ...group.matches.map(({ data }) => data)];
          },
          [] as any
        );

        const expectedItemData = itemsData[randomItemIndex];

        randomItem.simulate('click');

        expect(onSelect).toHaveBeenCalledWith(expectedItemData);
      });

      test('pressing the ArrowDown button selects next item', () => {
        const searchField = mountedComponent.find('input');
        searchField.simulate('keydown', { keyCode: keyCodes.DOWN });

        const suggestedItems = mountedComponent.find(
          '.autosuggestionPlateItem'
        );

        // initially, the first item was selected; so we now expect the second one to be
        expect(
          suggestedItems.at(1).hasClass('autosuggestionPlateHighlightedItem')
        ).toBe(true);
      });

      test('pressing the ArrowUp button selects previous item', () => {
        const searchField = mountedComponent.find('input');
        searchField.simulate('keydown', { keyCode: keyCodes.UP });

        const suggestedItems = mountedComponent.find(
          '.autosuggestionPlateItem'
        );
        const expectedIndex = suggestedItems.length - 1;

        // initially, the first item was selected; so we now expect the last one to be
        expect(
          suggestedItems
            .at(expectedIndex)
            .hasClass('autosuggestionPlateHighlightedItem')
        ).toBe(true);
      });
    });

    describe('when raw input submission is not allowed', () => {
      let mountedComponent: any;

      beforeEach(() => {
        mountedComponent = mount(
          <AutosuggestSearchField
            search={search}
            onChange={onChange}
            onSelect={onSelect}
            matchGroups={groupsOfMatches}
          />
        );
      });

      test('first match in AutosuggestionPanel is pre-selected', () => {
        const suggestedItems = mountedComponent.find(
          '.autosuggestionPlateItem'
        );
        const highlightedItems = mountedComponent.find(
          '.autosuggestionPlateHighlightedItem'
        );

        expect(highlightedItems.length).toBe(1);
        expect(
          suggestedItems.at(0).hasClass('autosuggestionPlateHighlightedItem')
        ).toBe(true);
      });

      test('triggering submit event confirms selection of a match', () => {
        const searchField = mountedComponent.find(SearchField);
        searchField.simulate('submit');

        const firstMatchData = groupsOfMatches[0].matches[0].data;

        expect(onSelect).toHaveBeenCalledWith(firstMatchData);
      });
    });

    describe('when raw input submission is allowed', () => {
      let mountedComponent: any;

      beforeEach(() => {
        mountedComponent = mount(
          <AutosuggestSearchField
            search={search}
            onChange={onChange}
            onSelect={onSelect}
            matchGroups={groupsOfMatches}
            allowRawInputSubmission={true}
            onSubmit={onSubmit}
          />
        );
      });

      test('first match in AutosuggestionPanel is not pre-selected', () => {
        const highlightedItems = mountedComponent.find(
          '.autosuggestionPlateHighlightedItem'
        );

        expect(highlightedItems.length).toBe(0);
      });

      test('triggering submit event submits current search value if no match is selected', () => {
        const searchField = mountedComponent.find(SearchField);
        searchField.simulate('submit');

        expect(onSubmit).toHaveBeenCalledWith(search);
        expect(onSelect).not.toHaveBeenCalled();
      });

      test('triggering submit event confirms selection of a match if the match is selected', () => {
        // highlight the first match
        const searchField = mountedComponent.find('input');
        searchField.simulate('keydown', { keyCode: keyCodes.DOWN });

        searchField.simulate('submit');

        const firstMatchData = groupsOfMatches[0].matches[0].data;

        expect(onSubmit).not.toHaveBeenCalled();
        expect(onSelect).toHaveBeenCalledWith(firstMatchData);
      });
    });
  });
});
