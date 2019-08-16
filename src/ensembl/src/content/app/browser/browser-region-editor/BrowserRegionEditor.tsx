import React, { useState } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Select from 'src/shared/select/Select';
import Input from 'src/shared/input/Input';

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
import browserNavStyles from '../browser-nav/BrowserNavBar.scss';

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
    // reset all inputs
    updateRegionInput(region);
    updateLocationStartInput('');
    updateLocationEndInput('');

    props.toggleBrowserRegionEditorActive(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      props.activeGenomeId &&
      regionInput &&
      locationStartInput &&
      locationEndInput
    ) {
      closeForm();

      const locationStartNum = getNumberWithoutCommas(locationStartInput);
      const locationEndNum = getNumberWithoutCommas(locationEndInput);

      props.changeBrowserLocation(props.activeGenomeId, [
        regionInput,
        locationStartNum,
        locationEndNum
      ]);
    }
  };

  const classList = classNames(styles.browserRegionEditor, {
    [browserNavStyles.opaqueArea]: props.browserRegionFieldActive
  });

  return (
    <dd className={classList}>
      <form onSubmit={handleSubmit} onFocus={handleRegionEditorFocus}>
        <label className="show-for-large">Chr</label>
        <Select
          onSelect={updateRegionInput}
          options={getKaryotypeOptions()}
        ></Select>
        <label className="show-for-large">Start</label>
        <Input
          type="text"
          onChange={updateLocationStartInput}
          onBlur={updateLocationStartInput}
          value={locationStartInput}
        ></Input>
        <label className="show-for-large">End</label>
        <Input
          type="text"
          onChange={updateLocationEndInput}
          onBlur={updateLocationEndInput}
          value={locationEndInput}
        ></Input>
        {props.browserRegionEditorActive && (
          <>
            <button type="submit">
              <img src={applyIcon} alt="Apply changes" />
            </button>
            <button onClick={closeForm}>
              <img src={clearIcon} alt="Clear changes" />
            </button>
          </>
        )}
      </form>
    </dd>
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
