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
import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

import {
  getBrowserActiveGenomeId,
  getChrLocation
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { getBrowserNavIconStates } from 'src/content/app/genome-browser/state/browser-nav/browserNavSelectors';

import {
  browserNavConfig,
  type BrowserNavItem
} from 'src/content/app/genome-browser/components/browser-nav-icon/browserNavConfig';
import { getNumberWithoutCommas } from 'src/shared/helpers/formatters/numberFormatter';
import {
  validateRegion,
  type RegionValidationErrors
} from 'src/content/app/genome-browser/helpers/browserHelper';

import BrowserNavIcon from 'src/content/app/genome-browser/components/browser-nav-icon/BrowserNavIcon';
import BrowserReset from 'src/content/app/genome-browser/components/browser-reset/BrowserReset';
import Input from 'src/shared/components/input/Input';
import { PrimaryButton } from 'src/shared/components/button/Button';
import Tooltip from 'src/shared/components/tooltip/Tooltip';

import { Position } from 'src/shared/components/pointer-box/PointerBox';
import {
  BrowserSidebarModalView,
  updateBrowserSidebarModalForGenome
} from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSlice';
import { BrowserNavAction } from 'src/content/app/genome-browser/state/browser-nav/browserNavSlice';
import type { ChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';

import styles from './NavigateModal.scss';

const NavigateRegionModal = () => {
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId);
  const browserNavIconStates = useAppSelector(getBrowserNavIconStates);
  const chrLocation = useAppSelector(getChrLocation);

  const dispatch = useAppDispatch();

  const { changeBrowserLocation } = useGenomeBrowser();

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
  };

  const onLocationEndChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setLocationEndInput(value);
  };

  const onRegionChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setRegionInput(value);
  };

  const handleSubmit = () => {
    if (activeGenomeId) {
      setRegionErrorMessage(null);

      const [stick] = chrLocation as ChrLocation;
      const coords = coordInputsActive
        ? `${locationStartInput}-${locationEndInput}`
        : regionInput;
      const newLocation = `${stick}:${coords}`;

      validateRegion({
        regionInput: newLocation,
        genomeId: activeGenomeId,
        onSuccess: onValidationSuccess,
        onError: onValidationError
      });
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
    setLocationStartInput('');
    setLocationEndInput('');
    setRegionInput('');

    setCoordInputsActive(false);
    setRegionInputActive(false);

    updateErrorMessages(null, null, null);
  };

  const onValidationSuccess = () => {
    resetForm();

    const [stick] = chrLocation as ChrLocation;
    const newChrLocation: ChrLocation = [
      stick,
      getNumberWithoutCommas(locationStartInput),
      getNumberWithoutCommas(locationEndInput)
    ];

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

  const getNavIconClassName = (iconName: string) => {
    switch (iconName) {
      case BrowserNavAction.MOVE_LEFT:
        return styles.moveLeftIcon;
      case BrowserNavAction.MOVE_RIGHT:
        return styles.moveRightIcon;
      case BrowserNavAction.ZOOM_IN:
        return styles.zoomInIcon;
      case BrowserNavAction.ZOOM_OUT:
        return styles.zoomOutIcon;
    }
  };

  return (
    <section className={styles.regionForm}>
      <div className={styles.heading}>
        <p>Navigate this region</p>
      </div>
      <div className={styles.browserNavBarControls}>
        {browserNavConfig.map((item: BrowserNavItem) => (
          <BrowserNavIcon
            key={item.name}
            browserNavItem={item}
            enabled={browserNavIconStates[item.name]}
            className={getNavIconClassName(item.name)}
          />
        ))}
        <BrowserReset className={styles.browserReset} />
      </div>
      <div className={styles.coordInputs}>
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
              placeholder="Region co-ordinates..."
            />
            {regionErrorMessage ? (
              <Tooltip
                anchor={regionRef.current}
                autoAdjust={true}
                container={regionRef.current}
                position={Position.BOTTOM_LEFT}
              >
                {locationEndErrorMessage}
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

export default NavigateRegionModal;
