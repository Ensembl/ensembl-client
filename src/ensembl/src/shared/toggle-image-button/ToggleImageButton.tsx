import React from 'react';
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
  image: any;
  classNames?: any;
  onClick: () => void;
};

const ToggleImageButton = (props: Props) => {
  return (
    <div
      onClick={
        props.buttonStatus === ImageButtonStatus.DISABLED
          ? () => {
              return;
            }
          : () => props.onClick()
      }
    >
      <ImageHolder
        buttonStatus={props.buttonStatus}
        description={props.description}
        image={props.image}
        classNames={props.classNames ? props.classNames : defaultStyles}
      />
    </div>
  );
};

ToggleImageButton.defaultProps = {
  buttonStatus: ImageButtonStatus.ACTIVE,
  description: ''
};

export default ToggleImageButton;
