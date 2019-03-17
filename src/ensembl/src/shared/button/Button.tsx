import React, { ReactNode } from 'react';

import styles from './Button.scss';

type Props = {
  onClick: () => void;
  children: ReactNode;
};

const Button = (props: Props) => {
  return (
    <button className={styles.button} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default Button;
