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

import {
  useRef,
  useCallback,
  type ComponentPropsWithRef,
  type ReactNode
} from 'react';
import classNames from 'classnames';

import useClearInput from './useClearInput';
import useInputPlaceholder from './useInputPlaceholder';

import Input from './Input';
import CloseButton from 'src/shared/components/close-button/CloseButton';
import QuestionButton from 'src/shared/components/question-button/QuestionButton';

import styles from './Input.module.css';

export type InputSize = 'large' | 'small';

export type Props = Omit<ComponentPropsWithRef<'input'>, 'size'> & {
  size?: InputSize;
  help?: ReactNode;
};

// In accordance with the most common default browser behaviour,
// input of type search will show a button for clearing the text in the input

const ShadedInput = (props: Props) => {
  const {
    className: classNameFromProps,
    disabled = false,
    size,
    help,
    type = 'text',
    placeholder: placeholderFromProps,
    ...otherProps
  } = props;
  const innerRef = useRef<HTMLInputElement>(null);
  const { canClearInput, clearInput } = useClearInput({
    ref: innerRef,
    inputType: type,
    help,
    minLength: props.minLength
  });
  const placeholder = useInputPlaceholder(innerRef, placeholderFromProps);
  const callbackInputRef = useCallback(
    (el: HTMLInputElement) => {
      innerRef.current = el;
      if (props.ref) {
        if (props.ref instanceof Function) {
          props.ref(el);
        } else {
          props.ref.current = el;
        }
      }
      return () => {
        innerRef.current = null;
      };
    },
    [props.ref]
  );

  const wrapperClasses = classNames(
    styles.shadedInputWrapper,
    classNameFromProps,
    {
      [styles.shadedInputDisabled]: disabled,
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
        ref={callbackInputRef}
        disabled={disabled}
        type={type === 'search' ? undefined : props.type}
        placeholder={placeholder}
        {...otherProps}
      />
      {!disabled && rightCornerContent && (
        <div className={styles.rightCorner}>{rightCornerContent}</div>
      )}
    </div>
  );
};

export default ShadedInput;
