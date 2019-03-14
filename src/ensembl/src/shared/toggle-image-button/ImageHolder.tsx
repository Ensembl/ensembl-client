import React from 'react';
import classNames from 'classnames';

import { ImageButtonStatus } from 'src/shared/toggle-image-button/ToggleImageButton';

type Props = {
  buttonStatus: ImageButtonStatus;
  image: any;
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
      {props.image ? <props.image /> : props.description}
    </button>
  );
};

ImageHolder.defaultProps = {
  description: ''
};

export default ImageHolder;
