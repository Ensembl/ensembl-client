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
import { Link } from 'react-router-dom';

import { ReactComponent as Logotype } from 'static/img/brand/logotype.svg';
import { ReactComponent as SpeciesSelectorIcon } from 'static/img/launchbar/species-selector.svg';
import { ReactComponent as BrowserIcon } from 'static/img/launchbar/browser.svg';
import { ReactComponent as EntityViewerIcon } from 'static/img/launchbar/entity-viewer.svg';
import { ReactComponent as HelpIcon } from 'static/img/launchbar/help.svg';
import speciesStripUrl from 'static/img/home/species-strip.svg';
import ebiLogoUrl from 'static/img/home/EMBLEBI-logo.svg';
import elixirLogoUrl from 'static/img/home/elixir-logo.svg';
import facebookIconUrl from 'static/img/home/facebook.svg';
import twitterIconUrl from 'static/img/home/twitter.svg';
import blogIconUrl from 'static/img/home/blog.svg';

import styles from './Home.scss';

const Home = () => {
  const helpButton = (
    <div className={styles.wrapper}>
      <div className={styles.text}>How to use Ensembl</div>
      <HelpIcon className={styles.helpIcon} />
    </div>
  );

  return (
    <div className={styles.home}>
      <div className={styles.main}>
        <div className={styles.mainTop}>
          <div className={styles.mainTopMiddle}>
            <Logotype className={styles.logotype} />
            <div className={styles.text}>Genome data & annotation</div>
            <div className={styles.appList}>
              <div className={styles.appListItem}>
                <div className={styles.buttonsContainer}>
                  <Link to="/species-selector" className={styles.button}>
                    <span>Species selector</span>
                    <SpeciesSelectorIcon className={styles.icon} />
                  </Link>
                </div>
                <div className={styles.bottomTextContainer}>
                  <div className={styles.bottomText}>
                    Create & manage your own species list
                  </div>
                </div>
              </div>

              <div className={styles.appListItem}>
                <div className={styles.buttonsContainer}>
                  <Link to="/genome-browser" className={styles.button}>
                    <span>Genome browser</span>
                    <BrowserIcon className={styles.icon} />
                  </Link>
                </div>
                <div className={styles.bottomTextContainer}>
                  <div className={styles.bottomText}>
                    Look at genes & transcripts in their genomic context
                  </div>
                </div>
              </div>

              <div className={styles.appListItem}>
                <div className={styles.buttonsContainer}>
                  <Link to="/entity-viewer" className={styles.button}>
                    <span>Entity viewer</span>
                    <EntityViewerIcon className={styles.icon} />
                  </Link>
                </div>
                <div className={styles.bottomTextContainer}>
                  <div className={styles.bottomText}>
                    Get gene & transcript information
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.homeTopRight}>
            <Link to="/help">{helpButton}</Link>
          </div>
        </div>

        <div className={styles.speciesContainer}>
          <span className={styles.platform}></span>
          <img src={speciesStripUrl} className={styles.speciesStrip} />
        </div>
      </div>
      <footer>
        <div className={styles.footerLeft}>
          <Logotype className={styles.logotype} />
          <img src={ebiLogoUrl} className={styles.ebiLogo} />
          <div className={styles.text}>
            Wellcome Genome Campus, Hinxton, Cambridgeshire CB10 1SD, UK
          </div>
        </div>

        <div className={styles.footerRightIcons}>
          <a
            href="https://www.ensembl.info"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.link}>Ensembl blog</div>
          </a>
          <a
            href="https://www.ensembl.info"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={blogIconUrl} className={styles.mediaIcons} />
          </a>
          <a
            href="https://www.facebook.com/Ensembl.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={facebookIconUrl} className={styles.mediaIcons} />
          </a>
          <a
            href="https://twitter.com/ensembl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={twitterIconUrl} className={styles.mediaIcons} />
          </a>
          <a
            href="https://elixir-europe.org/platforms/data/core-data-resources"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={elixirLogoUrl} className={styles.elixirLogo} />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
