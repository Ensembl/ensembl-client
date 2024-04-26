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

import RoundButton, {
  RoundButtonStatus
} from 'src/shared/components/round-button/RoundButton';
import BadgedButton from 'src/shared/components/badged-button/BadgedButton';

import styles from './RoundButton.stories.module.css';

export default {
  title: 'Components/Shared Components/RoundButton',
  argTypes: { onClick: { action: 'clicked' } }
};

type DefaultArgs = {
  onClick: (...args: any) => void;
};

export const DefaultRoundButton = (args: DefaultArgs) => (
  <div className={styles.wrapper}>
    <RoundButton onClick={args.onClick}>I am default</RoundButton>
  </div>
);

DefaultRoundButton.storyName = 'default';

export const ActiveRoundButton = (args: DefaultArgs) => (
  <div className={styles.wrapper}>
    <RoundButton status={RoundButtonStatus.ACTIVE} onClick={args.onClick}>
      I am active
    </RoundButton>
  </div>
);

ActiveRoundButton.storyName = 'active';

export const InactiveRoundButton = (args: DefaultArgs) => (
  <div className={styles.wrapper}>
    <RoundButton status={RoundButtonStatus.INACTIVE} onClick={args.onClick}>
      I am inactive
    </RoundButton>
  </div>
);

InactiveRoundButton.storyName = 'inactive';

export const DisabledRoundButton = (args: DefaultArgs) => (
  <div className={styles.wrapper}>
    <RoundButton status={RoundButtonStatus.DISABLED} onClick={args.onClick}>
      I am disabled
    </RoundButton>
  </div>
);

DisabledRoundButton.storyName = 'disabled';

export const CustomRoundButton = (args: DefaultArgs) => (
  <div className={styles.wrapper}>
    <RoundButton
      classNames={styles}
      status={RoundButtonStatus.ACTIVE}
      onClick={args.onClick}
    >
      Custom Active
    </RoundButton>
  </div>
);

CustomRoundButton.storyName = 'custom';

export const BadgedRoundButton = (args: DefaultArgs) => (
  <div className={styles.wrapper}>
    <BadgedButton badgeContent={'10'}>
      <RoundButton status={RoundButtonStatus.ACTIVE} onClick={args.onClick}>
        I have a badge
      </RoundButton>
    </BadgedButton>
  </div>
);

BadgedRoundButton.storyName = 'badged';
