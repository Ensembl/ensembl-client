import React from 'react';
import classNames from 'classnames';

import { ImageButtonStatus } from 'src/shared/image-button/ImageButton';

type Props = {
  buttonStatus: ImageButtonStatus;
  image: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | string;
  classNames: { [key in ImageButtonStatus]?: string };
  description: string;
};

const ImageHolder = (props: Props) => {
  const className = classNames(
    'imageHolder',
    props.classNames.default,
    props.classNames[props.buttonStatus]
  );

  return (
    <div className={className}>
      <button>
        {typeof props.image === 'string' ? (
          <img src={props.image} alt={props.description} />
        ) : (
          <props.image />
        )}
      </button>
    </div>
  );
};

export default ImageHolder;
