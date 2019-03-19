import React from 'react';
import defaultStyles from './ImageButton.scss';
import ImageHolder from './ImageHolder';

export enum ImageButtonStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISABLED = 'disabled',
  DEFAULT = 'default',
  GREYSCALE = 'greyscale'
}

type Props = {
  buttonStatus: ImageButtonStatus;
  description: string;
  image: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | string;
  classNames?: any;
  onClick?: () => void;
};

const ImageButton = (props: Props) => {
  const buttonProps =
    props.buttonStatus === ImageButtonStatus.DISABLED
      ? {}
      : { onClick: props.onClick };

  Object.assign(defaultStyles, props.classNames);
  return (
    <div {...buttonProps}>
      <ImageHolder
        buttonStatus={props.buttonStatus}
        description={props.description}
        image={props.image}
        classNames={defaultStyles}
      />
    </div>
  );
};

export default ImageButton;
