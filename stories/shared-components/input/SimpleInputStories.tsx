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

import Input from 'src/shared/components/input/Input';

import styles from './Input.stories.module.css';

export const DefaultInputStory = () => (
  <div className={styles.wrapper}>
    <Input placeholder="Enter something..." />
  </div>
);

export const CustomInputStory = () => (
  <div className={styles.wrapper}>
    <Input
      placeholder="Enter something..."
      className={styles.customizedInput}
    />
  </div>
);
