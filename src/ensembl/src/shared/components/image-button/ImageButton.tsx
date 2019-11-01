import React from 'react';

import useHover from 'src/shared/hooks/useHover';

import defaultStyles from './ImageButton.scss';
import ImageHolder from './ImageHolder';
import Tooltip from 'src/shared/components/tooltip/Tooltip';

import imageButtonStyles from './ImageButton.scss';

import { Status } from 'src/shared/types/status';

type ImageButtonStatus =
  | Status.ACTIVE
  | Status.INACTIVE
  | Status.DISABLED
  | Status.DEFAULT
  | Status.HIGHLIGHTED;

type Props = {
  buttonStatus: ImageButtonStatus;
  description: string;
  image: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | string;
  classNames?: { [key in ImageButtonStatus]?: string };
  onClick?: () => void;
};

const ImageButton = (props: Props) => {
  const [hoverRef, isHovered] = useHover<HTMLDivElement>();

  const handleClick = () => {
    props.onClick && props.onClick();
  };

  const buttonProps =
    props.buttonStatus === Status.DISABLED ? {} : { onClick: handleClick };

  const { classNames, ...rest } = props;

  const styles = classNames
    ? { ...defaultStyles, ...props.classNames }
    : defaultStyles;

  const shouldShowTooltip = Boolean(props.description) && isHovered;

  return (
    <div
      ref={hoverRef}
      className={imageButtonStyles.imageButton}
      {...buttonProps}
    >
      <ImageHolder {...rest} classNames={styles} />
      {shouldShowTooltip && (
        <Tooltip autoAdjust={true}>{props.description}</Tooltip>
      )}
    </div>
  );
};

ImageButton.defaultProps = {
  buttonStatus: Status.DEFAULT,
  description: '',
  image: ''
};

export default ImageButton;
