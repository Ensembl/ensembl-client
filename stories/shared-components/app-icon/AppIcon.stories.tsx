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

import {
  GenomeBrowserIcon,
  SpeciesSelectorIcon,
  GlobalSearchIcon,
  EntityViewerIcon,
  BlastIcon,
  CustomDownloadIcon,
  HelpIcon
} from 'src/shared/components/app-icon';

import styles from './AppIcon.stories.scss';

export const AppIconStory = () => (
  <div className={styles.column}>
    <div className={styles.appIconWrapper}>
      <GlobalSearchIcon />
      <div>Global search</div>
    </div>
    <div className={styles.appIconWrapper}>
      <GenomeBrowserIcon />
      <div>Genome browser</div>
    </div>
    <div className={styles.appIconWrapper}>
      <SpeciesSelectorIcon />
      <div>Species selector</div>
    </div>
    <div className={styles.appIconWrapper}>
      <EntityViewerIcon />
      <div>EntityViewer</div>
    </div>
    <div className={styles.appIconWrapper}>
      <BlastIcon />
      <div>Blast</div>
    </div>
    <div className={styles.appIconWrapper}>
      <CustomDownloadIcon />
      <div>Custom download (temporary name)</div>
    </div>
    <div className={styles.appIconWrapper}>
      <HelpIcon />
      <div>Help</div>
    </div>
  </div>
);

AppIconStory.storyName = 'default';

export default {
  title: 'Components/Shared Components/App icon'
};
