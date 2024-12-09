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

import {
  CollapsibleSection,
  CollapsibleSectionHead,
  CollapsibleSectionBody
} from 'src/shared/components/collapsible-section/CollapsibleSection';

import styles from './CollapsibleSection.stories.module.css';

const DefaultStoryComponent = () => {
  return (
    <>
      <CollapsibleSection className={styles.section}>
        <CollapsibleSectionHead>Section 1</CollapsibleSectionHead>
        <CollapsibleSectionBody>
          <ul>
            <li>One</li>
            <li>Two</li>
            <li>Three</li>
          </ul>
        </CollapsibleSectionBody>
      </CollapsibleSection>
      <CollapsibleSection className={styles.section}>
        <CollapsibleSectionHead>Section 2</CollapsibleSectionHead>
        <CollapsibleSectionBody>
          <ul>
            <li>Four</li>
            <li>Five</li>
            <li>Six</li>
          </ul>
        </CollapsibleSectionBody>
      </CollapsibleSection>
    </>
  );
};

const StartFromClosedStoryComponent = () => {
  return (
    <>
      <CollapsibleSection className={styles.section} isOpen={false}>
        <CollapsibleSectionHead>Section 1</CollapsibleSectionHead>
        <CollapsibleSectionBody>
          <ul>
            <li>One</li>
            <li>Two</li>
            <li>Three</li>
          </ul>
        </CollapsibleSectionBody>
      </CollapsibleSection>
      <CollapsibleSection className={styles.section} isOpen={false}>
        <CollapsibleSectionHead>Section 2</CollapsibleSectionHead>
        <CollapsibleSectionBody>
          <ul>
            <li>Four</li>
            <li>Five</li>
            <li>Six</li>
          </ul>
        </CollapsibleSectionBody>
      </CollapsibleSection>
    </>
  );
};

export const DefaultStory = {
  name: 'default',
  render: () => <DefaultStoryComponent />
};

export const StartFromClosedStory = {
  name: 'start from closed',
  render: () => <StartFromClosedStoryComponent />
};

export default {
  title: 'Components/Shared Components/CollapsibleSection'
};
