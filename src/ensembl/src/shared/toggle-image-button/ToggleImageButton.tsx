import React, { ComponentClass } from 'react';
import defaultStyles from './ToggleImageButton.scss';
import ImageHolder from './ImageHolder';

export enum ImageButtonStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISABLED = 'disabled'
}

type Props = {
  buttonStatus: ImageButtonStatus;
  description: string;
  image: ComponentClass | string;
  classNames?: any;
  onClick: () => void;
};

const ToggleImageButton = (props: Props) => {
  const buttonProps =
    props.buttonStatus === ImageButtonStatus.DISABLED
      ? {}
      : { onClick: props.onClick };

  return (
    <div {...buttonProps}>
      <ImageHolder
        buttonStatus={props.buttonStatus}
        description={props.description}
        image={props.image}
        classNames={props.classNames ? props.classNames : defaultStyles}
      />
    </div>
  );
};

export default ToggleImageButton;
