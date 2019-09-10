import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { replace, Replace } from 'connected-react-router';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Select from 'src/shared/components/select/Select';
import Input from 'src/shared/components/input/Input';
import Tooltip, { Position } from 'src/shared/components/tooltip/Tooltip';

import { ChrLocation, RegionValidationResponse } from '../browserState';
import { RootState } from 'src/store';
import {
  getRegionEditorActive,
  getRegionFieldActive,
  getBrowserActiveGenomeId,
  getChrLocation,
  getRegionValidationInfo,
  getRegionValidationLoadingStatus
} from '../browserSelectors';
import { getGenomeKaryotypes } from 'src/genome/genomeSelectors';
import {
  changeBrowserLocation,
  toggleRegionEditorActive,
  resetRegionValidation,
  validateRegion
} from '../browserActions';
import { GenomeKaryotype } from 'src/genome/genomeTypes';
import { LoadingState } from 'src/shared/types/loading-state';

import {
  getCommaSeparatedNumber,
  getNumberWithoutCommas
} from 'src/shared/helpers/numberFormatter';
import {
  getRegionEditorErrorMessages,
  getChrLocationStr
} from '../browserHelper';
import * as urlFor from 'src/shared/helpers/urlHelper';

import applyIcon from 'static/img/shared/apply.svg';
import clearIcon from 'static/img/shared/clear.svg';

import styles from './BrowserRegionEditor.scss';
import browserStyles from '../Browser.scss';
import browserNavBarStyles from '../browser-nav/BrowserNavBar.scss';

type BrowserRegionEditorProps = {
  activeGenomeId: string | null;
  chrLocation: ChrLocation;
  genomeKaryotypes: GenomeKaryotype[];
  regionEditorActive: boolean;
  regionFieldActive: boolean;
  regionValidationInfo: RegionValidationResponse | null;
  regionValidationLoadingStatus: LoadingState;
  changeBrowserLocation: (genomeId: string, chrLocation: ChrLocation) => void;
  replace: Replace;
  resetRegionValidation: () => void;
  toggleRegionEditorActive: (regionEditorActive: boolean) => void;
  validateRegion: (region: string) => void;
};

export const BrowserRegionEditor = (props: BrowserRegionEditorProps) => {
  const [region, locationStart, locationEnd] = props.chrLocation;

  const [regionInput, setRegionInput] = useState(region);
  const [locationStartInput, setLocationStartInput] = useState(
    getCommaSeparatedNumber(locationStart)
  );
  const [locationEndInput, setLocationEndInput] = useState(
    getCommaSeparatedNumber(locationEnd)
  );
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [locationStartErrorMessage, setLocationStartErrorMessage] = useState<
    string | null
  >(null);
  const [locationEndErrorMessage, setLocationEndErrorMessage] = useState<
    string | null
  >(null);

  const getKaryotypeOptions = () =>
    props.genomeKaryotypes.map(({ name }) => ({
      value: name,
      label: name,
      isSelected: regionInput === name
    }));

  const updateRegionInput = (value: string) => {
    setRegionInput(value);
    updateLocationStartInput('1');

    const karyotypeLength = props.genomeKaryotypes.filter(
      ({ name }) => name === value
    )[0].length;

    updateLocationEndInput(karyotypeLength.toString());
  };

  const getUnformattedValue = (value: string) =>
    getNumberWithoutCommas(value) || value;

  const getFormattedValue = (value: string | number) =>
    typeof value === 'number' ? getCommaSeparatedNumber(value) : value;

  const updateLocationStartInput = (value: string) => {
    const unformattedValue = getUnformattedValue(value);
    const formattedValue = getFormattedValue(unformattedValue);

    setLocationStartInput(formattedValue);
  };

  const updateLocationEndInput = (value: string) => {
    const unformattedValue = getUnformattedValue(value);
    const formattedValue = getFormattedValue(unformattedValue);

    setLocationEndInput(formattedValue);
  };

  const updateAllInputs = () => {
    const [region, locationStart, locationEnd] = props.chrLocation;
    const locationStartStr = getCommaSeparatedNumber(locationStart);
    const locationEndStr = getCommaSeparatedNumber(locationEnd);

    updateRegionInput(region);
    updateLocationStartInput(locationStartStr);
    updateLocationEndInput(locationEndStr);
  };

  const closeForm = () => {
    updateAllInputs();
    setIsFormSubmitted(false);
    updateErrorMessages(null, null);

    props.toggleRegionEditorActive(false);
    props.resetRegionValidation();
  };

  const updateErrorMessages = (
    locationStartError: string | null,
    locationEndError: string | null
  ) => {
    setLocationStartErrorMessage(locationStartError);
    setLocationEndErrorMessage(locationEndError);
  };

  const handleFocus = () => {
    if (!props.regionEditorActive) {
      props.toggleRegionEditorActive(true);
    }
  };

  const changeLocation = (newChrLocation: ChrLocation) =>
    props.changeBrowserLocation(props.activeGenomeId as string, newChrLocation);

  const changeFocusObject = (newChrLocation: ChrLocation) => {
    const chrLocationStr = getChrLocationStr(newChrLocation);
    const activeEnsObjectId = `${props.activeGenomeId}:region:${chrLocationStr}`;
    const params = {
      genomeId: props.activeGenomeId,
      focus: activeEnsObjectId,
      location: chrLocationStr
    };

    props.replace(urlFor.browser(params));
  };

  const updateBrowser = () => {
    if (!isFormSubmitted) {
      return;
    }

    const newChrLocation: ChrLocation = [
      regionInput,
      getNumberWithoutCommas(locationStartInput),
      getNumberWithoutCommas(locationEndInput)
    ];

    if (regionInput === region) {
      changeLocation(newChrLocation);
    } else {
      changeFocusObject(newChrLocation);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const region = `${regionInput}:${locationStartInput}:${locationEndInput}`;

    setIsFormSubmitted(true);
    props.validateRegion(region);
  };

  useEffect(() => {
    updateAllInputs();
  }, [props.chrLocation]);

  useEffect(() => () => props.resetRegionValidation(), []);

  useEffect(() => {
    if (props.regionEditorActive) {
      const {
        regionValidationInfo,
        regionValidationLoadingStatus,
        genomeKaryotypes
      } = props;

      if (regionValidationLoadingStatus !== LoadingState.LOADING) {
        const karyotypeOfRegionInput = genomeKaryotypes.filter(
          (karyotype) => regionInput === karyotype.name
        )[0];

        const errorMessages = getRegionEditorErrorMessages(
          regionValidationInfo,
          karyotypeOfRegionInput,
          locationStartInput,
          locationEndInput
        );

        if (
          errorMessages &&
          (errorMessages.locationStartError || errorMessages.locationEndError)
        ) {
          updateErrorMessages(
            errorMessages.locationStartError,
            errorMessages.locationEndError
          );
        } else {
          updateAllInputs();
          setIsFormSubmitted(false);
          updateErrorMessages(null, null);
          props.toggleRegionEditorActive(false);

          updateBrowser();
        }
      }
    }
  }, [props.regionValidationInfo]);

  const locationStartRef = useRef<HTMLDivElement>(null);
  const locationEndRef = useRef<HTMLDivElement>(null);

  const regionEditorClassNames = classNames(styles.browserRegionEditor, {
    [browserStyles.semiOpaque]: props.regionFieldActive
  });

  const locationStartClassNames = classNames({
    [browserNavBarStyles.errorText]: locationStartErrorMessage
  });

  const locationEndClassNames = classNames({
    [browserNavBarStyles.errorText]: locationEndErrorMessage
  });

  const buttonsClassNames = classNames(
    browserNavBarStyles.browserNavBarButtons,
    {
      [browserNavBarStyles.browserNavBarButtonsVisible]:
        props.regionEditorActive
    }
  );

  return (
    <div className={regionEditorClassNames}>
      {props.regionFieldActive ? (
        <div
          className={browserStyles.browserOverlay}
          id="region-field-overlay"
        ></div>
      ) : null}
      <form onSubmit={handleSubmit} onFocus={handleFocus}>
        <div className={styles.inputGroup}>
          <label className="show-for-large">Chr</label>
          <Select
            onSelect={updateRegionInput}
            options={getKaryotypeOptions()}
          ></Select>
        </div>
        <div
          className={styles.inputGroup}
          ref={locationStartRef}
          id="location-start-input"
        >
          <label className="show-for-large">Start</label>
          <Input
            type="text"
            onChange={updateLocationStartInput}
            value={locationStartInput}
            className={locationStartClassNames}
          ></Input>
          {locationStartErrorMessage ? (
            <Tooltip
              autoAdjust={true}
              container={locationStartRef.current}
              position={Position.BOTTOM_RIGHT}
            >
              {locationStartErrorMessage}
            </Tooltip>
          ) : null}
        </div>
        <div className={styles.inputGroup} ref={locationEndRef}>
          <label className="show-for-large">End</label>
          <Input
            type="text"
            onChange={updateLocationEndInput}
            value={locationEndInput}
            className={locationEndClassNames}
          ></Input>
          {locationEndErrorMessage ? (
            <Tooltip
              autoAdjust={true}
              container={locationEndRef.current}
              position={Position.BOTTOM_LEFT}
            >
              {locationEndErrorMessage}
            </Tooltip>
          ) : null}
        </div>
        <span className={buttonsClassNames}>
          <button type="submit">
            <img src={applyIcon} alt="Apply changes" />
          </button>
          <button onClick={closeForm} id="close-button">
            <img src={clearIcon} alt="Clear changes" />
          </button>
        </span>
      </form>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  activeGenomeId: getBrowserActiveGenomeId(state),
  chrLocation: getChrLocation(state) as ChrLocation,
  genomeKaryotypes: getGenomeKaryotypes(state) as GenomeKaryotype[],
  regionEditorActive: getRegionEditorActive(state),
  regionFieldActive: getRegionFieldActive(state),
  regionValidationInfo: getRegionValidationInfo(state),
  regionValidationLoadingStatus: getRegionValidationLoadingStatus(state)
});

const mpaDispatchToProps = {
  changeBrowserLocation,
  replace,
  resetRegionValidation,
  toggleRegionEditorActive,
  validateRegion
};

export default connect(
  mapStateToProps,
  mpaDispatchToProps
)(BrowserRegionEditor);
