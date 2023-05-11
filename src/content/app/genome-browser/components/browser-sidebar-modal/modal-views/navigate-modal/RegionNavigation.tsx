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

import { useAppSelector } from 'src/store';
import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

import {
  getActualChrLocation,
  getBrowserActiveGenomeId,
  getChrLocation
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import {
  validateGenomicLocation,
  type LocationValidationResponse
} from 'src/content/app/genome-browser/helpers/browserHelper';

import GenomeBrowserNavigationButtons from './NavigationButtons';
import FlatInput from 'src/shared/components/input/FlatInput';
import { PrimaryButton } from 'src/shared/components/button/Button';

import type { ChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';

import styles from './NavigateModal.scss';

const ERROR_MESSAGE =
  'Sorry, we do not recognise this location in this region.';

const RegionNavigation = () => {
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId) as string; // this component will never be rendered if genome id is missing
  const chrLocation = useAppSelector(getChrLocation);
  const browserLocation = useAppSelector(getActualChrLocation) as ChrLocation;

  const { changeBrowserLocation } = useGenomeBrowser();

  const [locationStartInput, setLocationStartInput] = useState('');
  const [locationEndInput, setLocationEndInput] = useState('');
  const [locationInput, setLocationInput] = useState('');

  const [segmentedInputActive, setsegmentedInputActive] = useState(false);
  const [singleInputActive, setSingleInputActive] = useState(false);

  const [shouldShowErrorMessage, setShowErrorMessage] =
    useState<boolean>(false);

  const shouldDisableSubmission =
    !(locationStartInput && locationEndInput) && !locationInput;

  const onsegmentedInputFocus = () => {
    setsegmentedInputActive(true);
    setSingleInputActive(false);
  };

  const onSingleInputFocus = () => {
    setsegmentedInputActive(false);
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

  const handleSubmit = async () => {
    setShowErrorMessage(false);
    const [regionName] = chrLocation as ChrLocation;

    try {
      const validatedLocation = await validateGenomicLocation({
        regionInput: getLocationForSubmission(),
        genomeId: activeGenomeId
      });
      if (regionName !== validatedLocation.region?.region_name) {
        // asking to change a region is not allowed in this view
        onValidationError();
      } else {
        onValidationSuccess(validatedLocation);
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'region_id' in error) {
        onValidationError();
      }
    }
  };

  const getLocationForSubmission = () => {
    const [regionName] = chrLocation as ChrLocation;
    if (segmentedInputActive) {
      return `${regionName}:${locationStartInput}-${locationEndInput}`;
    } else {
      if (locationInput.includes(':')) {
        // user entered location in a full format; send it for verification as is
        return locationInput;
      } else {
        return `${regionName}:${locationInput}`;
      }
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

  const onValidationError = () => {
    setShowErrorMessage(true);
  };

  const resetForm = () => {
    setLocationStartInput('');
    setLocationEndInput('');
    setLocationInput('');

    setsegmentedInputActive(false);
    setSingleInputActive(false);

    setShowErrorMessage(false);
  };

  const onValidationSuccess = (
    validatedLocation: LocationValidationResponse
  ) => {
    resetForm();
    const regionName = validatedLocation.region?.region_name as string;
    const start = validatedLocation.start?.value as number;
    const end = validatedLocation.end?.value as number;

    changeBrowserLocation({
      genomeId: activeGenomeId as string,
      chrLocation: [regionName, start, end]
    });
  };

  return (
    <section className={styles.navigateModal}>
      <div className={styles.helpText}>
        Pan and zoom, or go to a new location in this chromosome or region only
      </div>
      <div className={styles.navigateSection}>
        {browserLocation && <GenomeBrowserNavigationButtons />}
        <div className={styles.segmentedInput}>
          <div className={styles.inputField}>
            <label>
              <span>Start</span>
              <FlatInput
                type="text"
                onFocus={onsegmentedInputFocus}
                onChange={onLocationStartChange}
                onKeyUp={handleKeyPress}
                disabled={singleInputActive}
                value={locationStartInput}
                placeholder="Add co-ordinate"
              />
            </label>
          </div>
          <div className={styles.inputField}>
            <label>
              <span>End</span>
              <FlatInput
                type="text"
                onFocus={onsegmentedInputFocus}
                onChange={onLocationEndChange}
                onKeyUp={handleKeyPress}
                disabled={singleInputActive}
                value={locationEndInput}
                placeholder="Add co-ordinate"
              />
            </label>
          </div>
          {segmentedInputActive && shouldShowErrorMessage && (
            <div className={styles.errorMessage}>{ERROR_MESSAGE}</div>
          )}
        </div>
        <div className={styles.singleInput}>
          <div className={styles.inputField}>
            <label>
              <span>Go to</span>
              <FlatInput
                type="text"
                onFocus={onSingleInputFocus}
                onChange={onLocationChange}
                onKeyUp={handleKeyPress}
                disabled={segmentedInputActive}
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
          {(segmentedInputActive || singleInputActive) && (
            <span
              className={classNames(styles.cancel, styles.clickableText)}
              onClick={resetForm}
            >
              Cancel
            </span>
          )}
          <PrimaryButton
            onClick={handleSubmit}
            disabled={shouldDisableSubmission}
          >
            Go
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
};

export default RegionNavigation;
