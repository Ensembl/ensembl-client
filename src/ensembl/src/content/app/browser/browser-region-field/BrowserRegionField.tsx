import React, { useState, FormEvent } from 'react';
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
  getRegionEditorActive,
  getRegionFieldActive,
  getChrLocation
} from '../browserSelectors';
import { getChrLocationFromStr, validateRegion } from '../browserHelper';

import applyIcon from 'static/img/shared/apply.svg';
import clearIcon from 'static/img/shared/clear.svg';

import styles from './BrowserRegionField.scss';
import browserStyles from '../Browser.scss';
import browserNavBarStyles from '../browser-nav/BrowserNavBar.scss';

export type BrowserRegionFieldProps = {
  activeGenomeId: string | null;
  chrLocation: ChrLocation | null;
  isActive: boolean;
  isDisabled: boolean;
  changeBrowserLocation: (genomeId: string, chrLocation: ChrLocation) => void;
  changeFocusObject: (objectId: string) => void;
  toggleRegionFieldActive: (regionFieldActive: boolean) => void;
};

export const BrowserRegionField = (props: BrowserRegionFieldProps) => {
  const { activeGenomeId, chrLocation } = props;
  const [regionFieldInput, setRegionFieldInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activateForm = () => {
    if (!props.isDisabled) {
      props.toggleRegionFieldActive(true);
    }
  };

  const changeRegionFieldInput = (value: string) => setRegionFieldInput(value);

  const getRegionInputWithRegion = (input: string) => {
    const [chrCode] = chrLocation as ChrLocation;

    return input.includes(':') ? input : `${chrCode}:${input}`;
  };

  const resetForm = () => {
    setRegionFieldInput('');
    setErrorMessage(null);
    props.toggleRegionFieldActive(false);
  };

  const onValidationError = (errorMessages: any) => {
    const { regionError, startError, endError } = errorMessages;
    const errorMessageToBeDisplayed = regionError || startError || endError;
    setErrorMessage(errorMessageToBeDisplayed);
  };

  const onValidationSuccess = (regionId: string) => {
    resetForm();

    const [chrCode] = chrLocation as ChrLocation;
    const regionInput = regionFieldInput.includes(':')
      ? regionFieldInput.split(':')[0]
      : chrCode;

    if (regionInput === chrCode) {
      props.changeBrowserLocation(
        props.activeGenomeId as string,
        getChrLocationFromStr(getRegionInputWithRegion(regionFieldInput))
      );
    } else {
      props.changeFocusObject(regionId);
    }
  };

  const closeForm = () => resetForm();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (activeGenomeId && regionFieldInput && chrLocation) {
      setErrorMessage(null);

      validateRegion({
        regionInput: getRegionInputWithRegion(regionFieldInput),
        genomeId: props.activeGenomeId,
        onSuccess: onValidationSuccess,
        onError: onValidationError
      });
    }
  };

  const regionFieldClassNames = classNames(styles.browserRegionField, {
    [browserStyles.semiOpaque]: props.isDisabled
  });

  const inputClassNames = classNames(styles.inputText, {
    [browserNavBarStyles.errorText]: errorMessage
  });

  const buttonsClassNames = classNames(
    browserNavBarStyles.browserNavBarButtons,
    {
      [browserNavBarStyles.browserNavBarButtonsVisible]: props.isActive
    }
  );

  return (
    <div className={regionFieldClassNames}>
      {props.isDisabled ? (
        <div className={browserStyles.browserOverlay}></div>
      ) : null}
      <form onSubmit={handleSubmit}>
        <label className="show-for-large">Region or location</label>
        <Input
          type="text"
          placeholder="0:1-1,000,000"
          value={regionFieldInput}
          onChange={changeRegionFieldInput}
          onFocus={activateForm}
          className={inputClassNames}
        />
        <span className={buttonsClassNames}>
          <button type="submit">
            <img src={applyIcon} alt="Apply changes" />
          </button>
          <button onClick={closeForm} role="closeButton">
            <img src={clearIcon} alt="Clear changes" />
          </button>
        </span>
      </form>
      {errorMessage ? (
        <Tooltip autoAdjust={true}>{errorMessage}</Tooltip>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    activeGenomeId: getBrowserActiveGenomeId(state),
    chrLocation: getChrLocation(state),
    isActive: getRegionFieldActive(state),
    isDisabled: getRegionEditorActive(state)
  };
};

const mapDispatchToProps = {
  changeBrowserLocation,
  changeFocusObject,
  toggleRegionFieldActive
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserRegionField);
