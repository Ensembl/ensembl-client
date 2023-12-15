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

import storyStyles from '../../common.scss';
import styles from './Typography.stories.module.css';
import dummyText from 'tests/data/json/LoremIpsum.json';

export default {
  title: 'Design Primitives/Typography'
};

export const Fonts = () => {
  return (
    <div className={storyStyles.page}>
      <p>
        The font shown as 'preferred' is the first one listed in the CSS, but
        that may not be the font rendered by your browser.
      </p>
      <h2>Body font</h2>
      <div className={styles.regular}>
        <p>
          <b>Preferred</b>: Lato Regular
        </p>
        <p>{dummyText.medium}</p>
      </div>
      <h2>Monospace</h2>
      <p>
        <b>Preferred</b>: IBM Plex Mono
      </p>
      <div className={styles.monospace}>{dummyText.medium}</div>
    </div>
  );
};

Fonts.storyName = 'fonts';
