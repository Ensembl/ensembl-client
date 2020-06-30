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

import React from 'react';
import classNames from 'classnames';

import defaultStyles from './Checkbox.scss';

type ClassNames = Partial<{
  checkboxHolder: string;
  checked: string;
  unchecked: string;
  disabled: string;
}>;

type WithoutLabelProps = {
  onChange: (status: boolean) => void;
  classNames?: ClassNames;
  disabled?: boolean;
  checked: boolean;
};

type WithLabelProps = WithoutLabelProps & {
  label: string;
  labelClassName?: string;
};

export type CheckboxProps = WithLabelProps | WithoutLabelProps;

const isWithLabel = (props: CheckboxProps): props is WithLabelProps => {
  return 'label' in props;
};

const Checkbox = (props: CheckboxProps) => {
  const handleOnChange = () => {
    // Do nothing if it is disabled
    if (props.disabled) {
      return;
    }

    // Call the onChange function
    props.onChange(!props.checked);
  };

  const styles = { ...defaultStyles };
  for (const className in props.classNames) {
    const newClassName = classNames(
      defaultStyles[className],
      (props.classNames as any)[className]
    );
    styles[className] = newClassName;
  }

  const className = classNames(
    styles.defaultCheckbox,
    { [styles.checked]: props.checked },
    { [styles.unchecked]: !props.checked },
    { [styles.disabled]: props.disabled }
  );
  const labelClassName = classNames(
    styles.defaultLabel,
    isWithLabel(props) && props.labelClassName
  );

  return (
    <div className={styles.checkboxHolder}>
      <input
        type="checkbox"
        className={styles.hiddenInput}
        onChange={handleOnChange}
        checked={props.checked}
      />
      <div onClick={handleOnChange} className={className} />
      {isWithLabel(props) && (
        <label onClick={handleOnChange} className={labelClassName}>
          {props.label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
