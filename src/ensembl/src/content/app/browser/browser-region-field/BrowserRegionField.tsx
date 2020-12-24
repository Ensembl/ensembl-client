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

import Input from 'src/shared/components/input/Input';
import Tooltip from 'src/shared/components/tooltip/Tooltip';

import { ChrLocation } from '../browserState';
import { RootState } from 'src/store';
import {
  changeBrowserLocation,
  changeFocusObject,
  toggleRegionFieldActive
} from '../browserActions';
import {
  getBrowserActiveGenomeId,
  getRegionFieldActive,
  getChrLocation,
  getRegionEditorActive
} from '../browserSelectors';
import {
  getChrLocationFromStr,
  validateRegion,
  RegionValidationErrors
} from '../browserHelper';

import analyticsTracking from 'src/services/analytics-service';

import applyIcon from 'static/img/shared/apply.svg';

import styles from './BrowserRegionField.scss';
import browserNavBarStyles from '../browser-nav/BrowserNavBar.scss';

export type BrowserRegionFieldProps = {
  activeGenomeId: string | null;
  chrLocation: ChrLocation | null;
  isActive: boolean;
  isGhosted: boolean;
  changeBrowserLocation: (locationData: {
    genomeId: string;
    ensObjectId: string | null;
    chrLocation: ChrLocation;
  }) => void;
  changeFocusObject: (objectId: string) => void;
  toggleRegionFieldActive: (regionFieldActive: boolean) => void;
};

export const BrowserRegionField = (props: BrowserRegionFieldProps) => {
  const { activeGenomeId, chrLocation } = props;
  const [regionFieldInput, setRegionFieldInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputGroupRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLElement>(null);

  const handleFocus = () => props.toggleRegionFieldActive(true);

  const changeRegionFieldInput = (value: string) => setRegionFieldInput(value);

  const getRegionInputWithStick = (input: string) => {
    const [stick] = chrLocation as ChrLocation;

    return input.includes(':') ? input : `${stick}:${input}`;
  };

  const resetForm = () => {
    setRegionFieldInput('');
    setErrorMessage(null);
    props.toggleRegionFieldActive(false);
  };

  const onValidationError = (errorMessages: RegionValidationErrors) => {
    const { parseError, regionError, startError, endError } = errorMessages;
    const errorMessageToBeDisplayed =
      parseError || regionError || startError || endError;
    setErrorMessage(errorMessageToBeDisplayed as string);
  };

  const onValidationSuccess = (regionId: string) => {
    resetForm();

    const [stick] = chrLocation as ChrLocation;
    const stickInput = regionFieldInput.includes(':')
      ? regionFieldInput.split(':')[0]
      : stick;

    if (stickInput === `${stick}`) {
      const newChrLocation = getChrLocationFromStr(
        getRegionInputWithStick(regionFieldInput)
      );

      props.changeBrowserLocation({
        genomeId: props.activeGenomeId as string,
        ensObjectId: null,
        chrLocation: newChrLocation
      });
    } else {
      props.changeFocusObject(regionId);
    }

    analyticsTracking.trackEvent({
      category: 'browser_navigation',
      label: 'region_field',
      action: 'change_region'
    });
  };

  const closeForm = (event: Event) => {
    if (
      inputGroupRef?.current?.contains(event.target as HTMLElement) ||
      buttonRef?.current?.contains(event.target as HTMLElement)
    ) {
      return;
    }

    resetForm();
  };

  useEffect(() => {
    document.addEventListener('click', closeForm);
    return () => document.removeEventListener('click', closeForm);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (activeGenomeId && regionFieldInput && chrLocation) {
      setErrorMessage(null);

      validateRegion({
        regionInput: getRegionInputWithStick(regionFieldInput),
        genomeId: props.activeGenomeId,
        onSuccess: onValidationSuccess,
        onError: onValidationError
      });
    }
  };

  const regionFieldClassNames = classNames(styles.browserRegionField, {
    [browserNavBarStyles.semiOpaque]: props.isGhosted
  });

  const inputClassNames = classNames(styles.inputText, {
    [browserNavBarStyles.errorText]: errorMessage
  });

  const buttonsClassNames = classNames(
    browserNavBarStyles.browserNavBarButtons,
    {
      [browserNavBarStyles.browserNavBarButtonsVisible]:
        props.isActive && regionFieldInput.length
    }
  );

  return (
    <div className={regionFieldClassNames}>
      <form onSubmit={handleSubmit} onFocus={handleFocus}>
        <span ref={inputGroupRef}>
          <label htmlFor="region-field-input-btn">Region or location</label>
          <Input
            id="region-field-input-btn"
            type="text"
            placeholder="0:1-1,000,000"
            value={regionFieldInput}
            onChange={changeRegionFieldInput}
            className={inputClassNames}
          />
        </span>
        <span className={buttonsClassNames} ref={buttonRef}>
          <button type="submit">
            <img src={applyIcon} alt="Apply changes" />
          </button>
        </span>
      </form>
      {errorMessage ? (
        <Tooltip anchor={inputGroupRef.current} autoAdjust={true}>
          {errorMessage}
        </Tooltip>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    activeGenomeId: getBrowserActiveGenomeId(state),
    chrLocation: getChrLocation(state),
    isActive: getRegionFieldActive(state),
    isGhosted: getRegionEditorActive(state)
  };
};

const mapDispatchToProps = {
  changeBrowserLocation,
  changeFocusObject,
  toggleRegionFieldActive
};

export default connect(mapStateToProps, mapDispatchToProps)(BrowserRegionField);
