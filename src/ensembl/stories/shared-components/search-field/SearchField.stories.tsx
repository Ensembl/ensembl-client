import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import SearchField from 'src/shared/search-field/SearchField';
import QuestionButton from 'src/shared/question-button/QuestionButton';
import { CircleLoader } from 'src/shared/loader/Loader';

import styles from './SearchField.stories.scss';

const Wrapper = (props: any) => {
  const [value, setValue] = useState('');
  const { searchField: SearchField, ...otherProps } = props;

  return (
    <div className={styles.searchFieldWrapper}>
      <SearchField value={value} onChange={setValue} {...otherProps} />
    </div>
  );
};

storiesOf('Components|Shared Components/SearchField', module)
  .add('default', () => (
    <Wrapper
      searchField={SearchField}
      className={styles.searchField}
      rightCorner={<QuestionButton onHover={action('question-button-hover')} />}
    />
  ))
  .add('with loader', () => (
    <Wrapper
      searchField={SearchField}
      className={styles.searchField}
      rightCorner={<CircleLoader className={styles.circleLoader} />}
    />
  ));
