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
import classNames from 'classnames';

import { isEnvironment, Environment } from 'src/shared/helpers/environment';

import SearchField from 'src/shared/components/search-field/SearchField';
import QuestionButton, {
  QuestionButtonOption
} from 'src/shared/components/question-button/QuestionButton';

import styles from './InAppSearch.scss';

type Props = {
  className?: string;
};

const InAppSearch = (props: Props) => {
  const [value, setValue] = useState('');

  const searchFieldWrapperClasses = classNames(
    styles.searchFieldWrapper,
    props.className
  );

  if (isEnvironment([Environment.PRODUCTION])) {
    return <div className={styles.fauxSearchField}>Gene ID or name...</div>;
  }

  return (
    <div>
      <div className={searchFieldWrapperClasses}>
        <SearchField
          placeholder="Gene ID or name..."
          search={value}
          onChange={setValue}
          className={styles.searchField}
          rightCorner={
            <QuestionButton
              helpText="This is a hint"
              styleOption={QuestionButtonOption.INPUT}
            />
          }
        />
      </div>

      {/* <InAppCommitButton /> */}
    </div>
  );
};

export default InAppSearch;
