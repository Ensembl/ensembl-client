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

import styles from './HelpLanding.scss';

const HelpLanding = () => {
  return (
    <div className={styles.helpLanding}>
      <AppsSection />
      <StartUsingSection />
    </div>
  );
};

const AppsSection = () => {
  return (
    <section>
      <h1>Ensembl apps</h1>

      <div className={styles.sectionGrid}>
        <div>
          <div>
            <LabelledAppIcon app="speciesSelector" />
          </div>
          {'Create & manage your own species list'}
          <ul>
            <li>opened from the launchbar at the top of every page</li>
            <li>add as many species as you want</li>
            <li>your species will then be available across all apps</li>
            <li>use the species tabs to see information about each species</li>
          </ul>
        </div>

        <div>
          <div>
            <LabelledAppIcon app="genomeBrowser" />
          </div>
          {'Look at genes & transcripts in their genetic context'}
          <ul>
            <li>opened from the launchbar at the top of every page</li>
            <li>view an example gene or region or search for your own genes</li>
            <li>configure the view to show the information you want to see</li>
          </ul>
        </div>

        <div>
          <div>
            <LabelledAppIcon app="entityViewer" />
          </div>
          {'Get gene & transcript information'}
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
        <span onClick={toggleExpanded}>Show me what to do</span>
      </div>

      {isExpanded && (
        <div className={styles.stepsGrid}>
          <div>
            <Step count={1} title="Find and add a species" />
            <LabelledAppIcon app="speciesSelector" size="small" />
          </div>

          <div>
            <Step count={2} title="Select an app" />
            <LabelledAppIcon app="genomeBrowser" size="small" />
            <LabelledAppIcon app="entityViewer" size="small" />
          </div>

          <div>
            <Step
              count={3}
              title="Use Search or the example links to view a gene or region"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default HelpLanding;
