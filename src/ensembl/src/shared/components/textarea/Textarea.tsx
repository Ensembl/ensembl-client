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
import noop from 'lodash/noop';

import styles from './Textarea.scss';

type PropsForRespondingWithEvents = {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus: (e: React.SyntheticEvent<HTMLTextAreaElement>) => void;
  onBlur: (e: React.SyntheticEvent<HTMLTextAreaElement>) => void;
  callbackWithEvent: true;
};

type PropsForRespondingWithData = {
  onChange: (value: string) => void;
  onFocus: (value?: string) => void;
  onBlur: (value?: string) => void;
  callbackWithEvent: false;
};

type OnChangeProps = PropsForRespondingWithEvents | PropsForRespondingWithData;

type Props = {
  value: string | number;
  id?: string;
  name?: string;
  autoFocus?: boolean;
  placeholder?: string;
  resizable: boolean;
  className?: string; // to customize textarea styling when using CSS modules
  onKeyUp: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
} & OnChangeProps;

const Textarea = (props: Props) => {
  const eventHandler = (eventName: string) => (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.FocusEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;

    if (eventName === 'change') {
      props.callbackWithEvent ? props.onChange(e) : props.onChange(value);
    } else if (eventName === 'focus') {
      props.callbackWithEvent ? props.onFocus(e) : props.onFocus(value);
    } else if (eventName === 'blur') {
      props.callbackWithEvent ? props.onBlur(e) : props.onBlur(value);
    }
  };

  const className = classNames(styles.textarea, props.className, {
    [styles.disableResize]: !props.resizable
  });

  return (
    <textarea
      id={props.id}
      name={props.name}
      autoFocus={props.autoFocus}
      placeholder={props.placeholder}
      className={className}
      value={props.value}
      onChange={eventHandler('change')}
      onFocus={eventHandler('focus')}
      onBlur={eventHandler('blur')}
      onKeyUp={props.onKeyUp}
      onKeyDown={props.onKeyDown}
      onKeyPress={props.onKeyPress}
    />
  );
};

Textarea.defaultProps = {
  callbackWithEvent: false,
  onFocus: noop,
  onBlur: noop,
  onKeyUp: noop,
  onKeyDown: noop,
  onKeyPress: noop,
  resizable: true
};

export default Textarea;
