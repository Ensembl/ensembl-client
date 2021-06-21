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
import classNames from 'classnames';

import { ReactComponent as Logotype } from 'static/img/brand/logotype.svg';
import { ReactComponent as EBILogo } from 'static/img/home/EMBLEBI-logo.svg';
import { ReactComponent as ElixirLogo } from 'static/img/home/elixir-logo.svg';
import { ReactComponent as FacebookIcon } from 'static/img/home/facebook.svg';
import { ReactComponent as TwitterIcon } from 'static/img/home/twitter.svg';
import { ReactComponent as BlogIcon } from 'static/img/home/blog.svg';
import { ReactComponent as SpeciesSelectorIcon } from 'static/img/launchbar/species-selector.svg';
import { ReactComponent as BrowserIcon } from 'static/img/launchbar/browser.svg';
import { ReactComponent as EntityViewerIcon } from 'static/img/launchbar/entity-viewer.svg';
import { ReactComponent as HelpIcon } from 'static/img/launchbar/help.svg';
import speciesStripUrl from 'static/img/home/species-strip.svg';

import { isEnvironment, Environment } from 'src/shared/helpers/environment';

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
      <div className={styles.container}>
        <div className={styles.middleHomeWrapper}>
          <div className={styles.middleHome}>
            <div className={styles.logotypeContainer}>
              <Logotype className={styles.logotype} />
            </div>
            <div className={styles.text}>Genome data & annotation</div>
            <div className={styles.selectionWrapper}>
              <div className={styles.selectionContainer}>
                <div className={styles.buttonsContainer}>
                  <div className={styles.button}>
                    <span>Species selector</span>
                    <SpeciesSelectorIcon className={styles.icon} />
                  </div>
                </div>
                <div className={styles.bottomTextContainer}>
                  <div className={styles.bottomText}>
                    Create & manage your own species list
                  </div>
                </div>
              </div>

              <div className={styles.selectionContainer}>
                <div className={styles.buttonsContainer}>
                  <div className={styles.button}>
                    <span>Genome browser</span>
                    <BrowserIcon className={styles.icon} />
                  </div>
                </div>
                <div className={styles.bottomTextContainer}>
                  <div className={styles.bottomText}>
                    Look at genes & transcripts in their genomic context
                  </div>
                </div>
              </div>

              <div className={styles.selectionContainer}>
                <div className={styles.buttonsContainer}>
                  <div className={styles.button}>
                    <span>Entity viewer</span>
                    <EntityViewerIcon className={styles.icon} />
                  </div>
                </div>
                <div className={styles.bottomTextContainer}>
                  <div className={styles.bottomText}>
                    Get gene & transcript information
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isEnvironment([Environment.DEVELOPMENT, Environment.INTERNAL]) ? (
            <div className={styles.homeTopRight}>
              <Link to="/help">{helpButton}</Link>
            </div>
          ) : (
            <div
              className={classNames(
                styles.homeTopRight,
                styles.homeTopRightDisabled
              )}
            >
              {helpButton}
            </div>
          )}
        </div>

        {/* <div className={styles.speciesStripContainer}>
          
        </div> */}

        <div className={styles.speciesContainer}>
          <img src={speciesStripUrl} className={styles.speciesStrip} />
          {/* <span className={styles.platform}></span> */}
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <Logotype className={styles.logotype} />
          <EBILogo className={styles.ebiLogo} />
          <div className={styles.text}>
            Wellcome Genome Campus, Hinxton, Cambridgeshire CB10 1SD, UK
          </div>
        </div>

        <div className={styles.footerRightIcons}>
          <div className={styles.link}>Ensembl blog</div>
          <BlogIcon className={styles.mediaIcons} />
          <FacebookIcon className={styles.mediaIcons} />
          <TwitterIcon className={styles.mediaIcons} />
          <ElixirLogo className={styles.elixirLogo} />
        </div>
      </div>
    </div>
  );
};

export default Home;
