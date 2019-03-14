import React from 'react';
import dafaultStyles from './ToggleImageButton.scss';
import ImageHolder from './ImageHolder';

export enum ImageButtonStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISABLED = 'disabled'
}

type Props = {
  buttonStatus: ImageButtonStatus;
  description?: string;
  imageFile: any;
  imageStyles?: any;
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
        imageFile={props.imageFile}
        imageStyles={props.imageStyles ? props.imageStyles : dafaultStyles}
      />
    </div>
  );
};

ToggleImageButton.defaultProps = {
  buttonStatus: ImageButtonStatus.ACTIVE,
  description: ''
};

export default ToggleImageButton;
