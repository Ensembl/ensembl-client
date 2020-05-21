/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
