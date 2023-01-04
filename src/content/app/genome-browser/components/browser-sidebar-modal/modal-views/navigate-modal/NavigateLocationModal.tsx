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

import { useAppSelector, useAppDispatch } from 'src/store';
import { useGenomeKaryotypeQuery } from 'src/shared/state/genome/genomeApiSlice';
import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import * as urlFor from 'src/shared/helpers/urlHelper';
import {
  validateRegion,
  type RegionValidationErrors
} from 'src/content/app/genome-browser/helpers/browserHelper';

import Input from 'src/shared/components/input/Input';
import { PrimaryButton } from 'src/shared/components/button/Button';
import SimpleSelect, {
  type SimpleSelectMethods
} from 'src/shared/components/simple-select/SimpleSelect';

import {
  BrowserSidebarModalView,
  updateBrowserSidebarModalForGenome
} from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSlice';

import styles from './NavigateModal.scss';

const ERROR_MESSAGE =
  'Sorry, we do not recognise this location in this species.';

const NavigateLocationModal = () => {
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId);
  const { genomeIdForUrl } = useGenomeBrowserIds();
  const selectRef = useRef<SimpleSelectMethods | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: genomeKaryotype = [] } = useGenomeKaryotypeQuery(
    activeGenomeId as string
  );

  const [regionNameInput, setRegionNameInput] = useState('');
  const [locationStartInput, setLocationStartInput] = useState('');
  const [locationEndInput, setLocationEndInput] = useState('');
  const [locationInput, setLocationInput] = useState('');

  const [segmentedInputsActive, setSegmentedInputsActive] = useState(false);
  const [singleInputActive, setSingleInputActive] = useState(false);

  const [shouldShowErrorMessage, setShowErrorMessage] =
    useState<boolean>(false);

  const shouldDisableSubmission =
    !(regionNameInput && locationStartInput && locationEndInput) &&
    !locationInput;

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

  const onLocationInputChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setLocationInput(value);
    setShowErrorMessage(false);
  };

  const handleSubmit = () => {
    if (activeGenomeId) {
      setShowErrorMessage(false);

      const newLocation = segmentedInputsActive
        ? `${regionNameInput}:${locationStartInput}-${locationEndInput}`
        : locationInput;

      validateRegion({
        regionInput: newLocation,
        genomeId: activeGenomeId,
        onSuccess: onValidationSuccess,
        onError: onValidationError
      });
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
      label: name,
      isSelected: regionNameInput === name
    }));

  const updateRegionNameInput = (event: FormEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;

    setSegmentedInputsActive(true);
    setSingleInputActive(false);

    const selectedKaryotypeItems = genomeKaryotype.find(
      ({ name }) => name === value
    );

    if (selectedKaryotypeItems) {
      setRegionNameInput(value);
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
    selectRef.current?.clear();

    setRegionNameInput('');
    setLocationStartInput('');
    setLocationEndInput('');
    setLocationInput('');

    setSegmentedInputsActive(false);
    setSingleInputActive(false);

    setShowErrorMessage(false);
  };

  const onValidationSuccess = () => {
    resetForm();

    const locationString = segmentedInputsActive
      ? `${regionNameInput}:${locationStartInput}-${locationEndInput}`
      : locationInput;
    const focusLocationString = `location:${locationString}`;

    navigate(
      urlFor.browser({
        genomeId: genomeIdForUrl,
        focus: focusLocationString
      }),
      {
        replace: true
      }
    );
  };

  const switchToNavigateRegion = () => {
    if (!activeGenomeId) {
      return;
    }

    dispatch(
      updateBrowserSidebarModalForGenome({
        activeGenomeId,
        data: {
          browserSidebarModalView: BrowserSidebarModalView.NAVIGATE_REGION
        }
      })
    );
  };

  return (
    <section className={styles.navigateModal}>
      <p>
        <span className={styles.clickableText} onClick={switchToNavigateRegion}>
          Navigate this region
        </span>
      </p>
      <p>Go to new location</p>
      <div className={styles.segmentedInputs}>
        <div className={styles.inputGroup}>
          <label>
            <span>Chr</span>
            <SimpleSelect
              onChange={updateRegionNameInput}
              onKeyUp={handleKeyPress}
              options={getKaryotypeOptions()}
              disabled={singleInputActive}
              className={styles.rangeNameSelect}
              placeholder="Select"
              ref={selectRef}
            />
          </label>
        </div>
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
              onChange={onLocationInputChange}
              onKeyUp={handleKeyPress}
              disabled={segmentedInputsActive}
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
    </section>
  );
};

export default NavigateLocationModal;
