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
import classNames from 'classnames';

import { Step } from 'src/shared/components/step/Step';

import SearchIcon from 'static/icons/icon_search.svg';

import styles from './FindGeneInstructions.scss';
import speciesLozengeStyles from 'src/shared/components/selected-species/SpeciesLozenge.scss';

const FindGeneInstructions = () => {
  return (
    <section className={styles.instructionsPanel}>
      <div className={styles.instructionsWrapper}>
        <div className={styles.stepWrapper}>
          <Step count={1} label="Find and add a species" />
        </div>

        <div className={styles.stepWrapper}>
          <Step count={2} label="Select a species tab in any app">
            <div className={styles.description}>
              <div
                className={classNames(
                  speciesLozengeStyles.species,
                  styles.speciesLozenge
                )}
              >
                <div className={speciesLozengeStyles.inner}>
                  <span
                    className={classNames(
                      speciesLozengeStyles.name,
                      styles.speciesLozengeName
                    )}
                  >
                    Species
                  </span>
                  <span
                    className={classNames(
                      speciesLozengeStyles.assembly,
                      styles.speciesLozengeAssembly
                    )}
                  >
                    Assembly
                  </span>
                </div>
              </div>
            </div>
          </Step>
        </div>

        <div className={styles.stepWrapper}>
          <Step count={3} label="Use Search in that app to find a gene">
            <div className={styles.description}>
              <SearchIcon className={styles.searchIcon} />
            </div>
          </Step>
        </div>
      </div>
    </section>
  );
};

export default FindGeneInstructions;
