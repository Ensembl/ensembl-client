import React from 'react';
import classNames from 'classnames';

import styles from './Loader.scss';

type Props = {
  className?: string;
};

export const CircleLoader = (props: Props) => {
  const className = classNames(styles.circleLoader, props.className);

  return <div className={className} />;
};
