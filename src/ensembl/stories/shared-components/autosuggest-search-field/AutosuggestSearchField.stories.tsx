import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AutosuggestSearchField from 'src/shared/autosuggest-search-field/AutosuggestSearchField';
import QuestionButton from 'src/shared/question-button/QuestionButton';

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
  const { searchField: AutosuggestSearchField, ...otherProps } = props;

  return (
    <div className={styles.autosuggestSearchFieldWrapper}>
      <AutosuggestSearchField
        value={value}
        onChange={setValue}
        {...otherProps}
      />
    </div>
  );
};

storiesOf('Components|Shared Components/AutosuggestSearchField', module).add(
  'default',
  () => (
    <Wrapper
      searchField={AutosuggestSearchField}
      className={styles.autosuggestSearchField}
      matchGroups={groupedMatches}
      rightCorner={<QuestionButton onHover={action('question-button-hover')} />}
    />
  )
);
