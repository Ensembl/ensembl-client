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

import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { faker } from '@faker-js/faker';

import AutosuggestSearchField from '../AutosuggestSearchField';
import Suggestion from '../Suggestion';

import { genomeGroupMatches, singleGenomeMatches } from './testData';

const GenomeGroupMatch = ({
  match
}: {
  match: (typeof genomeGroupMatches)[0];
}) => {
  return (
    <Suggestion data={match}>
      <span>{match.name} </span>
      <span className="genome-counts">{match.genomesCount} genomes</span>
    </Suggestion>
  );
};

const GenomeMatch = ({ match }: { match: (typeof singleGenomeMatches)[0] }) => {
  const className = match.format ? 'italic' : undefined;
  return (
    <Suggestion data={match} className={className}>
      {match.name}
    </Suggestion>
  );
};

const Suggestions = () => {
  const groupMatches = genomeGroupMatches.map((match, index) => (
    <GenomeGroupMatch match={match} key={index} />
  ));

  const singleMatches = singleGenomeMatches.map((match, index) => (
    <GenomeMatch match={match} key={index} />
  ));

  return (
    <>
      {groupMatches}
      <hr />
      {singleMatches}
    </>
  );
};

describe('<AutosuggestSearchField />', () => {
  const query = faker.lorem.word();
  const onChange = vi.fn();
  const onSuggestionSelected = vi.fn();
  const onSubmit = vi.fn();

  const minimalProps = {
    query,
    onChange,
    onSuggestionSelected
  };

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('appearance', () => {
    it('renders the search field without suggestions', async () => {
      const screen = await render(<AutosuggestSearchField {...minimalProps} />);

      const inputField = screen.getByRole('textbox');
      await expect.element(inputField).toBeVisible();
      expect((inputField.element() as HTMLInputElement).value).toBe(query);
    });

    it('renders suggestions if they are provided', async () => {
      const screen = await render(
        <AutosuggestSearchField
          {...minimalProps}
          suggestions={<Suggestions />}
        />
      );

      const expectedNumberOfMatches =
        genomeGroupMatches.length + singleGenomeMatches.length;

      const inputField = screen.getByRole('textbox');
      await expect.element(inputField).toBeVisible();
      expect((inputField.element() as HTMLInputElement).value).toBe(query);
      await expect
        .poll(() => {
          return screen.baseElement.querySelectorAll('[data-type="suggestion"]')
            .length;
        })
        .toBe(expectedNumberOfMatches);
    });
  });

  describe('behaviour', () => {
    const props = {
      ...minimalProps,
      suggestions: <Suggestions />,
      onSubmit
    };

    test('selecting search suggestion with a mouse', async () => {
      const screen = await render(<AutosuggestSearchField {...props} />);

      const allSuggestions = [...genomeGroupMatches, ...singleGenomeMatches];

      const suggestionIndex = 1;
      const suggestionForTest = allSuggestions.at(suggestionIndex);

      const suggestionElement = page.getByText(suggestionForTest!.name);
      await expect.element(suggestionElement).toBeVisible();

      // do some DOM queries to prepare for subsequent assertions
      const rootDOMElement = screen.baseElement;
      const suggestionDOMElement = rootDOMElement.querySelectorAll(
        '[data-type="suggestion"]'
      )[suggestionIndex];

      await suggestionElement.click();

      expect(onSuggestionSelected).toHaveBeenCalled();
      expect(onSuggestionSelected).toHaveBeenCalledWith({
        index: suggestionIndex,
        data: suggestionForTest,
        element: suggestionDOMElement
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    test('selecting search suggestion via keyboard', async () => {
      const screen = await render(<AutosuggestSearchField {...props} />);

      const allSuggestions = [...genomeGroupMatches, ...singleGenomeMatches];

      const suggestionIndex = 1;

      // do some DOM queries to prepare for subsequent assertions
      const rootDOMElement = screen.baseElement;
      const suggestionDOMElement = rootDOMElement.querySelectorAll(
        '[data-type="suggestion"]'
      )[suggestionIndex];
      const suggestedSearchData = allSuggestions[suggestionIndex];

      const inputField = screen.getByRole('textbox');
      await inputField.click();

      for (let i = 0; i <= suggestionIndex; i++) {
        await userEvent.keyboard('{ArrowDown}');
      }

      await userEvent.keyboard('{Enter}');

      expect(onSuggestionSelected).toHaveBeenCalledWith({
        index: suggestionIndex,
        data: suggestedSearchData,
        element: suggestionDOMElement
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    test('submitting search query via keyboard without selecting suggestion', async () => {
      const screen = await render(<AutosuggestSearchField {...props} />);

      const inputField = screen.getByRole('textbox');
      await inputField.click();
      await userEvent.keyboard('{Enter}');

      expect(onSuggestionSelected).not.toHaveBeenCalled();
      expect(onSubmit).toHaveBeenCalledWith(query);
    });

    describe('inside a form', () => {
      const formSumbitHandler = vi.fn((event) => {
        event.preventDefault(); // otherwise, form submit event will cause browser navigation, and vitest will be unhappy
      });

      test('prevents submit event if props include dedicated onSubmit handler', async () => {
        const screen = await render(
          <form onSubmit={formSumbitHandler}>
            <AutosuggestSearchField {...minimalProps} onSubmit={onSubmit} />
          </form>
        );

        const inputField = screen.getByRole('textbox');
        await inputField.click();
        await userEvent.keyboard('{Enter}');

        expect(formSumbitHandler).not.toHaveBeenCalled();
        expect(onSubmit).toHaveBeenCalledWith(query);
      });

      test('allows regular form submission if props do not include onSubmit handler', async () => {
        const screen = await render(
          <form onSubmit={formSumbitHandler}>
            <AutosuggestSearchField {...minimalProps} />
          </form>
        );

        const inputField = screen.getByRole('textbox');
        await inputField.click();
        await userEvent.keyboard('{Enter}');

        expect(formSumbitHandler).toHaveBeenCalled();
        expect(onSubmit).not.toHaveBeenCalledWith(query);
      });
    });
  });
});
