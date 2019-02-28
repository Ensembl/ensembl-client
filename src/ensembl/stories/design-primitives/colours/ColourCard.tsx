import React, { FunctionComponent } from 'react';

import styles from './ColourCard.scss';

type Props = {
  name: string;
  variableName: string;
  value: string;
};

const ColourCard: FunctionComponent<Props> = (props) => {
  return (
    <div className={styles.colourCard}>
      <div
        className={styles.colourArea}
        style={{ backgroundColor: props.value }}
      />
      <div className={styles.colourInfo}>
        <div className={styles.colourName}>{props.name}</div>
        <div>{props.variableName}</div>
        <div>{props.value}</div>
      </div>
    </div>
  );
};

export default ColourCard;
