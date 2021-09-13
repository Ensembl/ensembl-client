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

import React, { useState } from 'react';

import SearchField from 'src/shared/components/search-field/SearchField';
import QuestionButton from 'src/shared/components/question-button/QuestionButton';
import { CircleLoader } from 'ensemblRoot/src/shared/components/loader';

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

export const DefaultSearchFieldStory = () => (
  <>
    <Wrapper
      searchField={SearchField}
      className={styles.searchField}
      rightCorner={<QuestionButton helpText="This is a hint" />}
    />
  </>
);

DefaultSearchFieldStory.storyName = 'default';

export const SearchFieldWithLoaderStory = () => (
  <Wrapper
    searchField={SearchField}
    className={styles.searchField}
    rightCorner={<CircleLoader className={styles.circleLoader} />}
  />
);

SearchFieldWithLoaderStory.storyName = 'with loader';

export default {
  title: 'Components/Shared Components/SearchField'
};
