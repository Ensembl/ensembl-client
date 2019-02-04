import React, { FunctionComponent, memo } from 'react';

import chevronRightIcon from 'static/img/track-panel/chevron-right.svg';

import styles from './AppBar.scss';

const AppBar: FunctionComponent = memo(() => (
  <section className={styles.appBar}>
    <div className={styles.top}>
      <div>Example App</div>
    </div>
    <div>
      <dl className={styles.selectedSpecies}>
        <dd>
          <strong>Human</strong> GRCh38.p10
        </dd>
        <dd>
          <a href="" className={styles.addSpecies}>
            Change
          </a>
        </dd>
      </dl>
      <div className={styles.helpLink}>
        <a href="">
          Help &amp; documentation <img src={chevronRightIcon} alt="" />
        </a>
      </div>
    </div>
  </section>
));

export default AppBar;
