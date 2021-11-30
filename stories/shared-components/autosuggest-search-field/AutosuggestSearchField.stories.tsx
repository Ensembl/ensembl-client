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

import React, { useState, useEffect } from 'react';

import AutosuggestSearchField from 'src/shared/components/autosuggest-search-field/AutosuggestSearchField';
import QuestionButton from 'src/shared/components/question-button/QuestionButton';

import notes from './autosuggestSearchField.md';

import * as matches from 'tests/data/species-selector/species-search';

import styles from './AutosuggestSearchField.stories.scss';

type DefaultArgs = {
  onSelect: (...args: any) => void;
  onSubmit: (...args: any) => void;
};

const ItemWrapper = (props: any) => <span>{props.description}</span>;

const groupedMatches = [
  {
    matches: [
      {
        data: matches.human38Match,
        element: <ItemWrapper {...matches.human38Match} />
      },
      {
        data: matches.human37Match,
        element: <ItemWrapper {...matches.human37Match} />
      }
    ]
  },
  {
    matches: [
      {
        data: matches.azospirillumMatch,
        element: <ItemWrapper {...matches.azospirillumMatch} />
      }
    ]
  }
];

const Wrapper = (props: any) => {
  const [value, setValue] = useState('');
  const [isSelected, setIsSelected] = useState(false);
  const { searchField: AutosuggestSearchField, ...otherProps } = props;

  useEffect(() => {
    setIsSelected(false);
  }, [value]);

  return (
    <div>
      <AutosuggestSearchField
        search={value}
        onChange={setValue}
        onSubmit={(value: string) => {
          setIsSelected(true);
          props.onSelect(value);
        }}
        onSelect={(match: any) => {
          const { description } = match;
          setValue(description);
          // allow time for the isSelected state value to get updated
          setTimeout(() => setIsSelected(true), 0);
          props.onSubmit(description);
        }}
        canShowSuggestions={!isSelected}
        className={styles.autosuggestSearchField}
        searchFieldClassName={styles.autosuggestSearchFieldInput}
        {...otherProps}
      />
    </div>
  );
};

const RightCorner = () => <QuestionButton helpText="this is a hint" />;

export const MatchesSubmissionStory = (args: DefaultArgs) => (
  <div className={styles.container}>
    <p>For description of the component's behaviour, see the Notes tab.</p>
    <div className={styles.example}>
      <p>
        Notice how the first match is immediately selected. Check the Actions
        panel to see what gets submitted.
      </p>
      <Wrapper
        searchField={AutosuggestSearchField}
        matchGroups={groupedMatches}
        rightCorner={<RightCorner />}
        {...args}
      />
    </div>
    <div className={styles.example}>
      <p>
        If no matches were found, pressing Enter will not submit the raw search
        string.
      </p>
      <Wrapper
        searchField={AutosuggestSearchField}
        rightCorner={<RightCorner />}
        {...args}
      />
    </div>
  </div>
);

MatchesSubmissionStory.storyName = 'allowing only submission of matches';

export const RawSearchSubmissionStory = (args: DefaultArgs) => (
  <div className={styles.container}>
    <div className={styles.example}>
      <p>
        Notice that, as opposed to the other variant, first suggestion is not
        automatically pre-selected. Pressing enter when no suggestion is
        selected will submit current content of the search field (see the
        Actions panel).
      </p>
      <Wrapper
        searchField={AutosuggestSearchField}
        matchGroups={groupedMatches}
        allowRawInputSubmission={true}
        rightCorner={<RightCorner />}
        {...args}
      />
    </div>
    <div className={styles.example}>
      <p>
        When no matches are available, pressing enter will submit the current
        content of the field.
      </p>
      <Wrapper
        searchField={AutosuggestSearchField}
        allowRawInputSubmission={true}
        rightCorner={<RightCorner />}
        {...args}
      />
    </div>
  </div>
);

RawSearchSubmissionStory.storyName = 'allowing raw search submission';

export default {
  title: 'Components/Shared Components/AutosuggestSearchField',
  parameters: {
    notes
  },
  argTypes: {
    onSelect: { action: 'selected' },
    onSubmit: { action: 'submitted' }
  }
};
