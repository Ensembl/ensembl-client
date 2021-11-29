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

import React, { forwardRef, TextareaHTMLAttributes, ForwardedRef } from 'react';
import classNames from 'classnames';

import styles from './Textarea.scss';

export type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  resizable?: boolean;
};

const Textarea = (props: Props, ref: ForwardedRef<HTMLTextAreaElement>) => {
  const {
    className: classNameFromProps,
    resizable = true,
    ...otherProps
  } = props;

  const className = classNames(styles.textarea, classNameFromProps, {
    [styles.disableResize]: !resizable
  });

  return <textarea ref={ref} className={className} {...otherProps} />;
};

export default forwardRef(Textarea);
