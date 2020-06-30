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

import React, { useState, useRef } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import useOutsideClick from 'src/shared/hooks/useOutsideClick';

import styles from './useOutsideClick.stories.scss';

storiesOf('Components|Hooks/useOutsideclick', module).add('default', () => {
  const [shouldShowChild, showChild] = useState(true);

  const parentRef = useRef<HTMLDivElement>(null);

  const callback = () => {
    action('clicked-outside')();
  };

  useOutsideClick([parentRef], callback);

  return (
    <div className={styles.wrapper}>
      <div className={styles.parentElement} ref={parentRef}>
        Ref
        {shouldShowChild && (
          <div className={styles.childElement} onClick={() => showChild(false)}>
            I'm inside Ref but I'll be gone when you click me
          </div>
        )}
        <div className={styles.halfInside}> I'm also inside Ref </div>
      </div>
      <div className={styles.someOtherElement}> I'm outside Ref </div>
    </div>
  );
});
