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

import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Select from 'src/shared/components/select/Select';
import Input from 'src/shared/components/input/Input';
import Tooltip from 'src/shared/components/tooltip/Tooltip';
import Overlay from 'src/shared/components/overlay/Overlay';

import { ChrLocation } from '../browserState';
import { RootState } from 'src/store';
import {
  getRegionEditorActive,
  getBrowserActiveGenomeId,
  getChrLocation,
  getRegionFieldActive
} from '../browserSelectors';
import { getGenomeKaryotype } from 'src/shared/state/genome/genomeSelectors';
import { toggleRegionEditorActive } from '../browserActions';
import { GenomeKaryotypeItem } from 'src/shared/state/genome/genomeTypes';
import { Position } from 'src/shared/components/pointer-box/PointerBox';

import {
  getCommaSeparatedNumber,
  getNumberWithoutCommas
} from 'src/shared/helpers/formatters/numberFormatter';
import { validateRegion, RegionValidationErrors } from '../browserHelper';

import analyticsTracking from 'src/services/analytics-service';

import applyIcon from 'static/img/shared/apply.svg';

import styles from './BrowserRegionEditor.scss';
import browserNavBarStyles from '../browser-nav/BrowserNavBar.scss';
import useOutsideClick from 'src/shared/hooks/useOutsideClick';
import useGenomeBrowser from 'src/content/app/browser/hooks/useGenomeBrowser';

export type BrowserRegionEditorProps = {
  activeGenomeId: string | null;
  chrLocation: ChrLocation | null;
  genomeKaryotype: GenomeKaryotypeItem[] | null;
  isActive: boolean;
  isDisabled: boolean;
  toggleRegionEditorActive: (regionEditorActive: boolean) => void;
};

export const BrowserRegionEditor = (props: BrowserRegionEditorProps) => {
  const genomeKaryotype = props.genomeKaryotype as GenomeKaryotypeItem[];
  const [stick, locationStart, locationEnd] = props.chrLocation as ChrLocation;
  const [stickInput, setStickInput] = useState(stick);
  const [locationStartInput, setLocationStartInput] = useState(
    getCommaSeparatedNumber(locationStart)
  );
  const [locationEndInput, setLocationEndInput] = useState(
    getCommaSeparatedNumber(locationEnd)
  );

  const [shouldShowSubmitButton, showSubmitButton] = useState(false);
  const { changeFocusObject, changeBrowserLocation } = useGenomeBrowser();

  useEffect(() => {
    const shouldShowButton =
      stickInput !== stick ||
      getNumberWithoutCommas(locationStartInput) !== locationStart ||
      getNumberWithoutCommas(locationEndInput) !== locationEnd;
    showSubmitButton(shouldShowButton);
  }, [stick, stickInput, locationStartInput, locationEndInput]);

  const stickRef = useRef<HTMLDivElement>(null);
  const locationStartRef = useRef<HTMLDivElement>(null);
  const locationEndRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLSpanElement>(null);

  const closeForm = () => {
    updateAllInputs();
    hideForm();
  };

  useOutsideClick(
    [stickRef, locationStartRef, locationEndRef, buttonRef],
    closeForm
  );

  useEffect(() => {
    updateAllInputs();
  }, [props.chrLocation]);

  const [locationStartErrorMessage, setLocationStartErrorMessage] =
    useState<string | null>(null);
  const [locationEndErrorMessage, setLocationEndErrorMessage] =
    useState<string | null>(null);

  const getKaryotypeOptions = () =>
    genomeKaryotype.map(({ name }) => ({
      value: name,
      label: name,
      isSelected: stickInput === name
    }));

  const updateStickInput = (value: string) => {
    const selectedKaryotypeItems = genomeKaryotype.filter(
      ({ name }) => name === value
    );

    if (selectedKaryotypeItems[0]) {
      setStickInput(value);
      setLocationStartInput('1');
      setLocationEndInput(`${selectedKaryotypeItems[0].length}`);
    }
  };
  const updateAllInputs = () => {
    const locationStartStr = getCommaSeparatedNumber(locationStart);
    const locationEndStr = getCommaSeparatedNumber(locationEnd);

    setStickInput(stick);
    setLocationStartInput(locationStartStr);
    setLocationEndInput(locationEndStr);
  };

  const updateErrorMessages = (
    locationStartError: string | null,
    locationEndError: string | null
  ) => {
    setLocationStartErrorMessage(locationStartError);
    setLocationEndErrorMessage(locationEndError);
  };

  const handleFocus = () => {
    if (!props.isDisabled) {
      props.toggleRegionEditorActive(true);
    }
  };

  const changeLocation = (newChrLocation: ChrLocation) =>
    changeBrowserLocation({
      genomeId: props.activeGenomeId as string,
      ensObjectId: null,
      chrLocation: newChrLocation
    });

  const hideForm = () => {
    updateErrorMessages(null, null);
    props.toggleRegionEditorActive(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    validateRegion({
      regionInput: `${stickInput}:${locationStartInput}-${locationEndInput}`,
      genomeId: props.activeGenomeId,
      onSuccess: onValidationSuccess,
      onError: onValidationError
    });
  };

  const onValidationError = (errorMessages: RegionValidationErrors) => {
    const { startError = null, endError = null } = errorMessages;
    updateErrorMessages(startError, endError);
  };

  const onValidationSuccess = (regionId: string) => {
    hideForm();

    const newChrLocation: ChrLocation = [
      stickInput,
      getNumberWithoutCommas(locationStartInput),
      getNumberWithoutCommas(locationEndInput)
    ];

    if (stickInput === stick) {
      changeLocation(newChrLocation);
    } else {
      changeFocusObject(regionId);
    }

    analyticsTracking.trackEvent({
      category: 'browser_navigation',
      label: 'region_editor',
      action: 'change_region'
    });
  };

  const locationStartClassNames = classNames({
    [browserNavBarStyles.errorText]: locationStartErrorMessage
  });

  const locationEndClassNames = classNames({
    [browserNavBarStyles.errorText]: locationEndErrorMessage
  });

  const buttonsClassNames = classNames(styles.submitButton, {
    [styles.submitButtonVisible]: shouldShowSubmitButton
  });

  return (
    <div className={styles.browserRegionEditor}>
      <form onSubmit={handleSubmit} onFocus={handleFocus}>
        <div className={styles.inputGroup} ref={stickRef}>
          <label>Chr</label>
          <Select
            onSelect={updateStickInput}
            options={getKaryotypeOptions()}
          ></Select>
        </div>
        <div
          className={styles.inputGroup}
          role="startInputGroup"
          ref={locationStartRef}
        >
          <label htmlFor="region-editor-start">Start</label>
          <Input
            id="region-editor-start"
            type="text"
            onChange={setLocationStartInput}
            value={locationStartInput}
            className={locationStartClassNames}
          ></Input>
          {locationStartErrorMessage ? (
            <Tooltip
              anchor={locationStartRef.current}
              autoAdjust={true}
              container={locationStartRef.current}
              position={Position.BOTTOM_RIGHT}
            >
              {locationStartErrorMessage}
            </Tooltip>
          ) : null}
        </div>
        <div
          className={styles.inputGroup}
          role="endInputGroup"
          ref={locationEndRef}
        >
          <label htmlFor="region-editor-end">End</label>
          <Input
            id="region-editor-end"
            type="text"
            onChange={setLocationEndInput}
            value={locationEndInput}
            className={locationEndClassNames}
          ></Input>
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
        <span className={buttonsClassNames} ref={buttonRef}>
          <button type="submit">
            <img src={applyIcon} alt="Apply changes" />
          </button>
        </span>
      </form>
      {props.isDisabled && <Overlay className={styles.overlay} />}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    activeGenomeId: getBrowserActiveGenomeId(state),
    chrLocation: getChrLocation(state),
    genomeKaryotype: getGenomeKaryotype(state),
    isActive: getRegionEditorActive(state),
    isDisabled: getRegionFieldActive(state)
  };
};

const mpaDispatchToProps = {
  toggleRegionEditorActive
};

export default connect(
  mapStateToProps,
  mpaDispatchToProps
)(BrowserRegionEditor);
