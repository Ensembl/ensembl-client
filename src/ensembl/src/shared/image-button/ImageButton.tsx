import React from 'react';
import defaultStyles from './ImageButton.scss';
import ImageHolder from './ImageHolder';

import Tooltip from 'src/shared/tooltip/Tooltip';

import imageButtonStyles from './ImageButton.scss';

export enum ImageButtonStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISABLED = 'disabled',
  DEFAULT = 'default',
  HIGHLIGHTED = 'highlighted'
}

type Props = {
  buttonStatus: ImageButtonStatus;
  description: string;
  image: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | string;
  classNames?: { [key in ImageButtonStatus]?: string };
  onClick?: () => void;
};

const ImageButton = (props: Props) => {
  const buttonProps =
    props.buttonStatus === ImageButtonStatus.DISABLED
      ? {}
      : { onClick: props.onClick };

  const { classNames, ...rest } = props;

  const styles = classNames
    ? { ...defaultStyles, ...props.classNames }
    : defaultStyles;

  const shouldShowTooltip =
    Boolean(props.description) &&
    props.buttonStatus !== ImageButtonStatus.DISABLED;

  return (
    <div className={imageButtonStyles.imageButton} {...buttonProps}>
      <ImageHolder {...rest} classNames={styles} />
      {shouldShowTooltip && (
        <Tooltip autoAdjust={true}>{props.description}</Tooltip>
      )}
    </div>
  );
};

ImageButton.defaultProps = {
  buttonStatus: ImageButtonStatus.DEFAULT,
  description: '',
  image: ''
};

export default ImageButton;
