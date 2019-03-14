import React, { ComponentClass } from 'react';
import classNames from 'classnames';

import { ImageButtonStatus } from 'src/shared/toggle-image-button/ToggleImageButton';

type Props = {
  buttonStatus: ImageButtonStatus;
  image: ComponentClass | string;
  classNames: any;
  description: string;
};

const ImageHolder = (props: Props) => {
  const className = classNames(
    props.classNames.default,
    props.classNames[props.buttonStatus]
  );

  return (
    <button className={className}>
      {typeof props.image === 'string' ? (
        <img src={props.image} />
      ) : (
        <props.image />
      )}
    </button>
  );
};

ImageHolder.defaultProps = {
  description: ''
};

export default ImageHolder;
