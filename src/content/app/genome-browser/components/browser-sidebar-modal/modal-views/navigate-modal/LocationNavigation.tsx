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

import React, { FormEvent, KeyboardEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import { useAppSelector } from 'src/store';
import { useGenomeKaryotypeQuery } from 'src/shared/state/genome/genomeApiSlice';
import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import * as urlFor from 'src/shared/helpers/urlHelper';
import {
  validateGenomicLocation,
  type LocationValidationResponse
} from 'src/content/app/genome-browser/helpers/browserHelper';

import FlatInput from 'src/shared/components/input/FlatInput';
import { PrimaryButton } from 'src/shared/components/button/Button';
import SimpleSelect, {
  type SimpleSelectMethods
} from 'src/shared/components/simple-select/SimpleSelect';

import styles from './NavigateModal.scss';

const ERROR_MESSAGE =
  'Sorry, we do not recognise this location in this species.';

const LocationNavigation = () => {
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId) as string; // this component will never be rendered if genome id is missing
  const { genomeIdForUrl } = useGenomeBrowserIds();
  const selectRef = useRef<SimpleSelectMethods | null>(null);

  const navigate = useNavigate();

  const { data: genomeKaryotype = [] } = useGenomeKaryotypeQuery(
    activeGenomeId as string
  );

  const [regionNameInput, setRegionNameInput] = useState('');
  const [locationStartInput, setLocationStartInput] = useState('');
  const [locationEndInput, setLocationEndInput] = useState('');
  const [locationInput, setLocationInput] = useState('');

  const [segmentedInputActive, setsegmentedInputActive] = useState(false);
  const [singleInputActive, setSingleInputActive] = useState(false);

  const [shouldShowErrorMessage, setShowErrorMessage] =
    useState<boolean>(false);

  const shouldDisableSubmission =
    !(regionNameInput && locationStartInput && locationEndInput) &&
    !locationInput;

  const onSegmentedInputFocus = () => {
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

  const onLocationInputChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setLocationInput(value);
    setShowErrorMessage(false);
  };

  const handleSubmit = async () => {
    setShowErrorMessage(false);

    const newLocation = segmentedInputActive
      ? `${regionNameInput}:${locationStartInput}-${locationEndInput}`
      : locationInput;

    try {
      const validatedLocation = await validateGenomicLocation({
        regionInput: newLocation,
        genomeId: activeGenomeId
      });
      onValidationSuccess(validatedLocation);
    } catch (error) {
      if (error && typeof error === 'object' && 'region_id' in error) {
        onValidationError();
      }
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.currentTarget.blur();
      resetForm();
    }

    if (event.key === 'Enter' && !shouldDisableSubmission) {
      event.currentTarget.blur();
      handleSubmit();
    }
  };

  const getKaryotypeOptions = () =>
    genomeKaryotype.map(({ name }) => ({
      value: name,
      label: name
    }));

  const updateRegionNameInput = (event: FormEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;

    setsegmentedInputActive(true);
    setSingleInputActive(false);

    const selectedKaryotypeItems = genomeKaryotype.find(
      ({ name }) => name === value
    );

    if (selectedKaryotypeItems) {
      setRegionNameInput(value);
    }
  };

  const onValidationError = () => {
    setShowErrorMessage(true);
  };

  const resetForm = () => {
    selectRef.current?.clear();

    setRegionNameInput('');
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
    const { region_id } = validatedLocation;

    navigate(
      urlFor.browser({
        genomeId: genomeIdForUrl,
        focus: `location:${region_id}`
      }),
      {
        replace: true
      }
    );
  };

  const segmentedInputClasses = classNames(styles.segmentedInput, {
    [styles.segmentedInputDisabled]: singleInputActive
  });

  return (
    <section className={styles.navigateModal}>
      <div className={styles.helpText}>
        View a different location in this species by choosing a new chromosome
        or region
      </div>
      <div className={styles.navigateSection}>
        <div className={segmentedInputClasses}>
          <div className={styles.inputField}>
            <label>
              <span>Chr</span>
              <SimpleSelect
                onChange={updateRegionNameInput}
                onKeyUp={handleKeyPress}
                options={getKaryotypeOptions()}
                value={regionNameInput}
                disabled={singleInputActive}
                className={styles.rangeNameSelect}
                placeholder="Select"
                ref={selectRef}
              />
            </label>
          </div>
          <div className={styles.inputField}>
            <label>
              <span>Start</span>
              <FlatInput
                type="text"
                onFocus={onSegmentedInputFocus}
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
                onFocus={onSegmentedInputFocus}
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
                onChange={onLocationInputChange}
                onKeyUp={handleKeyPress}
                disabled={segmentedInputActive}
                value={locationInput}
                placeholder="Add location co-ordinates..."
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

export default LocationNavigation;
