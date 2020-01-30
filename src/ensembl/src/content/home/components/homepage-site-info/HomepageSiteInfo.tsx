import React from 'react';

import styles from './HomepageSiteInfo.scss';

const HomepageSiteInfo = () => (
  <section className={styles.siteMessage}>
    <h4>Using the site</h4>
    <p>
      A very limited data set has been made available for this first release.
    </p>
    <p>Blue icons and text are clickable and will usually 'do' something.</p>
    <p>
      Grey icons indicate apps &amp; functionality that is planned, but not
      available yet.
    </p>
    <p className={styles.convoMessage}>
      It's very early days, but why not join the conversation:
    </p>
    <p>
      <a href="mailto:helpdesk@ensembl.org">helpdesk@ensembl.org</a>
    </p>
  </section>
);

export default HomepageSiteInfo;
