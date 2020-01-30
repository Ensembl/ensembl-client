import React from 'react';

import HomepageSpeciesBar from 'src/content/home/components/homepage-species-bar/HomepageSpeciesBar';
import HomepageSiteInfo from 'src/content/home/components/homepage-site-info/HomepageSiteInfo';
import HomepageAppLinks from 'src/content/home/components/homepage-app-links/HomepageAppLinks';

import styles from './Home.scss';

const Home = () => {
  return (
    <div className={styles.home}>
      <HomepageSpeciesBar />
      <section className={styles.search}>
        <h2>Find</h2>
        <p>
          <input type="text" placeholder="Name, symbol or ID" disabled={true} />
        </p>
      </section>
      <HomepageAppLinks />
      <HomepageSiteInfo />
    </div>
  );
};

export default Home;
