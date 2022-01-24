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

import useHomeAnalytics from 'src/content/home/hooks/useHomeAnalytics';

import { HelpPopupButton } from 'src/shared/components/help-popup';
import ConversationIcon from 'src/shared/components/communication-framework/ConversationIcon';
import {
  GenomeBrowserIcon,
  SpeciesSelectorIcon,
  EntityViewerIcon
} from 'src/shared/components/app-icon';

import { ReactComponent as Logotype } from 'static/icons/logotype.svg';

import speciesStripUrl from 'static/img/home/species-strip.svg';
import ebiLogoUrl from 'static/img/home/EMBLEBI-logo.svg';
import elixirLogoUrl from 'static/img/home/elixir-logo.svg';
import facebookIconUrl from 'static/img/home/facebook.svg';
import twitterIconUrl from 'static/img/home/twitter.svg';
import blogIconUrl from 'static/img/home/blog.svg';

import styles from './Home.scss';

const Home = () => {
  const { trackHomePageEntryButtons } = useHomeAnalytics();

  const handleButtonClick = (label: string) => {
    trackHomePageEntryButtons(label);
  };

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
                  <Link
                    to="/species-selector"
                    className={styles.button}
                    onClick={() => handleButtonClick('species-selector')}
                  >
                    <span>Species selector</span>
                    <div className={styles.appIconWrapper}>
                      <SpeciesSelectorIcon />
                    </div>
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
                  <Link
                    to="/genome-browser"
                    className={styles.button}
                    onClick={() => handleButtonClick('genome-browser')}
                  >
                    <span>Genome browser</span>
                    <div className={styles.appIconWrapper}>
                      <GenomeBrowserIcon />
                    </div>
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
                  <Link
                    to="/entity-viewer"
                    className={styles.button}
                    onClick={() => handleButtonClick('entity-viewer')}
                  >
                    <span>Entity viewer</span>
                    <div className={styles.appIconWrapper}>
                      <EntityViewerIcon />
                    </div>
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
            <HelpPopupButton
              label="About using Ensembl"
              slug="ensembl-website-basics"
              labelClass={styles.helpLabel}
            />
            <div className={styles.conversationIcon}>
              <ConversationIcon />
            </div>
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
