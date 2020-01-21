import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { ReactComponent as DownloadIcon } from 'static/img/track-panel/download.svg';

import ImageButton, {
  ImageButtonStatus
} from 'src/shared/components/image-button/ImageButton';
import { Status } from 'src/shared/types/status';

import classNames from 'classnames';
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
  const [buttonStatus, setButtonStatus] = useState(Status.DEFAULT);

  const toggleImage = () => {
    switch (buttonStatus) {
      case Status.DEFAULT:
        return setButtonStatus(Status.UNSELECTED);
      case Status.UNSELECTED:
        return setButtonStatus(Status.SELECTED);
      default:
        return setButtonStatus(Status.DEFAULT);
    }
  };
  return (
    <>
      <div className={classNames(styles.containerStyles)}>
        <div className={classNames(styles.imageCard)}>
          <div className={classNames(styles.imageHolder)}>
            <ImageButton
              buttonStatus={buttonStatus as ImageButtonStatus}
              description={'enable/disable'}
              image={icon.image}
              onClick={toggleImage}
            />
          </div>
          <div className={classNames(styles.imageDescription)}>
            {buttonStatus}
          </div>
        </div>

        <div className={classNames(styles.codeContent)}>
          <h3>Usage:</h3>
          {`import ImageButton, {ImageButtonStatus} from 'src/shared/image-button/ImageButton';`}
          <br />
          {`import { ReactComponent as ${icon.imageName} } from '${icon.imagePath}';`}
          <br />
          {`
              <ImageButton buttonStatus={ImageButtonStatus.${buttonStatus.toUpperCase()}} 
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
              buttonStatus={Status.UNSELECTED}
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
              buttonStatus={Status.SELECTED}
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
              buttonStatus={Status.DISABLED}
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
