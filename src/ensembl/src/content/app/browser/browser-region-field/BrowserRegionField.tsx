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
import { getIsDrawerOpened } from '../drawer/drawerSelectors';
import { GenomeKaryotype } from 'src/genome/genomeTypes';
import {
  getChrLocationFromStr,
  getRegionFieldErrorMessages
} from '../browserHelper';
import * as urlFor from 'src/shared/helpers/urlHelper';

import { getGenomeKaryotypes } from 'src/genome/genomeSelectors';
import { LoadingState } from 'src/shared/types/loading-state';

import applyIcon from 'static/img/shared/apply.svg';
import clearIcon from 'static/img/shared/clear.svg';

import styles from './BrowserRegionField.scss';
import browserStyles from '../Browser.scss';
import browserNavBarStyles from '../browser-nav/BrowserNavBar.scss';

type BrowserRegionFieldProps = {
  activeGenomeId: string | null;
  chrLocation: ChrLocation;
  genomeKaryotypes: GenomeKaryotype[] | null;
  isDrawerOpened: boolean;
  regionEditorActive: boolean;
  regionFieldActive: boolean;
  regionValidationInfo: RegionValidationResponse | null;
  regionValidationLoadingStatus: LoadingState;
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
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const activateForm = () => {
    if (!props.regionFieldActive && !props.isDrawerOpened) {
      props.toggleRegionFieldActive(true);
    }
  };

  const changeRegionFieldInput = (value: string) => setRegionFieldInput(value);

  const getRegionInputWithRegion = (input: string) => {
    const [region, ,] = props.chrLocation;

    return input.includes(':') ? input : `${region}:${input}`;
  };

  const closeForm = () => {
    setRegionFieldInput('');
    setIsFormSubmitted(false);
    setErrorMessages(null);

    props.toggleRegionFieldActive(false);
    props.resetRegionValidation();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (activeGenomeId && regionFieldInput && props.chrLocation) {
      setIsFormSubmitted(true);
      props.validateRegion(getRegionInputWithRegion(regionFieldInput));
    }
  };

  const changeLocation = (inputValue: string) => {
    if (!isFormSubmitted) {
      return;
    }

    props.changeBrowserLocation(
      props.activeGenomeId as string,
      getChrLocationFromStr(getRegionInputWithRegion(inputValue))
    );
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

  const updateBrowser = () => {
    if (!isFormSubmitted) {
      return;
    }

    const [region, ,] = props.chrLocation;
    const regionInput = regionFieldInput.includes(':')
      ? regionFieldInput.split(':')[0]
      : region;

    if (regionInput === region) {
      changeLocation(regionFieldInput);
    } else {
      changeFocusObject(regionFieldInput);
    }
  };

  useEffect(() => () => props.resetRegionValidation(), []);

  useEffect(() => {
    if (props.regionFieldActive) {
      const {
        regionValidationInfo,
        regionValidationLoadingStatus,
        genomeKaryotypes
      } = props;

      if (regionValidationLoadingStatus !== LoadingState.LOADING) {
        const errorMessages = getRegionFieldErrorMessages(
          regionValidationInfo,
          genomeKaryotypes
        );

        if (errorMessages) {
          setErrorMessages(errorMessages);
        } else {
          setRegionFieldInput('');
          setErrorMessages(null);
          setIsFormSubmitted(false);
          props.toggleRegionFieldActive(false);

          updateBrowser();
        }
      }
    }
  }, [props.regionValidationInfo]);

  const regionFieldClassNames = classNames(styles.browserRegionField, {
    [browserStyles.semiOpaque]: props.regionEditorActive
  });

  const inputClassNames = classNames(browserNavBarStyles.inputText, {
    [browserNavBarStyles.errorText]: errorMessages
  });

  const buttonsClassNames = classNames(
    browserNavBarStyles.browserNavBarButtons,
    {
      [browserNavBarStyles.browserNavBarButtonsVisible]: props.regionFieldActive
    }
  );

  return (
    <div className={regionFieldClassNames}>
      {props.regionEditorActive ? (
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
          <button onClick={closeForm} className="closeButton">
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

const mapStateToProps = (state: RootState) => ({
  activeGenomeId: getBrowserActiveGenomeId(state),
  regionEditorActive: getRegionEditorActive(state),
  regionFieldActive: getRegionFieldActive(state),
  regionValidationInfo: getRegionValidationInfo(state),
  regionValidationLoadingStatus: getRegionValidationLoadingStatus(state),
  chrLocation: getChrLocation(state) as ChrLocation,
  genomeKaryotypes: getGenomeKaryotypes(state),
  isDrawerOpened: getIsDrawerOpened(state)
});

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
