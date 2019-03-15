import React from 'react';
import classNames from 'classnames';

import { ImageButtonStatus } from 'src/shared/image-button/ImageButton';

type Props = {
  buttonStatus: ImageButtonStatus;
  image: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | string;
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
