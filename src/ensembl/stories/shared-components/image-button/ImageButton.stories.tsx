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

import React, { useState } from 'react';
import classNames from 'classnames';

import ImageButton, {
  ImageButtonStatus
} from 'src/shared/components/image-button/ImageButton';

import { ReactComponent as DownloadIcon } from 'static/img/sidebar/download.svg';

import { Status } from 'src/shared/types/status';

import styles from './ImageButton.stories.scss';

const icon = {
  image: DownloadIcon,
  imageName: 'ImageButton',
  imagePath: 'static/img/track-panel/download.svg',
  imageClass: ''
};

export const ImageButtonStory = () => {
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
};

ImageButtonStory.storyName = 'default';

export default {
  title: 'Components/Shared Components/ImageButton'
};
