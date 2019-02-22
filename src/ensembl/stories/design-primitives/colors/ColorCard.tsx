import React, { FunctionComponent } from 'react';

import styles from './ColorCard.scss';

type Props = {
  name: string;
  variableName: string;
  value: string;
};

const ColorCard: FunctionComponent<Props> = (props) => {
  return (
    <div className={styles.colorCard}>
      <div
        className={styles.colorArea}
        style={{ backgroundColor: props.value }}
      />
      <div className={styles.colorInfo}>
        <div className={styles.colorName}>{props.name}</div>
        <div>{props.variableName}</div>
        <div>{props.value}</div>
      </div>
    </div>
  );
};

export default ColorCard;
