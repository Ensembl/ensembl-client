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

import Copy from 'src/shared/components/copy/Copy';

import styles from './Copy.stories.module.css';

const textToCopy = 'Hello world!';

const DefaultCopyButtonStory = () => (
  <>
    <section className={styles.section}>
      <p>Middle alignment of the "Copy" label (default)</p>
      <div className={styles.frame}>
        <div className={styles.inFrameContainer}>
          <Copy value={textToCopy} />
          <span>Some text to the right</span>
        </div>
      </div>
    </section>

    <section className={styles.section}>
      <p>Left alignment of the "Copy" label</p>
      <div className={styles.frame}>
        <div className={styles.inFrameContainer}>
          <Copy value={textToCopy} align="left" />
          <span>Some text to the right</span>
        </div>
      </div>
    </section>

    <section className={styles.section}>
      <p>Right alignment of the "Copy" label</p>
      <div className={styles.frame}>
        <div className={styles.inFrameContainer}>
          <span>Some text to the left</span>
          <Copy value={textToCopy} align="right" />
        </div>
      </div>
    </section>
  </>
);

export const DefaultExternalLinkStory = {
  name: 'default',
  render: () => <DefaultCopyButtonStory />
};

export default {
  title: 'Components/Shared Components/Copy'
};
