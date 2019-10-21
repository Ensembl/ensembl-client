import React, { useState, FormEvent, useEffect } from 'react';
import { replace, Replace } from 'connected-react-router';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Input from 'src/shared/components/input/Input';
import Tooltip from 'src/shared/components/tooltip/Tooltip';

import { ChrLocation, RegionValidationResponse } from '../browserState';
import { RootState } from 'src/store';
import {
  changeBrowserLocation,
  resetRegionValidation,
  toggleRegionFieldActive,
  validateRegion
} from '../browserActions';
import {
  getBrowserActiveGenomeId,
  getRegionEditorActive,
  getRegionFieldActive,
  getRegionValidationInfo,
  getRegionValidationLoadingStatus,
  getChrLocation
} from '../browserSelectors';
import {
  getChrLocationFromStr,
  getRegionFieldErrorMessages
} from '../browserHelper';
import * as urlFor from 'src/shared/helpers/urlHelper';

import { LoadingState } from 'src/shared/types/loading-state';

import applyIcon from 'static/img/shared/apply.svg';
import clearIcon from 'static/img/shared/clear.svg';

import styles from './BrowserRegionField.scss';
import browserStyles from '../Browser.scss';
import browserNavBarStyles from '../browser-nav/BrowserNavBar.scss';

export type BrowserRegionFieldProps = {
  activeGenomeId: string | null;
  chrLocation: ChrLocation;
  isActive: boolean;
  isDisabled: boolean;
  isValidationInfoLoading: boolean;
  validationInfo: RegionValidationResponse | null;
  changeBrowserLocation: (genomeId: string, chrLocation: ChrLocation) => void;
  replace: Replace;
  resetRegionValidation: () => void;
  toggleRegionFieldActive: (regionFieldActive: boolean) => void;
  validateRegion: (region: string) => void;
};

export const BrowserRegionField = (props: BrowserRegionFieldProps) => {
  const { activeGenomeId } = props;
  const [regionFieldInput, setRegionFieldInput] = useState('');
  const [errorMessages, setErrorMessages] = useState<string | null>(null);

  const activateForm = () => {
    if (!props.isDisabled) {
      props.toggleRegionFieldActive(true);
    }
  };

  const changeRegionFieldInput = (value: string) => setRegionFieldInput(value);

  const getRegionInputWithRegion = (input: string) => {
    const [chrCode] = props.chrLocation;

    return input.includes(':') ? input : `${chrCode}:${input}`;
  };

  const closeForm = () => {
    setRegionFieldInput('');
    setErrorMessages(null);

    props.toggleRegionFieldActive(false);
    props.resetRegionValidation();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (activeGenomeId && regionFieldInput && props.chrLocation) {
      props.validateRegion(getRegionInputWithRegion(regionFieldInput));
    }
  };

  const changeFocusObject = (inputValue: string) => {
    const activeEnsObjectId = `${
      props.activeGenomeId
    }:region:${getRegionInputWithRegion(inputValue)}`;

    const params = {
      genomeId: props.activeGenomeId,
      focus: activeEnsObjectId,
      location: getRegionInputWithRegion(inputValue)
    };

    props.replace(urlFor.browser(params));
  };

  const resetForm = () => {
    setRegionFieldInput('');
    setErrorMessages(null);
    props.toggleRegionFieldActive(false);
  };

  const updateBrowser = () => {
    const [chrCode] = props.chrLocation;
    const regionInput = regionFieldInput.includes(':')
      ? regionFieldInput.split(':')[0]
      : chrCode;

    if (regionInput === chrCode) {
      props.changeBrowserLocation(
        props.activeGenomeId as string,
        getChrLocationFromStr(getRegionInputWithRegion(regionFieldInput))
      );
    } else {
      changeFocusObject(regionFieldInput);
    }
  };

  useEffect(() => () => props.resetRegionValidation(), []);

  useEffect(() => {
    if (props.isActive) {
      const { validationInfo, isValidationInfoLoading } = props;

      if (!isValidationInfoLoading) {
        const errorMessages = getRegionFieldErrorMessages(validationInfo);

        if (errorMessages) {
          setErrorMessages(errorMessages);
        } else {
          resetForm();
          updateBrowser();
        }
      }
    }
  }, [props.validationInfo]);

  const regionFieldClassNames = classNames(styles.browserRegionField, {
    [browserStyles.semiOpaque]: props.isDisabled
  });

  const inputClassNames = classNames(styles.inputText, {
    [browserNavBarStyles.errorText]: errorMessages
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
      {errorMessages ? (
        <Tooltip autoAdjust={true}>{errorMessages}</Tooltip>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    activeGenomeId: getBrowserActiveGenomeId(state),
    chrLocation: getChrLocation(state) as ChrLocation,
    isActive: getRegionFieldActive(state),
    isDisabled: getRegionEditorActive(state),
    isValidationInfoLoading:
      getRegionValidationLoadingStatus(state) === LoadingState.LOADING,
    validationInfo: getRegionValidationInfo(state)
  };
};

const mapDispatchToProps = {
  changeBrowserLocation,
  replace,
  resetRegionValidation,
  toggleRegionFieldActive,
  validateRegion
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserRegionField);
