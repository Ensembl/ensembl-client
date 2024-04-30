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

import { useRef } from 'react';
import times from 'lodash/times';

import SimpleSelect, {
  type Option,
  type SimpleSelectMethods
} from 'src/shared/components/simple-select/SimpleSelect';
import { PrimaryButton } from 'src/shared/components/button/Button';

import styles from './SimpleSelect.stories.module.css';

const createSimpleOption = (value: string): Option => ({
  value,
  label: `option ${value}`
});

const createSimpleOptions = (number: number) => {
  return times(number, (time) => createSimpleOption(`${time + 1}`));
};

export const SimpleSelectDefaultStory = () => {
  const options = createSimpleOptions(15);

  return <SimpleSelect options={options}></SimpleSelect>;
};

SimpleSelectDefaultStory.storyName = 'default';

export const SimpleSelectDefaultValueStory = () => {
  const options = createSimpleOptions(15);
  const lastOption = options[options.length - 1];

  return <SimpleSelect options={options} defaultValue={lastOption.value} />;
};

SimpleSelectDefaultValueStory.storyName = 'with default value';

export const SimpleSelectWithPlaceholderStory = () => {
  const options = createSimpleOptions(15);

  return <SimpleSelect options={options} placeholder="Select an option" />;
};

SimpleSelectWithPlaceholderStory.storyName = 'with placeholder';

export const SimpleSelectWithResetStory = () => {
  const options = createSimpleOptions(15);
  const firstSelectRef = useRef<SimpleSelectMethods | null>(null);
  const secondSelectRef = useRef<SimpleSelectMethods | null>(null);

  const clearFirstSelect = () => {
    firstSelectRef.current?.clear();
  };

  const clearSecondSelect = () => {
    secondSelectRef.current?.clear();
  };

  return (
    <>
      <section>
        <p>For a select element with a placeholder</p>
        <SimpleSelect
          ref={firstSelectRef}
          options={options}
          placeholder="Select an option"
        />
        <div>
          <PrimaryButton
            className={styles.resetButton}
            onClick={clearFirstSelect}
          >
            Reset
          </PrimaryButton>
        </div>
      </section>
      <section>
        <p>For a select element with an initial value</p>
        <SimpleSelect
          ref={secondSelectRef}
          options={options}
          defaultValue={options.at(-1)?.value}
        />
        <div>
          <PrimaryButton
            className={styles.resetButton}
            onClick={clearSecondSelect}
          >
            Reset
          </PrimaryButton>
        </div>
      </section>
    </>
  );
};

SimpleSelectWithResetStory.storyName = 'reset to initial';

export const GroupedOptionsStory = () => {
  const options1 = createSimpleOptions(2);
  const options2 = createSimpleOptions(3);
  const options3 = createSimpleOptions(4);
  const optionGroups = [
    { options: options1, title: 'Group 1' },
    { options: options2, title: 'Group 2' },
    { options: options3, title: 'Group 3' }
  ];

  return <SimpleSelect optionGroups={optionGroups} />;
};

GroupedOptionsStory.storyName = 'groups of options';

export default {
  title: 'Components/Shared Components/SimpleSelect'
};
