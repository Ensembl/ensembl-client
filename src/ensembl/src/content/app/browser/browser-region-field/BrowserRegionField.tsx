import React, { useState, FormEvent } from 'react';
import { connect } from 'react-redux';

import { ChrLocation } from '../browserState';

import applyIcon from 'static/img/shared/apply.svg';
import clearIcon from 'static/img/shared/clear.svg';

import { RootState } from 'src/store';
import { toggleBrowserRegionEditorActive } from '../browserActions';
import {
  getBrowserActiveGenomeId,
  getBrowserActivated,
  getChrLocation,
  getBrowserRegionEditorActive
} from '../browserSelectors';
import { getIsDrawerOpened } from '../drawer/drawerSelectors';

import styles from './BrowserRegionField.scss';
import Input from 'src/shared/input/Input';

type BrowserRegionFieldProps = {
  activeGenomeId: string | null;
  browserActivated: boolean;
  browserRegionEditorActive: boolean;
  chrLocation: ChrLocation;
  isDrawerOpened: boolean;
  dispatchBrowserLocation: (genomeId: string, chrLocation: ChrLocation) => void;
  toggleBrowserRegionEditorActive: (browserRegionEditorActive: boolean) => void;
};

const BrowserRegionField = (props: BrowserRegionFieldProps) => {
  const { activeGenomeId } = props;
  const [chrLocationInput, setChrLocationInput] = useState('');

  const activateForm = () => {
    if (props.browserRegionEditorActive || props.isDrawerOpened) {
      return;
    }

    props.toggleBrowserRegionEditorActive(true);
  };

  const changeChrLocationInput = (value: string) => setChrLocationInput(value);

  const closeForm = () => {
    setChrLocationInput('');
    props.toggleBrowserRegionEditorActive(false);
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
      <form onSubmit={handleSubmit}>
        <label className="show-for-large">Region or location</label>
        <Input
          type="text"
          placeholder="0:1-1,000,000"
          value={chrLocationInput}
          onFocus={activateForm}
          onChange={changeChrLocationInput}
        />
        {props.browserRegionEditorActive && (
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
  browserRegionEditorActive: getBrowserRegionEditorActive(state)
});

const mapDispatchToProps = {
  toggleBrowserRegionEditorActive
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserRegionField);
