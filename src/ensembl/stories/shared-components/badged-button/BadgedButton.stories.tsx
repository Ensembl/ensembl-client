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
import noop from 'lodash/noop';

import Roundbutton from 'src/shared/components/round-button/RoundButton';
import BadgedButton from 'src/shared/components/badged-button/BadgedButton';
import { SecondaryButton } from 'src/shared/components/button/Button';
import { ReactComponent as DownloadIcon } from 'static/img/sidebar/download.svg';
import styles from './BadgedButton.stories.scss';
import ImageButton from 'src/shared/components/image-button/ImageButton';

import { Status } from 'src/shared/types/status';

const onClick = noop;

export default {
  title: 'Components/Shared Components/BadgedButton'
};

export const RegularBadgedButton = () => (
  <div className={styles.wrapper}>
    <BadgedButton badgeContent={':)'}>
      <SecondaryButton onClick={onClick}>Secondary button</SecondaryButton>
    </BadgedButton>
  </div>
);

RegularBadgedButton.storyName = 'badged Button';

export const BadgedRoundButton = () => (
  <div className={styles.wrapper}>
    <BadgedButton badgeContent={':)'}>
      <Roundbutton onClick={onClick}>Badged RoundButton</Roundbutton>
    </BadgedButton>
  </div>
);

BadgedRoundButton.storyName = 'badged RoundButton';

export const BadgedImageButton = () => (
  <div className={styles.imageButtonWrapper}>
    <BadgedButton badgeContent={':)'}>
      <ImageButton
        status={Status.SELECTED}
        description={'enable/disable'}
        image={DownloadIcon}
        onClick={onClick}
      />
    </BadgedButton>
  </div>
);

BadgedImageButton.storyName = 'badged ImageButton';

export const CustomStyledBadgedButton = () => (
  <div className={styles.imageButtonWrapper}>
    <BadgedButton badgeContent={':)'} className={styles.badge}>
      <ImageButton
        status={Status.SELECTED}
        description={'enable/disable'}
        image={DownloadIcon}
        onClick={onClick}
      />
    </BadgedButton>
  </div>
);

CustomStyledBadgedButton.storyName = 'custom styling';
