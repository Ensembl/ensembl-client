import React from 'react';
import defaultStyles from './BadgedButton.scss';
import classNames from 'classnames';

type Props = {
  children: React.ReactChild;
  badge?: string | number;
  badgeClassName?: string;
};

const BadgedButton = (props: Props) => {
  const badgeClassName = classNames(defaultStyles.badge, props.badgeClassName);

  return (
    <div className={defaultStyles.badgedButton}>
      {props.children}
      {props.badge && <div className={badgeClassName}>{props.badge}</div>}
    </div>
  );
};

export default BadgedButton;
