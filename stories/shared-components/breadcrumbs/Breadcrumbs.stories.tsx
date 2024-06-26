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

import Breadcrumbs from 'src/shared/components/breadcrumbs/Breadcrumbs';

import styles from './Breadcrumbs.stories.module.css';

export default {
  title: 'Components/Shared Components/Breadcrumbs'
};

export const DefaultBreadcrumbs = () => (
  <div className={styles.wrapper}>
    <Breadcrumbs breadcrumbs={['Item 1', 'Item 2', 'Item 3', 'Item 4']} />
  </div>
);

DefaultBreadcrumbs.storyName = 'Breadcrumbs';
