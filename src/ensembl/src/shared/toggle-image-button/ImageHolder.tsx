import React from 'react';
import classNames from 'classnames';

import { ImageButtonStatus } from 'src/shared/toggle-image-button/ToggleImageButton';

type Props = {
  buttonStatus: ImageButtonStatus;
  imageFile: any;
  imageStyles: any;
  description: string;
};

const ImageHolder = (props: Props) => {
  const className = classNames(
    props.imageStyles.default,
    props.imageStyles[props.buttonStatus]
  );

  return (
    <div className={className}>
      {props.imageFile ? <props.imageFile /> : props.description}
    </div>
  );
};

ImageHolder.defaultProps = {
  description: ''
};

export default ImageHolder;
