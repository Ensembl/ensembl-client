import React, { ReactNode } from 'react';
import classNames from 'classnames';

import styles from './Button.scss';

type Props = {
  onClick: () => void;
  isDisabled?: boolean;
  className?: string;
  children: ReactNode;
};

export const PrimaryButton = (props: Props) => {
  const className = classNames(
    styles.primaryButton,
    { [styles.primaryButtonDisabled]: props.isDisabled },
    props.className
  );
  return <Button {...props} className={className} />;
};

export const SecondaryButton = (props: Props) => (
  <Button
    {...props}
    className={classNames(styles.secondaryButton, props.className)}
  />
);

const Button = (props: Props) => {
  const handleClick = () => {
    if (!props.isDisabled) {
      props.onClick();
    }
  };

  return (
    <button
      className={classNames(styles.button, props.className)}
      onClick={handleClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
