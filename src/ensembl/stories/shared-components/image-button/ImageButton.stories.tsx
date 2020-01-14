import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { ReactComponent as DownloadIcon } from 'static/img/track-panel/download.svg';

import ImageButton from 'src/shared/components/image-button/ImageButton';
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
  const [buttonStatus, setVisible] = useState(Status.DEFAULT);
  const computedStyles = { ...styles };

  const toggleImage = () => {
    switch (buttonStatus) {
      case Status.DEFAULT:
        return setVisible(Status.UNSELECTED);
      case Status.UNSELECTED:
        return setVisible(Status.SELECTED);
      default:
        return setVisible(Status.DEFAULT);
    }
  };
  return (
    <>
      <div className={classNames(styles.containerStyles)}>
        <div className={classNames(styles.imageCard)}>
          <div className={classNames(styles.imageHolder)}>
            <ImageButton
              buttonStatus={buttonStatus}
              description={'enable/disable'}
              image={icon.image}
              classNames={computedStyles}
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
              classNames={computedStyles}
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
              classNames={computedStyles}
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
              classNames={computedStyles}
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
