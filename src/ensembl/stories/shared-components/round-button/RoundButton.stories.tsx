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
import { action } from '@storybook/addon-actions';

import RoundButton, {
  RoundButtonStatus
} from 'src/shared/components/round-button/RoundButton';
import BadgedButton from 'src/shared/components/badged-button/BadgedButton';

import styles from './RoundButton.stories.scss';

const onClick = action('button-click');

export default {
  title: 'Components/Shared Components/RoundButton'
};

export const DefaultRoundButton = () => (
  <div className={styles.wrapper}>
    <RoundButton onClick={onClick}>I am default</RoundButton>
  </div>
);

DefaultRoundButton.story = {
  name: 'default'
};

export const ActiveRoundButton = () => (
  <div className={styles.wrapper}>
    <RoundButton status={RoundButtonStatus.ACTIVE} onClick={onClick}>
      I am active
    </RoundButton>
  </div>
);

ActiveRoundButton.story = {
  name: 'active'
};

export const InactiveRoundButton = () => (
  <div className={styles.wrapper}>
    <RoundButton status={RoundButtonStatus.INACTIVE} onClick={onClick}>
      I am inactive
    </RoundButton>
  </div>
);

InactiveRoundButton.story = {
  name: 'inactive'
};

export const DisabledRoundButton = () => (
  <div className={styles.wrapper}>
    <RoundButton status={RoundButtonStatus.DISABLED} onClick={onClick}>
      I am disabled
    </RoundButton>
  </div>
);

DisabledRoundButton.story = {
  name: 'disabled'
};

export const CustomRoundButton = () => (
  <div className={styles.wrapper}>
    <RoundButton
      classNames={styles}
      status={RoundButtonStatus.ACTIVE}
      onClick={onClick}
    >
      Custom Active
    </RoundButton>
  </div>
);

CustomRoundButton.story = {
  name: 'custom'
};

export const BadgedRoundButton = () => (
  <div className={styles.wrapper}>
    <BadgedButton badgeContent={'10'}>
      <RoundButton status={RoundButtonStatus.ACTIVE} onClick={onClick}>
        I have a badge
      </RoundButton>
    </BadgedButton>
  </div>
);

BadgedRoundButton.story = {
  name: 'badged'
};
