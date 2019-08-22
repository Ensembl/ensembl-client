import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Select from 'src/shared/select/Select';
import Input from 'src/shared/input/Input';
import Tooltip, { Position } from 'src/shared/tooltip/Tooltip';

import { ChrLocation } from '../browserState';
import { RootState } from 'src/store';
import {
  getActualChrLocation,
  getBrowserRegionEditorActive,
  getBrowserRegionFieldActive,
  getBrowserActiveGenomeId
} from '../browserSelectors';
import { getGenomeKaryotypes } from 'src/genome/genomeSelectors';
import {
  changeBrowserLocation,
  toggleBrowserRegionEditorActive
} from '../browserActions';
import { GenomeKaryotype } from 'src/genome/genomeTypes';

import {
  getCommaSeparatedNumber,
  getNumberWithoutCommas
} from 'src/shared/helpers/numberFormatter';

import applyIcon from 'static/img/shared/apply.svg';
import clearIcon from 'static/img/shared/clear.svg';

import styles from './BrowserRegionEditor.scss';
import browserStyles from '../Browser.scss';
import browserNavBarStyles from '../browser-nav/BrowserNavBar.scss';
import { getBrowserRegionEditorErrorMessages } from '../browserHelper';

type BrowserRegionEditorProps = {
  activeGenomeId: string | null;
  browserRegionEditorActive: boolean;
  browserRegionFieldActive: boolean;
  actualChrLocation: ChrLocation;
  genomeKaryotypes: GenomeKaryotype[];
  changeBrowserLocation: (genomeId: string, chrLocation: ChrLocation) => void;
  toggleBrowserRegionEditorActive: (browserRegionEditorActive: boolean) => void;
};

export const BrowserRegionEditor = (props: BrowserRegionEditorProps) => {
  const [region, locationStart, locationEnd] = props.actualChrLocation;

  const [regionInput, setRegionInput] = useState(region);
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
    props.genomeKaryotypes.map(({ name }) => ({
      value: name,
      label: name,
      isSelected: regionInput === name
    }));

  const updateRegionInput = (value: any) => {
    setRegionInput(value);
    updateLocationStartInput('1');

    const karyotypeLength = props.genomeKaryotypes.filter(
      ({ name }) => name === value
    )[0].length;

    updateLocationEndInput(karyotypeLength.toString());
  };

  const updateLocationStartInput = (value: string | undefined) => {
    const unformattedValue = value
      ? getNumberWithoutCommas(value)
      : locationStart;
    const formattedValue = getCommaSeparatedNumber(unformattedValue);

    setLocationStartInput(formattedValue);
  };

  const updateLocationEndInput = (value: string | undefined) => {
    const unformattedValue = value
      ? getNumberWithoutCommas(value)
      : locationEnd;
    const formattedValue = getCommaSeparatedNumber(unformattedValue);

    setLocationEndInput(formattedValue);
  };

  const handleRegionEditorFocus = () =>
    props.toggleBrowserRegionEditorActive(true);

  const closeForm = () => {
    updateRegionInput(region);
    updateLocationStartInput('');
    updateLocationEndInput('');
    updateErrorMessages(null, null);

    props.toggleBrowserRegionEditorActive(false);
  };

  const updateErrorMessages = (
    locationStartError: string | null,
    locationEndError: string | null
  ) => {
    setLocationStartErrorMessage(locationStartError);
    setLocationEndErrorMessage(locationEndError);
  };

  const validateRegionEditor = () => {
    const karyotypeOfSelectedRegion = props.genomeKaryotypes.filter(
      (karyotype) => regionInput === karyotype.name
    )[0];

    const {
      locationStartError,
      locationEndError
    } = getBrowserRegionEditorErrorMessages(
      locationStartInput,
      locationEndInput,
      karyotypeOfSelectedRegion
    );

    if (locationStartError || locationEndError) {
      updateErrorMessages(locationStartError, locationEndError);
      return false;
    }

    return true;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isFormValid = validateRegionEditor();

    if (isFormValid) {
      closeForm();

      const locationStartNum = getNumberWithoutCommas(locationStartInput);
      const locationEndNum = getNumberWithoutCommas(locationEndInput);

      props.changeBrowserLocation(props.activeGenomeId as string, [
        regionInput,
        locationStartNum,
        locationEndNum
      ]);
    }
  };

  useEffect(
    () => () => {
      closeForm();
    },
    []
  );

  const locationStartRef = useRef<HTMLDivElement>(null);
  const locationEndRef = useRef<HTMLDivElement>(null);

  const regionEditorClassNames = classNames(styles.browserRegionEditor, {
    [browserStyles.semiOpaque]: props.browserRegionFieldActive
  });

  const buttonsClassNames = classNames(
    browserNavBarStyles.browserNavBarButtons,
    {
      [browserNavBarStyles.browserNavBarButtonsVisible]:
        props.browserRegionEditorActive
    }
  );

  return (
    <div className={regionEditorClassNames}>
      {props.browserRegionFieldActive ? (
        <div className={browserStyles.browserOverlay}></div>
      ) : null}
      <form onSubmit={handleSubmit} onFocus={handleRegionEditorFocus}>
        <div className={styles.inputGroup}>
          <label className="show-for-large">Chr</label>
          <Select
            onSelect={updateRegionInput}
            options={getKaryotypeOptions()}
          ></Select>
        </div>
        <div className={styles.inputGroup} ref={locationStartRef}>
          <label className="show-for-large">Start</label>
          <Input
            type="text"
            onChange={updateLocationStartInput}
            value={locationStartInput}
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
          <button onClick={closeForm}>
            <img src={clearIcon} alt="Clear changes" />
          </button>
        </span>
      </form>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  activeGenomeId: getBrowserActiveGenomeId(state),
  browserRegionEditorActive: getBrowserRegionEditorActive(state),
  browserRegionFieldActive: getBrowserRegionFieldActive(state),
  actualChrLocation: getActualChrLocation(state) as ChrLocation,
  genomeKaryotypes: getGenomeKaryotypes(state) as GenomeKaryotype[]
});

const mpaDispatchToProps = {
  changeBrowserLocation,
  toggleBrowserRegionEditorActive
};

export default connect(
  mapStateToProps,
  mpaDispatchToProps
)(BrowserRegionEditor);
