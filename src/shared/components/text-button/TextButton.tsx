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
import type { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './TextButton.module.css';

// same props as for a button; but children are required
type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children: ReactNode;
};

export const TextButton = (props: Props) => {
  const buttonClasses = classNames(styles.textButton, props.className);

  return (
    <button {...props} className={buttonClasses}>
      {props.children}
    </button>
  );
};

export default TextButton;
