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

import React, { useState, ChangeEvent } from 'react';

import LoadingButton from 'src/shared/components/loading-button/LoadingButton';

import styles from './LoadingButton.stories.scss';

type DefaultArgs = {
  onSuccess: (...args: any) => void;
  onError: (...args: any) => void;
};

const longTask = (timeout: number, shouldError: boolean) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldError) {
        reject('Error!');
      } else {
        resolve('task completed');
      }
    }, timeout);
  });

export const LoadingButtonStory = (args: DefaultArgs) => {
  const [responseDuration, setResponseDuration] = useState(200);
  const [shouldError, setShouldError] = useState(false);

  const updateResponseDuration = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setResponseDuration(value);
  };

  const updateResponseError = () => {
    setShouldError(!shouldError);
  };

  return (
    <div className={styles.wrapper}>
      <LoadingButton
        onClick={() => longTask(responseDuration, shouldError)}
        onSuccess={(result: unknown) => args.onSuccess(result)}
        onError={(err: unknown) => args.onError(err)}
      >
        Press me!
      </LoadingButton>

      <p className={styles.note}>
        (note that regardless of the response duration, the spinner will be
        shown for at least 1 second)
      </p>

      <div className={styles.controls}>
        <div className={styles.responseDurationControl}>
          Response duration:
          <input
            type="range"
            min="50"
            max="5000"
            step="10"
            value={responseDuration}
            onChange={updateResponseDuration}
          />
          {responseDuration} ms
        </div>
        <div>
          Responds with an error:
          <input
            type="checkbox"
            checked={shouldError}
            onChange={updateResponseError}
          />
        </div>
      </div>
    </div>
  );
};

LoadingButtonStory.storyName = 'default';

export default {
  title: 'Components/Shared Components/LoadingButton',
  argTypes: {
    onSuccess: { action: 'success' },
    onError: { action: 'error' }
  }
};
