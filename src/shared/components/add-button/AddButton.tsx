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

import PlusIcon from 'static/icons/icon_plus_circle.svg';

import styles from './AddButton.module.css';

// same props as for a button; but children are required
type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children: ReactNode;
};

/**
 * This is a combination of a label (passed as a children property and placed to the left),
 * and the plus icon (placed to the right).
 * If you only want the plus icon to act as a button, please use the PlusButton component.
 * Alternatively, if you only want text to act as a button, please use the TextButton component.
 */
const AddButton = (props: Props) => {
  const { children, className, ...otherProps } = props;

  const buttonClasses = classNames(styles.button, className);

  return (
    <button {...otherProps} className={buttonClasses}>
      {children}
      <PlusIcon />
    </button>
  );
};

export default AddButton;
