import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

import styles from './Home.scss';

type HomeProps = {};

const Home: FunctionComponent<HomeProps> = (props: HomeProps) => {
  return (
    <div className={styles.home}>
      <section className={styles.search}>
        <h2>Find</h2>
        <p>
          <input type="text" placeholder="Name, symbol or ID" />
          <button disabled={true}>Go</button>
        </p>
        <div className={styles.filter}>
          <h2>Refine results</h2>
        </div>
      </section>
      <section className={styles.previouslyViewed}>
        <h2>Previously viewed</h2>
        <dl>
          <dd>
            <Link to="/app/browser/human/BRCA2?region=13:32315474-32400266">
              Human gene BRCA2
            </Link>
          </dd>
          <dd>
            <Link to="/app/browser/human/TTN?region=2:178525989-178830802">
              Human transcript TTN
            </Link>
          </dd>
        </dl>
      </section>
      <section className={styles.siteMessage}>
        <h4>Using the site</h4>
        <p>
          A very limited data set has been made available for this first
          release.
        </p>
        <p>
          Blue icons and text are clickable and will usually &lsquo;do&rsquo;
          something.
        </p>
        <p>
          Grey icons indicate apps &amp; functionality that is planned, but not
          available yet.
        </p>
      </section>
    </div>
  );
};

export default Home;
