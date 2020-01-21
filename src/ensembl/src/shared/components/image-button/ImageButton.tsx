import React, { memo } from 'react';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';

import useHover from 'src/shared/hooks/useHover';

import defaultStyles from './ImageButton.scss';
import Tooltip from 'src/shared/components/tooltip/Tooltip';

import imageButtonStyles from './ImageButton.scss';

import { Status } from 'src/shared/types/status';

export type ImageButtonStatus =
  | Status.DEFAULT
  | Status.SELECTED
  | Status.UNSELECTED
  | Status.DISABLED;

type Props = {
  buttonStatus: ImageButtonStatus;
  description: string;
  image: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | string;
  classNames?: { [key in ImageButtonStatus]?: string };
  onClick?: () => void;
};

export const ImageButton = (props: Props) => {
  const [hoverRef, isHovered] = useHover<HTMLDivElement>();

  const handleClick = () => {
    props.onClick && props.onClick();
  };

  const buttonProps =
    props.buttonStatus === Status.DISABLED ? {} : { onClick: handleClick };

  const styles = props.classNames
    ? { ...defaultStyles, ...props.classNames }
    : defaultStyles;

  const imageButtonClasses = classNames(
    imageButtonStyles.imageButton,
    styles[props.buttonStatus]
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
  buttonStatus: Status.DEFAULT,
  description: ''
};

export default memo(ImageButton, isEqual);
