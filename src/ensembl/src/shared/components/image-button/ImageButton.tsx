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
