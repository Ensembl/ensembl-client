import React, { useState, useEffect } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AutosuggestSearchField from 'src/shared/autosuggest-search-field/AutosuggestSearchField';
import QuestionButton from 'src/shared/question-button/QuestionButton';

import notes from './autosuggestSearchField.md';

import * as matches from 'tests/data/species-selector/species-search';

import styles from './AutosuggestSearchField.stories.scss';

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
    <div className={styles.autosuggestSearchFieldWrapper}>
      <AutosuggestSearchField
        search={value}
        onChange={setValue}
        onSubmit={() => {
          setIsSelected(true);
          action('autosuggest-search-field-submit');
        }}
        onSelect={(match: any) => {
          const { description } = match;
          setValue(description);
          // to avoid resetting isSelected to false, allow first the value state to get updated
          setTimeout(() => setIsSelected(true), 0);
          action('autosuggest-search-field-select')(description);
        }}
        canShowSuggestions={!isSelected}
        {...otherProps}
      />
    </div>
  );
};

storiesOf('Components|Shared Components/AutosuggestSearchField', module)
  .add(
    'default',
    () => (
      <Wrapper
        searchField={AutosuggestSearchField}
        className={styles.autosuggestSearchField}
        matchGroups={groupedMatches}
        rightCorner={
          <QuestionButton onHover={action('question-button-hover')} />
        }
      />
    ),
    { notes }
  )
  .add(
    'allowing raw search submission',
    () => (
      <Wrapper
        searchField={AutosuggestSearchField}
        className={styles.autosuggestSearchField}
        matchGroups={groupedMatches}
        allowRawInputSubmission={true}
        rightCorner={
          <QuestionButton onHover={action('question-button-hover')} />
        }
      />
    ),
    { notes }
  );
