import React, { FunctionComponent, memo } from 'react';

import chevronRightIcon from 'static/img/shared/chevron-right-grey.svg';

import styles from './AppBar.scss';

type AppBarProps = {
  currentApp: string;
};

const AppBar: FunctionComponent<AppBarProps> = memo((props: AppBarProps) => (
  <section className={styles.appBar}>
    <div className={styles.top}>
      <div>Genome browser</div>
    </div>
    <div>
      <dl className={styles.selectedSpecies}>
        <dd>
          <strong>Human</strong> GRCh38.p12
        </dd>
        <dd>
          {/* <a className={`${styles.addSpecies} inactive`}>Change</a> */}
        </dd>
      </dl>
      <div className={styles.helpLink}>
        <a className="inactive">
          Help &amp; documentation <img src={chevronRightIcon} alt="" />
        </a>
      </div>
    </div>
  </section>
));

export default AppBar;
