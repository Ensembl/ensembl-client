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
import classNames from 'classnames';

import Input from './Input';

import styles from './Input.scss';

export type Props = InputHTMLAttributes<HTMLInputElement> & {
  rightCorner?: ReactNode;
};

const FlatInput = (props: Props, ref: ForwardedRef<HTMLInputElement>) => {
  const {
    className: classNameFromProps,
    disabled = false,
    rightCorner,
    ...otherProps
  } = props;

  const wrapperClasses = classNames(
    styles.flatInputWrapper,
    classNameFromProps,
    { [styles.flatInputWrapperDisabled]: disabled }
  );

  const shouldShowRightCorner = rightCorner && !disabled;

  return (
    <div className={wrapperClasses}>
      <Input disabled={disabled} ref={ref} {...otherProps} />
      {shouldShowRightCorner && (
        <div className={styles.rightCorner}>{rightCorner}</div>
      )}
    </div>
  );
};

export default forwardRef(FlatInput);
