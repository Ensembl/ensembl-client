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
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import times from 'lodash/times';
import faker from 'faker';

import EntityViewerTranscriptFilter from 'src/content/app/entity-viewer/components/transcript-filter/EntityViewerTranscriptFilter';

import styles from './TranscriptFilter.stories.scss';

const createOption = () => {
  return {
    value: faker.random.uuid(),
    label: faker.random.words()
  };
};

const createOptionGroup = () => {
  return times(5, () => createOption());
};

const optionGroups = times(3, () => createOptionGroup());

const getRandomSelectedValues = () => {
  const randomSelectedValues: string[] = [];

  optionGroups.forEach((options) =>
    randomSelectedValues.push(
      options[Math.floor(Math.random() * options.length)].value
    )
  );

  return randomSelectedValues;
};

const selectedValues = getRandomSelectedValues();

const Wrapper = (props: any) => {
  const [values, setValues] = useState(selectedValues);

  const onChange = (values: string[]) => {
    setValues(values);
    action('entity-viewer-filters-changed')(values);
  };

  return (
    <div className={styles.defaultWrapper}>
      {
        <EntityViewerTranscriptFilter
          optionGroups={optionGroups}
          onChange={onChange}
          selectedValues={values}
          {...props}
        />
      }
    </div>
  );
};

storiesOf('Components|EntityViewer/Transcript Filter', module)
  .add('expanded', () => {
    return <Wrapper />;
  })
  .add('collapsed', () => {
    return <Wrapper isExpanded={false} />;
  });
