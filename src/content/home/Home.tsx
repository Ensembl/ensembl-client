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

import { Link } from 'react-router-dom';

import useHomeAnalytics from 'src/content/home/hooks/useHomeAnalytics';

import { HelpPopupButton } from 'src/shared/components/help-popup';
import CommunicationPanelButton from 'src/shared/components/communication-framework/CommunicationPanelButton';
import {
  GenomeBrowserIcon,
  SpeciesSelectorIcon,
  EntityViewerIcon
} from 'src/shared/components/app-icon';
import SocialMediaLinks from 'src/shared/components/social-media-links/SocialMediaLinks';

import Logotype from 'static/img/brand/logotype.svg';

import speciesStripUrl from 'static/img/home/species-strip.svg?url';
import ebiLogoUrl from 'static/img/home/EMBLEBI-logo.svg?url';
import elixirLogoUrl from 'static/img/home/elixir-logo.svg?url';
import gbcLogoUrl from 'static/img/home/gbc-logo.svg?url';

import styles from './Home.module.css';

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
              <CommunicationPanelButton />
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

        <div className={styles.footerRight}>
          <SocialMediaLinks className={styles.socialMediaLinks} />
          <a
            href="https://globalbiodata.org/scientific-activities/global-core-biodata-resources"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={gbcLogoUrl} className={styles.gbcLogo} />
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
