import React from 'react';

import useHover from 'src/shared/hooks/useHover';

import ImageHolder from './ImageHolder';
import Tooltip from 'src/shared/components/tooltip/Tooltip';

import { ActivityStatuses } from 'src/shared/types/activity-status';

import imageButtonStyles from './ImageButton.scss';

export const ImageButtonStatuses = {
  ...ActivityStatuses,
  DISABLED: 'disabled' as 'disabled',
  DEFAULT: 'default' as 'default',
  HIGHLIGHTED: 'highlighted' as 'highlighted'
};

export type ImageButtonStatus = (typeof ImageButtonStatuses)[keyof typeof ImageButtonStatuses];

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
    props.buttonStatus === ImageButtonStatuses.DISABLED
      ? {}
      : { onClick: handleClick };

  const { classNames, ...rest } = props;

  const styles = classNames
    ? { ...imageButtonStyles, ...props.classNames }
    : imageButtonStyles;

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
  buttonStatus: ImageButtonStatuses.DEFAULT,
  description: '',
  image: ''
};

export default ImageButton;
