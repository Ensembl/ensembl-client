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
import Tooltip from 'src/shared/components/tooltip/Tooltip';
import SimpleSelect, {
  type SimpleSelectMethods
} from 'src/shared/components/simple-select/SimpleSelect';

import {
  BrowserSidebarModalView,
  updateBrowserSidebarModalForGenome
} from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSlice';

import { Position } from 'src/shared/components/pointer-box/PointerBox';

import styles from './NavigateModal.scss';

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

  const [coordInputsActive, setCoordInputsActive] = useState(false);
  const [locationInputActive, setLocationInputActive] = useState(false);

  const [locationStartErrorMessage, setLocationStartErrorMessage] = useState<
    string | null
  >(null);
  const [locationEndErrorMessage, setLocationEndErrorMessage] = useState<
    string | null
  >(null);
  const [locationErrorMessage, setLocationErrorMessage] = useState<
    string | null
  >(null);

  const regionNameInputRef = useRef<HTMLDivElement>(null);
  const locationStartRef = useRef<HTMLDivElement>(null);
  const locationEndRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  const onCoordInputsFocus = () => {
    setCoordInputsActive(true);
    setLocationInputActive(false);
  };

  const onLocationInputFocus = () => {
    setCoordInputsActive(false);
    setLocationInputActive(true);
  };

  const onLocationStartChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setLocationStartInput(value);
    setLocationStartErrorMessage(null);
  };

  const onLocationEndChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setLocationEndInput(value);
    setLocationEndErrorMessage(null);
  };

  const onLocationInputChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setLocationInput(value);
    setLocationErrorMessage(null);
  };

  const handleSubmit = () => {
    if (activeGenomeId) {
      setLocationErrorMessage(null);

      const newLocation = coordInputsActive
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

    if (event.key === 'Enter') {
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

    setCoordInputsActive(true);
    setLocationInputActive(false);

    const selectedKaryotypeItems = genomeKaryotype.find(
      ({ name }) => name === value
    );

    if (selectedKaryotypeItems) {
      setRegionNameInput(value);
    }
  };

  const updateErrorMessages = (
    locationStartError: string | null,
    locationEndError: string | null,
    locationError: string | null
  ) => {
    if (coordInputsActive) {
      setLocationStartErrorMessage(locationStartError);
      setLocationEndErrorMessage(locationEndError);
    } else {
      setLocationErrorMessage(
        locationStartError || locationEndError || locationError
      );
    }
  };

  const onValidationError = (errorMessages: RegionValidationErrors) => {
    const {
      startError = null,
      endError = null,
      regionError = null
    } = errorMessages;
    updateErrorMessages(startError, endError, regionError);
  };

  const resetForm = () => {
    selectRef.current?.clear();

    setRegionNameInput('');
    setLocationStartInput('');
    setLocationEndInput('');
    setLocationInput('');

    setCoordInputsActive(false);
    setLocationInputActive(false);

    updateErrorMessages(null, null, null);
  };

  const onValidationSuccess = () => {
    resetForm();

    const locationString = coordInputsActive
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
      <div className={styles.coordInputs}>
        <div className={styles.inputGroup} ref={regionNameInputRef}>
          <label>
            <span>Chr</span>
            <SimpleSelect
              onChange={updateRegionNameInput}
              onKeyUp={handleKeyPress}
              options={getKaryotypeOptions()}
              disabled={locationInputActive}
              className={styles.rangeNameSelect}
              placeholder="Select"
              ref={selectRef}
            />
          </label>
        </div>
        <div className={styles.inputGroup} ref={locationStartRef}>
          <label>
            <span>Start</span>
            <Input
              type="text"
              onFocus={onCoordInputsFocus}
              onChange={onLocationStartChange}
              onKeyUp={handleKeyPress}
              disabled={locationInputActive}
              value={locationStartInput}
              placeholder="Add co-ordinate"
            />
          </label>
          {locationStartErrorMessage ? (
            <Tooltip
              anchor={locationStartRef.current}
              autoAdjust={true}
              container={locationStartRef.current}
              position={Position.BOTTOM_LEFT}
            >
              {locationStartErrorMessage}
            </Tooltip>
          ) : null}
        </div>
        <div className={styles.inputGroup} ref={locationEndRef}>
          <label>
            <span>End</span>
            <Input
              type="text"
              onFocus={onCoordInputsFocus}
              onChange={onLocationEndChange}
              onKeyUp={handleKeyPress}
              disabled={locationInputActive}
              value={locationEndInput}
              placeholder="Add co-ordinate"
            ></Input>
          </label>
          {!locationStartErrorMessage && locationEndErrorMessage ? (
            <Tooltip
              anchor={locationEndRef.current}
              autoAdjust={true}
              container={locationEndRef.current}
              position={Position.BOTTOM_LEFT}
            >
              {locationEndErrorMessage}
            </Tooltip>
          ) : null}
        </div>
      </div>
      <div className={styles.locationInput}>
        <div className={styles.inputGroup} ref={locationRef}>
          <label>
            <span>Go to</span>
            <Input
              type="text"
              onFocus={onLocationInputFocus}
              onChange={onLocationInputChange}
              onKeyUp={handleKeyPress}
              disabled={coordInputsActive}
              value={locationInput}
              placeholder="Add location co-ordinates..."
            />
            {locationErrorMessage ? (
              <Tooltip
                anchor={locationRef.current}
                autoAdjust={true}
                container={locationRef.current}
                position={Position.BOTTOM_LEFT}
              >
                {locationErrorMessage}
              </Tooltip>
            ) : null}
          </label>
        </div>
      </div>
      <div className={styles.formButtons}>
        {(coordInputsActive || locationInputActive) && (
          <span
            className={classNames(styles.cancel, styles.clickableText)}
            onClick={resetForm}
          >
            Cancel
          </span>
        )}
        <PrimaryButton
          onClick={handleSubmit}
          isDisabled={
            !(regionNameInput && locationStartInput && locationEndInput) &&
            !locationInput
          }
        >
          Go
        </PrimaryButton>
      </div>
    </section>
  );
};

export default NavigateLocationModal;
