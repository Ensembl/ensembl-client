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
import type { ComponentProps } from 'react';

import CloseIcon from 'static/icons/icon_close.svg';

import styles from './CloseButton.module.css';

type Props = Omit<ComponentProps<'button'>, 'children'>;

const CloseButton = (props: Props) => {
  const className = classNames(styles.closeButton, props.className);
  return (
    <button {...props} type="button" className={className}>
      <CloseIcon className={styles.icon} />
    </button>
  );
};

/**
 * Design mock-ups are showing a common pattern of a close button
 * accompanied by a short label either to the left or to the right of the button.
 * Both the label and the button are clickable.
 * This component captures this simple arrangement.
 * For anything more complicated, please use constituent components separately.
 */
export const CloseButtonWithLabel = (
  props: Props & {
    label?: string;
    labelPosition?: 'left' | 'right';
  }
) => {
  const {
    label = 'Close',
    labelPosition = 'left',
    className: classNameFromProps
  } = props;

  const componentClasses = classNames(
    styles.closeButtonWithLabel,
    classNameFromProps
  );

  const closeIcon = <CloseIcon className={styles.icon} />;

  const buttonContent =
    labelPosition === 'left' ? (
      <>
        <span>{label}</span>
        {closeIcon}
      </>
    ) : (
      <>
        {closeIcon}
        <span>{label}</span>
      </>
    );

  return (
    <button {...props} type="button" className={componentClasses}>
      {buttonContent}
    </button>
  );
};

export default CloseButton;
