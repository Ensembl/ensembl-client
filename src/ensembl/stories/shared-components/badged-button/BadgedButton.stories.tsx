import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Roundbutton from 'src/shared/components/round-button/RoundButton';
import BadgedButton from 'src/shared/components/badged-button/BadgedButton';
import { SecondaryButton } from 'src/shared/components/button/Button';
import { ReactComponent as DownloadIcon } from 'static/img/track-panel/download.svg';
import styles from './BadgedButton.stories.scss';
import ImageButton from 'src/shared/components/image-button/ImageButton';

import { Status } from 'src/shared/types/status';

const onClick = action('button-click');

storiesOf('Components|Shared Components/BadgedButton', module)
  .add('badged Button', () => (
    <div className={styles.wrapper}>
      <BadgedButton badgeContent={':)'}>
        <SecondaryButton onClick={onClick}>Secondary button</SecondaryButton>
      </BadgedButton>
    </div>
  ))
  .add('badged RoundButton', () => (
    <div className={styles.wrapper}>
      <BadgedButton badgeContent={':)'}>
        <Roundbutton onClick={onClick}>Badged RoundButton</Roundbutton>
      </BadgedButton>
    </div>
  ))
  .add('badged ImageButton', () => (
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
  ))
  .add('custom styling', () => (
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
  ));
