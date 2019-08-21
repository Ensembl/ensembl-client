import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import SearchField from 'src/shared/components/search-field/SearchField';
import QuestionButton from 'src/shared/components/question-button/QuestionButton';
import { CircleLoader } from 'src/shared/components/loader/Loader';

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
      rightCorner={<QuestionButton helpText="This is a hint" />}
    />
  ))
  .add('with loader', () => (
    <Wrapper
      searchField={SearchField}
      className={styles.searchField}
      rightCorner={<CircleLoader className={styles.circleLoader} />}
    />
  ));
