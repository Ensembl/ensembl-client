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

import ExternalLink from 'src/shared/components/external-link/ExternalLink';

import styles from './ExternalLink.stories.module.css';

const DefaultExternalLink = () => (
  <div className={styles.wrapper}>
    <ExternalLink to="#">LinkText</ExternalLink>
  </div>
);

export const DefaultExternalLinkStory = {
  name: 'default',
  render: () => <DefaultExternalLink />
};

export default {
  title: 'Components/Shared Components/ExternalLink'
};
