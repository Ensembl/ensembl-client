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

import { useLayoutEffect, useRef, type ComponentProps } from 'react';
import classNames from 'classnames';

import styles from './Checkbox.module.css';

/**
 * NOTE: the purpose of this component is to style the native browser input element.
 * Apart from the styling, it keeps the same api as the native input.
 *
 * If you need a component that pre-styles a checkbox combined with a label,
 * please use the CheckboxWithLabel component.
 */

type CheckedState = boolean | 'indeterminate';

// The type of the input used in this comoponent is always 'checkbox';
// so the parent should have no reason to pass the "type" property to the component
type Props = Omit<ComponentProps<'input'>, 'type' | 'checked'> & {
  checked?: CheckedState;
};

const Checkbox = (props: Props) => {
  const {
    className: classNameFromProps,
    checked,
    ref: refFromProps,
    ...otherProps
  } = props;

  const localRef = useRef<HTMLInputElement>(null);

  const setRef = (element: HTMLInputElement) => {
    localRef.current = element;
    let parentCleanup: void | (() => void);
    if (typeof refFromProps === 'function') {
      parentCleanup = refFromProps(element);
    } else if (refFromProps) {
      refFromProps.current = element;
    }
    return () => {
      localRef.current = null;
      parentCleanup?.();
    };
  };

  useLayoutEffect(() => {
    if (localRef.current) {
      localRef.current.indeterminate = checked === 'indeterminate';
    }
  }, [checked]);

  const checkboxClasses = classNames(styles.checkbox, classNameFromProps);

  const isChecked = checked === undefined ? undefined : checked === true;

  return (
    <input
      {...otherProps}
      type="checkbox"
      className={checkboxClasses}
      ref={setRef}
      checked={isChecked}
    />
  );
};

export default Checkbox;
