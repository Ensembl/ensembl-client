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
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Roundbutton, {
  RoundButtonStatus
} from 'src/shared/components/round-button/RoundButton';
import BadgedButton from 'src/shared/components/badged-button/BadgedButton';

import styles from './RoundButton.stories.scss';

const onClick = action('button-click');

storiesOf('Components|Shared Components/RoundButton', module)
  .add('default', () => (
    <div className={styles.wrapper}>
      <Roundbutton onClick={onClick}>I am default</Roundbutton>
    </div>
  ))
  .add('active', () => (
    <div className={styles.wrapper}>
      <Roundbutton status={RoundButtonStatus.ACTIVE} onClick={onClick}>
        I am active
      </Roundbutton>
    </div>
  ))
  .add('inactive', () => (
    <div className={styles.wrapper}>
      <Roundbutton status={RoundButtonStatus.INACTIVE} onClick={onClick}>
        I am inactive
      </Roundbutton>
    </div>
  ))
  .add('disabled', () => (
    <div className={styles.wrapper}>
      <Roundbutton status={RoundButtonStatus.DISABLED} onClick={onClick}>
        I am disabled
      </Roundbutton>
    </div>
  ))
  .add('custom', () => (
    <div className={styles.wrapper}>
      <Roundbutton
        classNames={styles}
        status={RoundButtonStatus.ACTIVE}
        onClick={onClick}
      >
        Custom Active
      </Roundbutton>
    </div>
  ))
  .add('badged', () => (
    <div className={styles.wrapper}>
      <BadgedButton badgeContent={'10'}>
        <Roundbutton status={RoundButtonStatus.ACTIVE} onClick={onClick}>
          I have a badge
        </Roundbutton>
      </BadgedButton>
    </div>
  ));
