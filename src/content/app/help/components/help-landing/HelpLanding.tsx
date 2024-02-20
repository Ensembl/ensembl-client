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

import React, { useState } from 'react';

import LabelledAppIcon from '../labelled-app-icon/LabelledAppIcon';
import { Step } from 'src/shared/components/step/Step';
import ShowHide from 'src/shared/components/show-hide/ShowHide';

import SearchIcon from 'static/icons/icon_search.svg';

import styles from './HelpLanding.module.css';

const HelpLanding = () => {
  return (
    <div className={styles.helpLanding}>
      <AppsSection />
      <StartUsingSection />
      <LastSection />
    </div>
  );
};

const AppsSection = () => {
  return (
    <section>
      <h1>Ensembl apps</h1>

      <div className={styles.appsGrid}>
        <div className={styles.appBlock}>
          <div className={styles.appLabel}>
            <LabelledAppIcon app="speciesSelector" />
          </div>
          Create &amp; manage your own species list
          <ul>
            <li>opened from the launchbar at the top of every page</li>
            <li>add as many species as you want</li>
            <li>your species will then be available across all apps</li>
            <li>use the species tabs to see information about each species</li>
          </ul>
        </div>

        <div className={styles.appBlock}>
          <div className={styles.appLabel}>
            <LabelledAppIcon app="genomeBrowser" />
          </div>
          Look at genes &amp; transcripts in their genetic context
          <ul>
            <li>opened from the launchbar at the top of every page</li>
            <li>
              view an example gene or region, or search for your own genes
            </li>
            <li>download the data you want</li>
          </ul>
        </div>

        <div className={styles.appBlock}>
          <div className={styles.appLabel}>
            <LabelledAppIcon app="entityViewer" />
          </div>
          Get gene &amp; transcript information
          <ul>
            <li>opened from the launchbar at the top of every page</li>
            <li>see all the information we have for your gene</li>
            <li>download the data you want</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

const StartUsingSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <section>
      <h1>Start using the apps</h1>
      <div>
        <span>A step-by-step guide to using an app for the first time</span>
        <ShowHide
          label="Show me what to do"
          isExpanded={isExpanded}
          onClick={toggleExpanded}
          className={styles.showHide}
        />
      </div>

      {isExpanded && (
        <div className={styles.stepsGrid}>
          <div>
            <Step count={1} label="Find and add a species">
              <LabelledAppIcon app="speciesSelector" size="small" />
            </Step>
          </div>

          <div>
            <Step count={2} label="Select an app">
              <div className={styles.stepChildren}>
                <LabelledAppIcon app="genomeBrowser" size="small" />
                <LabelledAppIcon app="entityViewer" size="small" />
              </div>
            </Step>
          </div>

          <div>
            <Step
              count={3}
              label="Use Search or the example links to view a gene or region"
            >
              <div className={styles.stepChildren}>
                <SearchIcon className={styles.searchIcon} />
                <div>Example gene</div>
                <div>Example region</div>
              </div>
            </Step>
          </div>
        </div>
      )}
    </section>
  );
};

const LastSection = () => {
  return (
    <section className={styles.bottomSection}>
      <h1>Ensembl tools</h1>

      <div className={styles.appsGrid}>
        <div className={styles.appBlock}>
          <div className={styles.appLabel}>
            <LabelledAppIcon app="blast" />
          </div>
          Compare DNA or protein sequences across species
          <ul>
            <li>opened from the launchbar at the top of every page</li>
            <li>add up to 30 sequences and up to 25 species at a time</li>
            <li>see significant sequence matches across species</li>
            <li>results available for 7 days</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default HelpLanding;
