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

import Input, { Props as InputProps } from './Input';

import styles from './Input.scss';

const ShadedInput = (props: InputProps) => {
  const { className, ...otherProps } = props;

  const inputClasses = classNames(styles.shadedInput, className);

  return <Input className={inputClasses} {...otherProps} />;
};

ShadedInput.defaultProps = {
  callbackWithEvent: false
};

export default ShadedInput;
