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

import { useState, ChangeEvent } from 'react';

import LoadingButton, {
  ControlledLoadingButton
} from 'src/shared/components/loading-button';
import RadioGroup, {
  OptionValue
} from 'src/shared/components/radio-group/RadioGroup';
import CheckboxWithLabel from 'src/shared/components/checkbox-with-label/CheckboxWithLabel';

import { LoadingState } from 'src/shared/types/loading-state';

import styles from './LoadingButton.stories.module.css';

type DefaultArgs = {
  onClick: (...args: any) => void;
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
      <div className={styles.backgroundComparisonGrid}>
        <div className={styles.columnHeading}>Light background</div>
        <div className={styles.columnHeading}>Dark background</div>
        <div className={styles.lightContainer}>
          <LoadingButton
            onClick={() => longTask(responseDuration, shouldError)}
            onSuccess={(result: unknown) => args.onSuccess(result)}
            onError={(err: unknown) => args.onError(err)}
          >
            Press me!
          </LoadingButton>
        </div>

        <div className={styles.darkContainer}>
          <LoadingButton
            onClick={() => longTask(responseDuration, shouldError)}
            onSuccess={(result: unknown) => args.onSuccess(result)}
            onError={(err: unknown) => args.onError(err)}
          >
            Press me!
          </LoadingButton>
        </div>
      </div>

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

export const ControlledLoadingButtonStory = (args: DefaultArgs) => {
  const [buttonStatus, setButtonStatus] = useState<LoadingState>(
    LoadingState.NOT_REQUESTED
  );
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const buttonStatuses = [
    { value: LoadingState.NOT_REQUESTED, label: 'Initial' },
    { value: LoadingState.LOADING, label: 'Loading' },
    { value: LoadingState.SUCCESS, label: 'Success' },
    { value: LoadingState.ERROR, label: 'Error' }
  ];

  const onStatusChange = (newStatus: OptionValue) => {
    setButtonStatus(newStatus as LoadingState);
  };

  const onDisabledChange = () => {
    setIsDisabled(!isDisabled);
  };

  return (
    <div className={styles.wrapper}>
      <ControlledLoadingButton
        status={buttonStatus}
        onClick={args.onClick}
        disabled={isDisabled}
      >
        I am button
      </ControlledLoadingButton>
      <p className={styles.note}>
        (notice that this button is controlled entirely from the outside)
      </p>
      <div className={styles.controls}>
        <RadioGroup
          options={buttonStatuses}
          selectedOption={buttonStatus}
          onChange={onStatusChange}
        />
      </div>
      <div className={styles.buttonDisableControlWrapper}>
        <CheckboxWithLabel
          checked={isDisabled}
          onChange={onDisabledChange}
          label="Disabled"
        />
      </div>
    </div>
  );
};

ControlledLoadingButtonStory.storyName = 'controlled';

export default {
  title: 'Components/Shared Components/LoadingButton',
  argTypes: {
    onClick: { action: 'click' },
    onSuccess: { action: 'success' },
    onError: { action: 'error' }
  }
};
