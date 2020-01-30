import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import classNames from 'classnames';

import ImageButton, {
  ImageButtonStatus
} from 'src/shared/components/image-button/ImageButton';

import { ReactComponent as DownloadIcon } from 'static/img/sidebar/download.svg';

import { Status } from 'src/shared/types/status';

import styles from './ImageButton.stories.scss';

const trackPanelButtonStories = storiesOf(
  'Components|Shared Components',
  module
);

const icon = {
  image: DownloadIcon,
  imageName: 'ImageButton',
  imagePath: 'static/img/track-panel/download.svg',
  imageClass: ''
};

trackPanelButtonStories.add(icon.imageName, () => {
  const [status, setStatus] = useState(Status.DEFAULT);

  const toggleImage = () => {
    switch (status) {
      case Status.DEFAULT:
        return setStatus(Status.UNSELECTED);
      case Status.UNSELECTED:
        return setStatus(Status.SELECTED);
      default:
        return setStatus(Status.DEFAULT);
    }
  };
  return (
    <>
      <div className={classNames(styles.containerStyles)}>
        <div className={classNames(styles.imageCard)}>
          <div className={classNames(styles.imageHolder)}>
            <ImageButton
              status={status as ImageButtonStatus}
              description={'enable/disable'}
              image={icon.image}
              onClick={toggleImage}
            />
          </div>
          <div className={classNames(styles.imageDescription)}>{status}</div>
        </div>

        <div className={classNames(styles.codeContent)}>
          <h3>Usage:</h3>
          {`import ImageButton, {ImageButtonStatus} from 'src/shared/image-button/ImageButton';`}
          <br />
          {`import { ReactComponent as ${icon.imageName} } from '${icon.imagePath}';`}
          <br />
          {`
              <ImageButton status={ImageButtonStatus.${status.toUpperCase()}} 
                description={'enable/disable'} 
                image={${icon.imageName}}
              />
            `}
        </div>
      </div>
      <div className={classNames(styles.containerStyles)}>
        <div>Available styles:</div>
        <div className={classNames(styles.imageCard)}>
          <div className={classNames(styles.imageHolder)}>
            <ImageButton
              status={Status.UNSELECTED}
              description={'enable/disable'}
              image={icon.image}
            />
          </div>
          <div className={classNames(styles.imageDescription)}>
            {Status.UNSELECTED}
          </div>
        </div>

        <div className={classNames(styles.imageCard)}>
          <div className={classNames(styles.imageHolder)}>
            <ImageButton
              status={Status.SELECTED}
              description={'enable/disable'}
              image={icon.image}
            />
          </div>
          <div className={classNames(styles.imageDescription)}>
            {Status.SELECTED}
          </div>
        </div>

        <div className={classNames(styles.imageCard)}>
          <div className={classNames(styles.imageHolder)}>
            <ImageButton
              status={Status.DISABLED}
              description={'enable/disable'}
              image={icon.image}
            />
          </div>
          <div className={classNames(styles.imageDescription)}>
            {Status.DISABLED}
          </div>
        </div>
      </div>
    </>
  );
});
