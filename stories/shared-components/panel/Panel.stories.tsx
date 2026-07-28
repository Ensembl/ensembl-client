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

import { faker } from '@faker-js/faker';

import {
  Panel,
  PanelHeader,
  PanelBody
} from 'src/shared/components/panel/Panel';

import styles from './Panel.stories.module.css';

export const DefaultPanelStory = () => (
  <div className={styles.fullPageWrapper}>
    <Panel>
      <PanelHeader>Proteins</PanelHeader>
      <PanelBody>
        <div>Panel Content</div>
      </PanelBody>
    </Panel>
  </div>
);

DefaultPanelStory.storyName = 'default';

export const PanelWithLongContentStory = () => (
  <div className={styles.fullPageWrapper}>
    <Panel>
      <PanelHeader>Long content</PanelHeader>
      <PanelBody>
        <div className={styles.preWrap}>{faker.lorem.paragraphs(100)}</div>
      </PanelBody>
    </Panel>
  </div>
);

PanelWithLongContentStory.storyName = 'long content';

export default {
  title: 'Components/Shared Components/Panel'
};
