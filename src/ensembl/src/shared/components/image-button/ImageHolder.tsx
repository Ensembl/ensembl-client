import React, { memo } from 'react';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';

import { Status } from 'src/shared/types/status';

type Props = {
  buttonStatus: Status;
  image: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | string;
  classNames: { [key in Status]?: string };
  description: string;
};

const ImageHolder = (props: Props) => {
  const className = classNames(
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

export default memo(ImageHolder, isEqual);
