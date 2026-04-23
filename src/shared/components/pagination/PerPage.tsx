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

import classNames from 'classnames';
import type { InputEvent } from 'react';

import SimpleSelect from 'src/shared/components/simple-select/SimpleSelect';

import styles from './PerPage.module.css';

export const defaultPerPageOptions = [10, 20, 50, 100];
export const defaultPerPageValue = 100; // one of the default options from the list above

export type Props = {
  options: number[];
  value: number;
  onChange: (val: number) => void;
  className?: string;
};

const PerPage = (props: Props) => {
  const onChange = (event: InputEvent<HTMLSelectElement>) => {
    const value = parseInt(event.currentTarget.value, 10);
    props.onChange(value);
  };

  const options = props.options.map((option) => ({
    value: `${option}`,
    label: `${option}`
  }));

  const componentClasses = classNames(styles.container, props.className);

  return (
    <div className={componentClasses}>
      <SimpleSelect
        value={props.value}
        onInput={onChange}
        options={options}
        className={props.className}
      />
      <span className={styles.label}>per page</span>
    </div>
  );
};

export default PerPage;
