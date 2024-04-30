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

import ExternalReference from 'src/shared/components/external-reference/ExternalReference';

import styles from './ExternalReference.stories.module.css';

const DefaultExternalReference = () => (
  <ExternalReference
    label={'Source name'}
    to="#"
    className={styles.externalReference}
  >
    Link Text
  </ExternalReference>
);

const WithoutLabel = () => (
  <ExternalReference to="#" className={styles.externalReference}>
    Link Text
  </ExternalReference>
);

const WithoutLink = () => (
  <ExternalReference label={'Source name'} className={styles.externalReference}>
    Link Text
  </ExternalReference>
);

export const DefaultExternalReferenceStory = {
  name: 'default',
  render: () => <DefaultExternalReference />
};

export const WithoutLabelExternalReferenceStory = {
  name: 'without label',
  render: () => <WithoutLabel />
};

export const WithoutLinkExternalReferenceStory = {
  name: 'without link',
  render: () => <WithoutLink />
};

export default {
  title: 'Components/Shared Components/ExternalReference'
};
