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

import classNames from 'classnames';

import TabButton from 'src/shared/components/tab-button/TabButton';

import styles from './TabButton.stories.module.css';

const TabButtonStory = () => {
  const containerClasses = classNames(styles.container, styles.containerDark);

  return (
    <div className={containerClasses}>
      <TabButton pressed={false} className={styles.button}>
        Default
      </TabButton>
      <TabButton pressed={true} className={styles.button}>
        Pressed
      </TabButton>
      <TabButton pressed={false} disabled className={styles.button}>
        Disabled
      </TabButton>
    </div>
  );
};

export const DefaultTabButtonStory = {
  name: 'default',
  render: () => <TabButtonStory />
};

export default {
  title: 'Components/Shared Components/TabButton'
};
