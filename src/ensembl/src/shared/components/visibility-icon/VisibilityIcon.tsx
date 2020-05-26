import React from 'react';

import ImageButton, {
  ImageButtonStatus
} from 'src/shared/components/image-button/ImageButton';

import { ReactComponent as Eye } from 'static/img/track-panel/eye.svg';
import { ReactComponent as EyePartial } from 'static/img/track-panel/eye-half.svg';

import { Status } from 'src/shared/types/status';

import styles from './VisibilityIcon.scss';

type VisibilityIconStatus =
  | Status.SELECTED
  | Status.UNSELECTED
  | Status.PARTIALLY_SELECTED;

type VisibilityIconProps = {
  status: VisibilityIconStatus;
  description?: string;
  onClick: () => void;
};

export const VisibilityIcon = (props: VisibilityIconProps) => {
  const status = props.status;
  let imageButtonStatus: ImageButtonStatus;
  let eyeIcon = Eye;
  let className = styles.default;

  if (status === Status.PARTIALLY_SELECTED) {
    imageButtonStatus = Status.DEFAULT;
    eyeIcon = EyePartial;
    className = styles.partiallySelected;
  } else {
    imageButtonStatus = status;
  }

  return (
    <ImageButton
      status={imageButtonStatus}
      image={eyeIcon}
      description={props.description}
      statusClasses={{
        [Status.DEFAULT]: className,
        [Status.SELECTED]: styles.selected,
        [Status.UNSELECTED]: styles.unselected
      }}
      onClick={props.onClick}
    />
  );
};

export default VisibilityIcon;
