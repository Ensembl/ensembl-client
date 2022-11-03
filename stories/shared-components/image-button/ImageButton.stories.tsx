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

import ImageButton, {
  ImageButtonStatus
} from 'src/shared/components/image-button/ImageButton';

import DownloadIcon from 'static/icons/icon_download.svg';

import { Status } from 'src/shared/types/status';

import styles from './ImageButton.stories.scss';

export const ImageButtonStory = () => {
  const [status, setStatus] = useState(Status.DEFAULT);

  const toggleImage = () => {
    const statusSequence = [Status.DEFAULT, Status.SELECTED, Status.UNSELECTED];
    const currentStatusIndex = statusSequence.indexOf(status);
    const nextStatusIndex = (currentStatusIndex + 1) % statusSequence.length;
    const nextStatus = statusSequence[nextStatusIndex];
    setStatus(nextStatus);
  };

  return (
    <div className={styles.defaultStoryContainer}>
      <ImageButton
        className={styles.imageButton}
        status={status as ImageButtonStatus}
        description={`This is image button in ${status} state`}
        image={DownloadIcon}
        onClick={toggleImage}
      />
      <p>
        I am an image button, and my status is {status}. Click me to move to the
        next status
      </p>
      <ImageButton
        className={styles.imageButton}
        status={Status.DISABLED}
        description="I am a disabled button; but I will still show a tooltip when moused over"
        image={DownloadIcon}
        onClick={toggleImage}
      />
      <p>
        I am a disabled button; but I will still show a tooltip when moused over
      </p>
      <ImageButton
        className={styles.styledDefaultStoryButton}
        status={Status.DEFAULT}
        description="I am a button with custom styling"
        image={DownloadIcon}
        onClick={toggleImage}
      />
      <p>I am a button styled via a CSS class passed by the parent</p>
    </div>
  );
};

ImageButtonStory.storyName = 'default';

export default {
  title: 'Components/Shared Components/ImageButton'
};
