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
  memo,
  type FunctionComponent,
  type ButtonHTMLAttributes
} from 'react';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';

import useHover from 'src/shared/hooks/useHover';

import Tooltip from 'src/shared/components/tooltip/Tooltip';

import { Status } from 'src/shared/types/status';

import styles from './ImageButton.scss';

export type ImageButtonStatus =
  | Status.DEFAULT
  | Status.SELECTED
  | Status.UNSELECTED
  | Status.DISABLED;

type ChildlessButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'disabled' // removing the 'disabled' property, because whether the button is disabled will be controlled  via its status
>;

export type Props = ChildlessButtonProps & {
  status?: ImageButtonStatus;
  description?: string;
  image: FunctionComponent | string;
};

export const ImageButton = (props: Props) => {
  const {
    status = Status.DEFAULT,
    description,
    image: Image,
    className: classNameFromProps,
    type: buttonTypeFromProps,
    ...otherProps
  } = props;
  const [hoverRef, isHovered] = useHover<HTMLDivElement>();

  const imageButtonClasses = classNames(
    styles.imageButton,
    styles[status],
    classNameFromProps
  );
  const buttonType = buttonTypeFromProps ?? 'button'; // by default, we want the html button element in ImageButton to be of type 'button'

  const shouldShowTooltip = Boolean(description) && isHovered;

  /**
   * ARCHITECTURE OF THE IMAGE BUTTON:
   * - The top-level element returned from this component is a div. The reason is that we want to be able
   *   to respond to mouseover events even when the image button is in a disabled status,
   *   in order to show the tooltip when there is something to show.
   *   HTML button elements do not fire any events when disabled; and there doesn't seem to be a clean way
   *   to bypass this native browser behaviour. Hence the need for the top-level div.
   * - Nonetheless, ImageButton also has an html button element. The reason is that we want to be as close to the native browser
   *   behaviour as possible; and buttons are great at handling disabled state, focus, key presses, etc.
   * - The className property passed from the parent will be applied to the top-level div element rather than
   *   to the button element, so as to make this component behave correctly when modified from the parent
   *   (e.g. when the parent applies a margin to ImageButton)
   */

  return (
    <div ref={hoverRef} className={imageButtonClasses}>
      <button
        type={buttonType}
        {...otherProps}
        disabled={status === Status.DISABLED}
      >
        {typeof props.image === 'string' ? (
          <img src={props.image} alt={description} />
        ) : (
          <Image />
        )}
      </button>
      {shouldShowTooltip && (
        <Tooltip anchor={hoverRef.current} autoAdjust={true}>
          {description}
        </Tooltip>
      )}
    </div>
  );
};

export default memo(ImageButton, isEqual);
