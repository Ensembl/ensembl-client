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
  'children'
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
    ...otherProps
  } = props;
  const [hoverRef, isHovered] = useHover<HTMLDivElement>();

  const imageButtonClasses = classNames(
    styles.imageButton,
    styles[status],
    classNameFromProps
  );

  const shouldShowTooltip = Boolean(description) && isHovered;

  // NOTE: the only reason to wrap the button in a div element is so that we could react in a custon manner
  // to a hover event over a disabled button (i.e. show the tooltip).
  // If we were satisfied with just the `title` attribute, we wouldn't need this wrapper
  return (
    <div ref={hoverRef} className={styles.wrapper}>
      <button
        className={imageButtonClasses}
        {...otherProps}
        disabled={status === Status.DISABLED}
      >
        {typeof props.image === 'string' ? (
          <img src={props.image} alt={props.description} />
        ) : (
          <Image />
        )}
      </button>
      {shouldShowTooltip && (
        <Tooltip anchor={hoverRef.current} autoAdjust={true}>
          {props.description}
        </Tooltip>
      )}
    </div>
  );
};

export default memo(ImageButton, isEqual);
