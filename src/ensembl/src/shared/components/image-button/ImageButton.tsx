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

import React, { memo } from 'react';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';

import useHover from 'src/shared/hooks/useHover';

import Tooltip from 'src/shared/components/tooltip/Tooltip';

import { Status } from 'src/shared/types/status';

import imageButtonStyles from './ImageButton.scss';

export type ImageButtonStatus =
  | Status.DEFAULT
  | Status.SELECTED
  | Status.UNSELECTED
  | Status.DISABLED;

export type Props = {
  status: ImageButtonStatus;
  description: string;
  image: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | string;
  className?: string;
  statusClasses?: { [key in ImageButtonStatus]?: string };
  onClick?: () => void;
};

export const ImageButton = (props: Props) => {
  const [hoverRef, isHovered] = useHover<HTMLDivElement>();

  const handleClick = () => {
    props.onClick && props.onClick();
  };

  const buttonProps =
    props.status === Status.DISABLED ? {} : { onClick: handleClick };

  const styles = props.statusClasses
    ? { ...imageButtonStyles, ...props.statusClasses }
    : imageButtonStyles;

  const imageButtonClasses = classNames(
    imageButtonStyles.imageButton,
    props.className,
    styles[props.status]
  );

  const shouldShowTooltip = Boolean(props.description) && isHovered;

  return (
    <div ref={hoverRef} className={imageButtonClasses} {...buttonProps}>
      <button>
        {typeof props.image === 'string' ? (
          <img src={props.image} alt={props.description} />
        ) : (
          <props.image />
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

ImageButton.defaultProps = {
  status: Status.DEFAULT,
  description: ''
};

export default memo(ImageButton, isEqual);
