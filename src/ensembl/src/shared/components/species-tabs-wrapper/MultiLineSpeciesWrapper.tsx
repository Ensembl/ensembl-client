import React, { ReactElement } from 'react';

import styles from './MultiLineSpeciesWrapper.scss';

type Props = {
  isWrappable: boolean;
  speciesTabs: ReactElement<any>[];
  link?: React.ReactNode;
};

const MultiLineWrapper = (props: Props) => {
  return (
    <div>
      {props.speciesTabs}
      {props.link && <span className={styles.linkWrapper}>{props.link}</span>}
    </div>
  );
};

export default MultiLineWrapper;
