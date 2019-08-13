import React, { useState, ChangeEvent, FormEvent } from 'react';
import { connect } from 'react-redux';

import { ChrLocation } from '../browserState';

import applyIcon from 'static/img/shared/apply.svg';
import clearIcon from 'static/img/shared/clear.svg';

import { RootState } from 'src/store';
import { toggleGenomeSelector } from '../browserActions';
import {
  getBrowserActiveGenomeId,
  getBrowserActivated,
  getChrLocation,
  getGenomeSelectorActive
} from '../browserSelectors';
import { getIsDrawerOpened } from '../drawer/drawerSelectors';

import styles from './BrowserRegionField.scss';

type BrowserRegionFieldProps = {
  activeGenomeId: string | null;
  browserActivated: boolean;
  chrLocation: ChrLocation;
  isDrawerOpened: boolean;
  genomeSelectorActive: boolean;
  dispatchBrowserLocation: (genomeId: string, chrLocation: ChrLocation) => void;
  toggleGenomeSelector: (genomeSelectorActive: boolean) => void;
};

const BrowserRegionField = (props: BrowserRegionFieldProps) => {
  const { activeGenomeId } = props;
  const [chrLocationInput, setChrLocationInput] = useState('');

  const activateForm = () => {
    if (props.genomeSelectorActive || props.isDrawerOpened) {
      return;
    }

    props.toggleGenomeSelector(true);
  };

  const changeChrLocationInput = (event: ChangeEvent<HTMLInputElement>) =>
    setChrLocationInput(event.target.value);

  const closeForm = () => {
    setChrLocationInput('');
    props.toggleGenomeSelector(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeGenomeId || !chrLocationInput) {
      return;
    }

    if (
      chrLocationInput &&
      chrLocationInput.indexOf(':') === -1 &&
      chrLocationInput.indexOf('-') === -1
    ) {
      closeForm();

      props.dispatchBrowserLocation(activeGenomeId, [chrLocationInput, 0, 0]);
    } else {
      const [chrCodeInput, chrRegionInput] = chrLocationInput.split(':');
      const [chrStartInput, chrEndInput] = chrRegionInput.split('-');

      if (chrCodeInput && +chrStartInput <= +chrEndInput) {
        const currChrLocation: ChrLocation = [
          chrCodeInput,
          +chrStartInput,
          +chrEndInput
        ];

        closeForm();

        props.dispatchBrowserLocation(activeGenomeId, currChrLocation);
      }
    }
  };

  return props.browserActivated ? (
    <dd className={styles.browserRegionField}>
      <label className="show-for-large">Region or location</label>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="0:1-1,000,000"
          value={chrLocationInput}
          onClick={activateForm}
          onChange={changeChrLocationInput}
        />
        {props.genomeSelectorActive && (
          <>
            <button>
              <img src={applyIcon} alt="Apply changes" />
            </button>
            <button onClick={closeForm}>
              <img src={clearIcon} alt="Clear changes" />
            </button>
          </>
        )}
      </form>
    </dd>
  ) : null;
};

const mapStateToProps = (state: RootState) => ({
  activeGenomeId: getBrowserActiveGenomeId(state),
  browserActivated: getBrowserActivated(state),
  chrLocation: getChrLocation(state) as ChrLocation,
  isDrawerOpened: getIsDrawerOpened(state),
  genomeSelectorActive: getGenomeSelectorActive(state)
});

const mapDispatchToProps = {
  toggleGenomeSelector
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserRegionField);
