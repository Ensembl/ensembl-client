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
import type { ComponentPropsWithRef } from 'react';

import TrashcanIcon from 'static/icons/icon_delete.svg';

import styles from './DeleteButton.module.css';

type Props = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
  disabled?: boolean;
};

const DeleteButton = (props: Props) => {
  const iconClasses = classNames(styles.deleteButton, {
    [styles.deleteButtonDisabled]: props.disabled
  });

  return (
    <button {...props}>
      <TrashcanIcon className={iconClasses} />
    </button>
  );
};

/**
 * Design mock-ups are showing a common pattern of a delete button
 * accompanied by a short label typically to the left of the button.
 * Both the label and the button are clickable.
 * This component captures this simple arrangement.
 * For anything more complicated, please use constituent components separately.
 */
export const DeleteButtonWithLabel = (
  props: Props & {
    label?: string;
    labelPosition?: 'left' | 'right';
  }
) => {
  const {
    label = 'Remove',
    labelPosition = 'left',
    onClick,
    className: classNameFromProps,
    ...otherProps
  } = props;

  const componentClasses = classNames(
    styles.deleteButtonWithLabel,
    classNameFromProps
  );

  const iconClasses = classNames(styles.deleteButton, {
    [styles.deleteButtonDisabled]: props.disabled
  });
  const deleteIcon = <TrashcanIcon className={iconClasses} />;

  const buttonContent =
    labelPosition === 'left' ? (
      <>
        <span>{label}</span>
        {deleteIcon}
      </>
    ) : (
      <>
        {deleteIcon}
        <span>{label}</span>
      </>
    );

  return (
    <button
      type="button"
      onClick={onClick}
      className={componentClasses}
      {...otherProps}
    >
      {buttonContent}
    </button>
  );
};

export default DeleteButton;
