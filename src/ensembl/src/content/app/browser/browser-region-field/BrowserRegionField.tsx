import React, { useState, FormEvent, useRef } from 'react';
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
  getChrLocation
} from '../browserSelectors';
import {
  getChrLocationFromStr,
  validateRegion,
  RegionValidationErrors
} from '../browserHelper';
import useOutsideClick from 'src/shared/hooks/useOutsideClick';

import applyIcon from 'static/img/shared/apply.svg';

import styles from './BrowserRegionField.scss';
import browserNavBarStyles from '../browser-nav/BrowserNavBar.scss';

export type BrowserRegionFieldProps = {
  activeGenomeId: string | null;
  chrLocation: ChrLocation | null;
  isActive: boolean;
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
  const formRef = useRef(null);

  const handleFocus = () => props.toggleRegionFieldActive(true);

  const changeRegionFieldInput = (value: string) => setRegionFieldInput(value);

  const getRegionInputWithRegion = (input: string) => {
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

    if (stickInput === stick) {
      const newChrLocation = getChrLocationFromStr(
        getRegionInputWithRegion(regionFieldInput)
      );

      props.changeBrowserLocation({
        genomeId: props.activeGenomeId as string,
        ensObjectId: null,
        chrLocation: newChrLocation
      });
    } else {
      props.changeFocusObject(regionId);
    }
  };

  const closeForm = () => resetForm();

  useOutsideClick(formRef, closeForm);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

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
    <div className={styles.browserRegionField}>
      <form onSubmit={handleSubmit} onFocus={handleFocus} ref={formRef}>
        <label className="show-for-large">Region or location</label>
        <Input
          type="text"
          placeholder="0:1-1,000,000"
          value={regionFieldInput}
          onChange={changeRegionFieldInput}
          className={inputClassNames}
        />
        <span className={buttonsClassNames}>
          <button type="submit">
            <img src={applyIcon} alt="Apply changes" />
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
    isActive: getRegionFieldActive(state)
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
