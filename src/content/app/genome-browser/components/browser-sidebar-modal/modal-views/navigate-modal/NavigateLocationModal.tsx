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

import React, { FormEvent, useRef, useState } from 'react';
import classNames from 'classnames';

import { useAppSelector, useAppDispatch } from 'src/store';
import { useGenomeKaryotypeQuery } from 'src/shared/state/genome/genomeApiSlice';
import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import { getNumberWithoutCommas } from 'src/shared/helpers/formatters/numberFormatter';
import {
  validateRegion,
  type RegionValidationErrors
} from 'src/content/app/genome-browser/helpers/browserHelper';

import Input from 'src/shared/components/input/Input';
import { PrimaryButton } from 'src/shared/components/button/Button';
import Tooltip from 'src/shared/components/tooltip/Tooltip';
import Select from 'src/shared/components/select/Select';

import { Position } from 'src/shared/components/pointer-box/PointerBox';
import {
  BrowserSidebarModalView,
  updateBrowserSidebarModalForGenome
} from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSlice';
import type { ChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';

import styles from './NavigateModal.scss';

const NavigateLocationModal = () => {
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId);

  const dispatch = useAppDispatch();

  const { data: genomeKaryotype = [] } = useGenomeKaryotypeQuery(
    activeGenomeId as string
  );
  const { changeBrowserLocation } = useGenomeBrowser();

  const [stickInput, setStickInput] = useState('');
  const [locationStartInput, setLocationStartInput] = useState('');
  const [locationEndInput, setLocationEndInput] = useState('');
  const [regionInput, setRegionInput] = useState('');

  const [coordInputsActive, setCoordInputsActive] = useState(false);
  const [regionInputActive, setRegionInputActive] = useState(false);

  const [locationStartErrorMessage, setLocationStartErrorMessage] = useState<
    string | null
  >(null);
  const [locationEndErrorMessage, setLocationEndErrorMessage] = useState<
    string | null
  >(null);
  const [regionErrorMessage, setRegionErrorMessage] = useState<string | null>(
    null
  );

  const stickRef = useRef<HTMLDivElement>(null);
  const locationStartRef = useRef<HTMLDivElement>(null);
  const locationEndRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  const onCoordInputsFocus = () => {
    setCoordInputsActive(true);
    setRegionInputActive(false);
  };

  const onRegionInputFocus = () => {
    setCoordInputsActive(false);
    setRegionInputActive(true);
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

  const onRegionChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setRegionInput(value);
    setRegionErrorMessage(null);
  };

  const handleSubmit = () => {
    if (activeGenomeId) {
      setRegionErrorMessage(null);

      const newLocation = coordInputsActive
        ? `${stickInput}:${locationStartInput}-${locationEndInput}`
        : regionInput;

      validateRegion({
        regionInput: newLocation,
        genomeId: activeGenomeId,
        onSuccess: onValidationSuccess,
        onError: onValidationError
      });
    }
  };

  const getKaryotypeOptions = () =>
    genomeKaryotype.map(({ name }) => ({
      value: name,
      label: name,
      isSelected: stickInput === name
    }));

  const updateStickInput = (value: string) => {
    setCoordInputsActive(true);
    setRegionInputActive(false);

    const selectedKaryotypeItems = genomeKaryotype.filter(
      ({ name }) => name === value
    );

    if (selectedKaryotypeItems[0]) {
      setStickInput(value);
    }
  };

  const updateErrorMessages = (
    locationStartError: string | null,
    locationEndError: string | null,
    regionError: string | null
  ) => {
    setLocationStartErrorMessage(locationStartError);
    setLocationEndErrorMessage(locationEndError);
    setRegionErrorMessage(regionError);
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
    setStickInput('');
    setLocationStartInput('');
    setLocationEndInput('');
    setRegionInput('');

    setCoordInputsActive(false);
    setRegionInputActive(false);

    updateErrorMessages(null, null, null);
  };

  const onValidationSuccess = () => {
    resetForm();

    const newChrLocation: ChrLocation = [
      stickInput,
      getNumberWithoutCommas(locationStartInput),
      getNumberWithoutCommas(locationEndInput)
    ];

    changeBrowserLocation({
      genomeId: activeGenomeId as string,
      chrLocation: newChrLocation
    });
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
    <section>
      <p>
        <span className={styles.clickableText} onClick={switchToNavigateRegion}>
          Navigate this region
        </span>
      </p>
      <p>Go to new location</p>
      <div className={styles.coordInputs}>
        <div className={styles.inputGroup} ref={stickRef}>
          <label>
            <span>Chr</span>
            <Select
              onSelect={updateStickInput}
              options={getKaryotypeOptions()}
            ></Select>
          </label>
        </div>
        <div className={styles.inputGroup} ref={locationStartRef}>
          <label>
            <span>Start</span>
            <Input
              type="text"
              onFocus={onCoordInputsFocus}
              onChange={onLocationStartChange}
              disabled={regionInputActive}
              value={locationStartInput}
              placeholder="Co-ordinate"
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
              disabled={regionInputActive}
              value={locationEndInput}
              placeholder="Co-ordinate"
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
      <div className={styles.regionInput}>
        <div className={styles.inputGroup} ref={regionRef}>
          <label>
            <span>Go to</span>
            <Input
              type="text"
              onFocus={onRegionInputFocus}
              onChange={onRegionChange}
              disabled={coordInputsActive}
              value={regionInput}
              placeholder="Location to co-ordinates..."
            />
            {regionErrorMessage ? (
              <Tooltip
                anchor={regionRef.current}
                autoAdjust={true}
                container={regionRef.current}
                position={Position.BOTTOM_LEFT}
              >
                {regionErrorMessage}
              </Tooltip>
            ) : null}
          </label>
        </div>
      </div>
      <div className={styles.formButtons}>
        {(coordInputsActive || regionInputActive) && (
          <span
            className={classNames(styles.cancel, styles.clickableText)}
            onClick={resetForm}
          >
            cancel
          </span>
        )}
        <PrimaryButton
          onClick={handleSubmit}
          isDisabled={!coordInputsActive && !regionInputActive}
        >
          Go
        </PrimaryButton>
      </div>
    </section>
  );
};

export default NavigateLocationModal;
