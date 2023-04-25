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

import useForwardedRef from 'src/shared/hooks/useForwardedRef';
import useClearInput from './useClearInput';
import useInputPlaceholder from './useInputPlaceholder';

import Input from './Input';
import CloseButton from 'src/shared/components/close-button/CloseButton';
import QuestionButton from 'src/shared/components/question-button/QuestionButton';

import styles from './Input.scss';

export type InputSize = 'large' | 'small';

export type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: InputSize;
  help?: ReactNode;
};

// In accordance with the most common default browser behaviour,
// input of type search will show a button for clearing the text in the input

const ShadedInput = (props: Props, ref: ForwardedRef<HTMLInputElement>) => {
  const {
    className: classNameFromProps,
    size,
    help,
    type = 'text',
    placeholder: placeholderFromProps,
    ...otherProps
  } = props;
  const innerRef = useForwardedRef<HTMLInputElement>(ref);
  const { canClearInput, clearInput } = useClearInput({
    ref: innerRef,
    inputType: type,
    help,
    minLength: props.minLength
  });
  const placeholder = useInputPlaceholder(innerRef, placeholderFromProps);

  const wrapperClasses = classNames(
    styles.shadedInputWrapper,
    classNameFromProps,
    {
      [styles.shadedInputWrapperLarge]: size === 'large',
      [styles.shadedInputWrapperSmall]: size === 'small'
    }
  );

  let rightCornerContent: ReactNode = null;

  if (canClearInput) {
    rightCornerContent = <CloseButton onClick={clearInput} />;
  } else if (help) {
    rightCornerContent = (
      <QuestionButton styleOption="in-input-field" helpText={help} />
    );
  }

  return (
    <div className={wrapperClasses}>
      <Input
        ref={innerRef}
        type={type === 'search' ? undefined : props.type}
        placeholder={placeholder}
        {...otherProps}
      />
      {rightCornerContent && (
        <div className={styles.rightCorner}>{rightCornerContent}</div>
      )}
    </div>
  );
};

export default forwardRef(ShadedInput);
