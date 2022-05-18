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

import AlertButton from 'src/shared/components/alert-button/AlertButton';

import styles from './AlertButton.stories.scss';

export default {
  title: 'Components/Shared Components/Alert button'
};

export const AlertButtonTooltip = () => (
  <div>
    <span className={styles.text}>Some error has occured</span>
    <AlertButton helpText="This is a hint" />
  </div>
);

AlertButtonTooltip.storyName = 'Alert icon with tooltip';
