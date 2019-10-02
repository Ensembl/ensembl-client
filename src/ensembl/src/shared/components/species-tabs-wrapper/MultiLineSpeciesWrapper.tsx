import React, { ReactElement } from 'react';

import { nonBreakingSpace } from 'src/shared/constants/strings';

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
      {nonBreakingSpace}
      {props.link && <span className={styles.linkWrapper}>{props.link}</span>}
    </div>
  );
};

export default MultiLineWrapper;
