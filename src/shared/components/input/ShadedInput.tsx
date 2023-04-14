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

import React, {
  forwardRef,
  type InputHTMLAttributes,
  type ForwardedRef,
  type ReactNode
} from 'react';
import { upperFirst } from 'lodash';
import classNames from 'classnames';

import Input from './Input';

import styles from './Input.scss';

export type InputSize = 'large' | 'small';

export type Props = InputHTMLAttributes<HTMLInputElement> & {
  inputSize?: InputSize;
  rightCorner?: ReactNode;
};

const ShadedInput = (props: Props, ref: ForwardedRef<HTMLInputElement>) => {
  const {
    className: classNameFromProps,
    inputSize = 'small',
    rightCorner,
    ...otherProps
  } = props;
  const sizeClass = styles[`shadedInputWrapper${upperFirst(inputSize)}`];
  const wrapperClasses = classNames(
    styles.shadedInputWrapper,
    classNameFromProps,
    sizeClass
  );

  return (
    <div className={wrapperClasses}>
      <Input ref={ref} {...otherProps} />
      {rightCorner && <div className={styles.rightCorner}>{rightCorner}</div>}
    </div>
  );
};

export default forwardRef(ShadedInput);
