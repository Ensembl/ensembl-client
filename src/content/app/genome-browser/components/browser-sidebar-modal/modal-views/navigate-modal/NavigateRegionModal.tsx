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

import React, { FormEvent, KeyboardEvent, useState } from 'react';
import classNames from 'classnames';

import { useAppSelector, useAppDispatch } from 'src/store';
import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

import {
  getBrowserActiveGenomeId,
  getChrLocation
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { getBrowserNavButtonStates } from 'src/content/app/genome-browser/state/browser-nav/browserNavSelectors';

import { getNumberWithoutCommas } from 'src/shared/helpers/formatters/numberFormatter';
import {
  getChrLocationFromStr,
  validateRegion,
  type RegionValidationErrors
} from 'src/content/app/genome-browser/helpers/browserHelper';

import BrowserNavButton from 'src/content/app/genome-browser/components/browser-nav-button/BrowserNavButton';
import BrowserReset from 'src/content/app/genome-browser/components/browser-reset/BrowserReset';
import Input from 'src/shared/components/input/Input';
import { PrimaryButton } from 'src/shared/components/button/Button';

import {
  BrowserSidebarModalView,
  updateBrowserSidebarModalForGenome
} from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSlice';
import { BrowserNavAction } from 'src/content/app/genome-browser/state/browser-nav/browserNavSlice';
import type { ChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';

import NavigateLeftIcon from 'static/icons/navigate-left.svg';
import NavigateRightIcon from 'static/icons/navigate-right.svg';
import ZoomInIcon from 'static/icons/icon_plus_circle.svg';
import ZoomOutIcon from 'static/icons/icon_minus_circle.svg';

import styles from './NavigateModal.scss';

const ERROR_MESSAGE =
  'Sorry, we do not recognise this location in this region.';

const NavigateRegionModal = () => {
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId);
  const chrLocation = useAppSelector(getChrLocation);

  const dispatch = useAppDispatch();

  const { changeBrowserLocation } = useGenomeBrowser();

  const [locationStartInput, setLocationStartInput] = useState('');
  const [locationEndInput, setLocationEndInput] = useState('');
  const [locationInput, setLocationInput] = useState('');

  const [segmentedInputsActive, setSegmentedInputsActive] = useState(false);
  const [singleInputActive, setSingleInputActive] = useState(false);

  const [shouldShowErrorMessage, setShowErrorMessage] =
    useState<boolean>(false);

  const shouldDisableSubmission =
    !(locationStartInput && locationEndInput) && !locationInput;

  const onSegmentedInputsFocus = () => {
    setSegmentedInputsActive(true);
    setSingleInputActive(false);
  };

  const onSingleInputFocus = () => {
    setSegmentedInputsActive(false);
    setSingleInputActive(true);
  };

  const onLocationStartChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setLocationStartInput(value);
    setShowErrorMessage(false);
  };

  const onLocationEndChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setLocationEndInput(value);
    setShowErrorMessage(false);
  };

  const onLocationChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setLocationInput(value);
    setShowErrorMessage(false);
  };

  const handleSubmit = () => {
    if (activeGenomeId) {
      setShowErrorMessage(false);

      const [stick] = chrLocation as ChrLocation;
      const coords = segmentedInputsActive
        ? `${locationStartInput}-${locationEndInput}`
        : locationInput;
      const newLocation = `${stick}:${coords}`;

      validateRegion({
        regionInput: newLocation,
        genomeId: activeGenomeId,
        onSuccess: onValidationSuccess,
        onError: onValidationError
      });
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.currentTarget.blur();
      resetForm();
    }

    if (event.key === 'Enter' && !shouldDisableSubmission) {
      event.currentTarget.blur();
      handleSubmit();
    }
  };

  const onValidationError = (errorMessages: RegionValidationErrors) => {
    const {
      startError = null,
      endError = null,
      regionError = null
    } = errorMessages;
    if (startError || endError || regionError) {
      setShowErrorMessage(true);
    }
  };

  const resetForm = () => {
    setLocationStartInput('');
    setLocationEndInput('');
    setLocationInput('');

    setSegmentedInputsActive(false);
    setSingleInputActive(false);

    setShowErrorMessage(false);
  };

  const onValidationSuccess = () => {
    resetForm();

    const [stick] = chrLocation as ChrLocation;
    let newChrLocation: ChrLocation;

    if (segmentedInputsActive) {
      newChrLocation = [
        stick,
        getNumberWithoutCommas(locationStartInput),
        getNumberWithoutCommas(locationEndInput)
      ];
    } else {
      newChrLocation = getChrLocationFromStr(`${stick}:${locationInput}`);
    }

    changeBrowserLocation({
      genomeId: activeGenomeId as string,
      chrLocation: newChrLocation
    });
  };

  const switchToNavigateLocation = () => {
    if (!activeGenomeId) {
      return;
    }

    dispatch(
      updateBrowserSidebarModalForGenome({
        activeGenomeId,
        data: {
          browserSidebarModalView: BrowserSidebarModalView.NAVIGATE_LOCATION
        }
      })
    );
  };

  return (
    <section className={styles.navigateModal}>
      <p>Navigate this region</p>
      <BrowserNavBarControls />
      <div className={styles.segmentedInputs}>
        <div className={styles.inputGroup}>
          <label>
            <span>Start</span>
            <Input
              type="text"
              onFocus={onSegmentedInputsFocus}
              onChange={onLocationStartChange}
              onKeyUp={handleKeyPress}
              disabled={singleInputActive}
              value={locationStartInput}
              placeholder="Add co-ordinate"
            />
          </label>
        </div>
        <div className={styles.inputGroup}>
          <label>
            <span>End</span>
            <Input
              type="text"
              onFocus={onSegmentedInputsFocus}
              onChange={onLocationEndChange}
              onKeyUp={handleKeyPress}
              disabled={singleInputActive}
              value={locationEndInput}
              placeholder="Add co-ordinate"
            ></Input>
          </label>
        </div>
        {segmentedInputsActive && shouldShowErrorMessage && (
          <div className={styles.errorMessage}>{ERROR_MESSAGE}</div>
        )}
      </div>
      <div className={styles.singleInput}>
        <div className={styles.inputGroup}>
          <label>
            <span>Go to</span>
            <Input
              type="text"
              onFocus={onSingleInputFocus}
              onChange={onLocationChange}
              onKeyUp={handleKeyPress}
              disabled={segmentedInputsActive}
              value={locationInput}
              placeholder="Add region co-ordinates..."
            />
          </label>
        </div>
        {singleInputActive && shouldShowErrorMessage && (
          <div className={styles.errorMessage}>{ERROR_MESSAGE}</div>
        )}
      </div>
      <div className={styles.formButtons}>
        {(segmentedInputsActive || singleInputActive) && (
          <span
            className={classNames(styles.cancel, styles.clickableText)}
            onClick={resetForm}
          >
            Cancel
          </span>
        )}
        <PrimaryButton
          onClick={handleSubmit}
          isDisabled={shouldDisableSubmission}
        >
          Go
        </PrimaryButton>
      </div>
      <div>
        <p>
          <span
            className={classNames(styles.cancel, styles.clickableText)}
            onClick={switchToNavigateLocation}
          >
            Go to new location
          </span>
        </p>
      </div>
    </section>
  );
};

const BrowserNavBarControls = () => {
  const browserNavButtonStates = useAppSelector(getBrowserNavButtonStates);

  return (
    <div className={styles.browserNavBarControls}>
      <BrowserNavButton
        name={BrowserNavAction.MOVE_LEFT}
        description="navigate left"
        detail={{ move_left_px: 50 }}
        enabled={browserNavButtonStates[BrowserNavAction.MOVE_LEFT]}
        icon={NavigateLeftIcon}
      />
      <BrowserNavButton
        name={BrowserNavAction.MOVE_RIGHT}
        description="navigate right"
        detail={{ move_right_px: 50 }}
        enabled={browserNavButtonStates[BrowserNavAction.MOVE_RIGHT]}
        icon={NavigateRightIcon}
      />
      <BrowserNavButton
        name={BrowserNavAction.ZOOM_OUT}
        description="zoom out"
        detail={{ zoom_by: -0.3 }}
        enabled={browserNavButtonStates[BrowserNavAction.ZOOM_OUT]}
        icon={ZoomOutIcon}
        className={styles.zoomOutButton}
      />
      <BrowserNavButton
        name={BrowserNavAction.ZOOM_IN}
        description="zoom in"
        detail={{ zoom_by: 0.3 }}
        enabled={browserNavButtonStates[BrowserNavAction.ZOOM_IN]}
        icon={ZoomInIcon}
        className={styles.zoomInButton}
      />
      <BrowserReset className={styles.browserReset} />
    </div>
  );
};

export default NavigateRegionModal;
