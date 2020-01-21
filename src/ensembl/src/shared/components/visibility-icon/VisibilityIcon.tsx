import React from 'react';
import ImageButton from 'src/shared/components/image-button/ImageButton';

import { ReactComponent as Eye } from 'static/img/track-panel/eye.svg';
import { ReactComponent as EyePartial } from 'static/img/track-panel/eye-half.svg';

import { Status } from 'src/shared/types/status';

import styles from './VisibilityIcon.scss';

type VisibilityIconStatus =
  | Status.DEFAULT
  | Status.SELECTED
  | Status.UNSELECTED
  | Status.DISABLED
  | Status.PARTIALLY_SELECTED;

type VisibilityIconProps = {
  buttonStatus: VisibilityIconStatus;
  description: string;
  onClick: () => void;
};

export const VisibilityIcon = (props: VisibilityIconProps) => {
  let status = props.buttonStatus;
  let eyeIcon = Eye;
  let className = styles.default;

  if (status === Status.PARTIALLY_SELECTED) {
    status = Status.DEFAULT;
    eyeIcon = EyePartial;
    className = styles.partiallySelected;
  }

  return (
    <ImageButton
      buttonStatus={status}
      image={eyeIcon}
      description={props.description}
      classNames={{
        [Status.DEFAULT]: className,
        [Status.SELECTED]: styles.selected,
        [Status.UNSELECTED]: styles.unselected,
        [Status.DISABLED]: styles.disabled
      }}
      onClick={props.onClick}
    />
  );
};

VisibilityIcon.defaultProps = {
  description: ''
};

export default VisibilityIcon;
