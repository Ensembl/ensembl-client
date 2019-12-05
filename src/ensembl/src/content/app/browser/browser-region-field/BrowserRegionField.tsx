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

import applyIcon from 'static/img/shared/apply.svg';

import styles from './BrowserRegionField.scss';
import browserNavBarStyles from '../browser-nav/BrowserNavBar.scss';

export type BrowserRegionFieldProps = {
  activeGenomeId: string | null;
  chrLocation: ChrLocation | null;
  isActive: boolean;
  shouldBeOpaque: boolean;
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

  const closeForm = (event: Event) => {
    if (
      !inputGroupRef.current ||
      !buttonRef.current ||
      inputGroupRef.current.contains(event.target as HTMLElement) ||
      buttonRef.current.contains(event.target as HTMLElement)
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
        regionInput: getRegionInputWithRegion(regionFieldInput),
        genomeId: props.activeGenomeId,
        onSuccess: onValidationSuccess,
        onError: onValidationError
      });
    }
  };

  const regionFieldClassNames = classNames(styles.browserRegionField, {
    [browserNavBarStyles.semiOpaque]: props.shouldBeOpaque
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
    shouldBeOpaque: getRegionEditorActive(state)
  };
};

const mapDispatchToProps = {
  changeBrowserLocation,
  changeFocusObject,
  toggleRegionFieldActive
};

export default connect(mapStateToProps, mapDispatchToProps)(BrowserRegionField);
