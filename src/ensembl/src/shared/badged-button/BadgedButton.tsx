import React from 'react';
import defaultStyles from './BadgedButton.scss';
import classNames from 'classnames';

type Props = {
  children: React.ReactChild;
  badgeContent?: string | number | undefined;
  className?: string;
};

const BadgedButton = (props: Props) => {
  const className = classNames(defaultStyles.badgeDefault, props.className);

  return (
    <div className={defaultStyles.badgedButton}>
      {props.children}
      {!!props.badgeContent && (
        <div className={className}>{props.badgeContent}</div>
      )}
    </div>
  );
};

export default BadgedButton;
