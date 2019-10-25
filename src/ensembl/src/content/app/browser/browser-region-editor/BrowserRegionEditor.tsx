import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Select from 'src/shared/components/select/Select';
import Input from 'src/shared/components/input/Input';
import Tooltip, { Position } from 'src/shared/components/tooltip/Tooltip';
import Overlay from 'src/shared/components/overlay/Overlay';

import { ChrLocation } from '../browserState';
import { RootState } from 'src/store';
import {
  getRegionEditorActive,
  getRegionFieldActive,
  getBrowserActiveGenomeId,
  getChrLocation
} from '../browserSelectors';
import { getGenomeKaryotype } from 'src/genome/genomeSelectors';
import {
  changeBrowserLocation,
  changeFocusObject,
  toggleRegionEditorActive
} from '../browserActions';
import { GenomeKaryotypeItem } from 'src/genome/genomeTypes';

import {
  getCommaSeparatedNumber,
  getNumberWithoutCommas
} from 'src/shared/helpers/numberFormatter';
import { validateRegion } from '../browserHelper';

import applyIcon from 'static/img/shared/apply.svg';
import clearIcon from 'static/img/shared/clear.svg';

import styles from './BrowserRegionEditor.scss';
import browserStyles from '../Browser.scss';
import browserNavBarStyles from '../browser-nav/BrowserNavBar.scss';

export type BrowserRegionEditorProps = {
  activeGenomeId: string | null;
  chrLocation: ChrLocation | null;
  genomeKaryotype: GenomeKaryotypeItem[] | null;
  isActive: boolean;
  isDisabled: boolean;
  changeBrowserLocation: (genomeId: string, chrLocation: ChrLocation) => void;
  changeFocusObject: (objectId: string) => void;
  toggleRegionEditorActive: (regionEditorActive: boolean) => void;
};

export const BrowserRegionEditor = (props: BrowserRegionEditorProps) => {
  const genomeKaryotypes = props.genomeKaryotype as GenomeKaryotypeItem[];
  const [stick, locationStart, locationEnd] = props.chrLocation as ChrLocation;

  const [stickInput, setStickInput] = useState(stick);
  const [locationStartInput, setLocationStartInput] = useState(
    getCommaSeparatedNumber(locationStart)
  );
  const [locationEndInput, setLocationEndInput] = useState(
    getCommaSeparatedNumber(locationEnd)
  );
  const [locationStartErrorMessage, setLocationStartErrorMessage] = useState<
    string | null
  >(null);
  const [locationEndErrorMessage, setLocationEndErrorMessage] = useState<
    string | null
  >(null);

  const getKaryotypeOptions = () =>
    genomeKaryotypes.map(({ name }) => ({
      value: name,
      label: name,
      isSelected: stickInput === name
    }));

  const updateStickInput = (value: string) => {
    setStickInput(value);
    updateLocationStartInput('1');

    const filteredKaryotypes = genomeKaryotypes.filter(
      ({ name }) => name === value
    );

    if (filteredKaryotypes[0]) {
      updateLocationEndInput(`${filteredKaryotypes[0].length}`);
    }
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
    const [
      region,
      locationStart,
      locationEnd
    ] = props.chrLocation as ChrLocation;
    const locationStartStr = getCommaSeparatedNumber(locationStart);
    const locationEndStr = getCommaSeparatedNumber(locationEnd);

    updateStickInput(region);
    updateLocationStartInput(locationStartStr);
    updateLocationEndInput(locationEndStr);
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
    props.changeBrowserLocation(props.activeGenomeId as string, newChrLocation);

  const resetForm = () => {
    updateErrorMessages(null, null);

    props.toggleRegionEditorActive(false);
  };

  const onValidationError = (errorMessages: any) => {
    const { startError, endError } = errorMessages;
    updateErrorMessages(startError, endError);
  };

  const onValidationSuccess = (regionId: string) => {
    resetForm();

    const newChrLocation: ChrLocation = [
      stickInput,
      getNumberWithoutCommas(locationStartInput),
      getNumberWithoutCommas(locationEndInput)
    ];

    if (stickInput === stick) {
      changeLocation(newChrLocation);
    } else {
      props.changeFocusObject(regionId);
    }
  };

  const closeForm = () => {
    updateAllInputs();
    resetForm();
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

  useEffect(() => {
    updateAllInputs();
  }, [props.chrLocation]);

  const locationStartRef = useRef<HTMLDivElement>(null);
  const locationEndRef = useRef<HTMLDivElement>(null);

  const regionEditorClassNames = classNames(styles.browserRegionEditor, {
    [browserStyles.semiOpaque]: props.isDisabled
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
      [browserNavBarStyles.browserNavBarButtonsVisible]: props.isActive
    }
  );

  return (
    <div className={regionEditorClassNames}>
      {props.isDisabled ? <Overlay /> : null}
      <form onSubmit={handleSubmit} onFocus={handleFocus}>
        <div className={styles.inputGroup}>
          <label className="show-for-large">Chr</label>
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
        <div
          className={styles.inputGroup}
          role="endInputGroup"
          ref={locationEndRef}
        >
          <label className="show-for-large">End</label>
          <Input
            type="text"
            onChange={updateLocationEndInput}
            value={locationEndInput}
            className={locationEndClassNames}
          ></Input>
          {!locationStartErrorMessage && locationEndErrorMessage ? (
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
          <button onClick={closeForm} role="closeButton">
            <img src={clearIcon} alt="Clear changes" />
          </button>
        </span>
      </form>
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
  changeBrowserLocation,
  changeFocusObject,
  toggleRegionEditorActive
};

export default connect(
  mapStateToProps,
  mpaDispatchToProps
)(BrowserRegionEditor);
