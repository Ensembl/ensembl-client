import React, { useState, FormEvent } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Input from 'src/shared/input/Input';

import { ChrLocation } from '../browserState';
import { RootState } from 'src/store';
import { toggleBrowserRegionFieldActive } from '../browserActions';
import {
  getBrowserActiveGenomeId,
  getBrowserActivated,
  getChrLocation,
  getBrowserRegionEditorActive,
  getBrowserRegionFieldActive
} from '../browserSelectors';
import { getIsDrawerOpened } from '../drawer/drawerSelectors';

import applyIcon from 'static/img/shared/apply.svg';
import clearIcon from 'static/img/shared/clear.svg';

import styles from './BrowserRegionField.scss';
import browserNavStyles from '../browser-nav/BrowserNavBar.scss';

type BrowserRegionFieldProps = {
  activeGenomeId: string | null;
  browserActivated: boolean;
  browserRegionEditorActive: boolean;
  browserRegionFieldActive: boolean;
  chrLocation: ChrLocation;
  isDrawerOpened: boolean;
  dispatchBrowserLocation: (genomeId: string, chrLocation: ChrLocation) => void;
  toggleBrowserRegionFieldActive: (browserRegionFieldActive: boolean) => void;
};

export const BrowserRegionField = (props: BrowserRegionFieldProps) => {
  const { activeGenomeId } = props;
  const [chrLocationInput, setChrLocationInput] = useState('');

  const activateForm = () => {
    if (props.browserRegionFieldActive || props.isDrawerOpened) {
      return;
    }

    props.toggleBrowserRegionFieldActive(true);
  };

  const changeChrLocationInput = (value: string) => setChrLocationInput(value);

  const closeForm = () => {
    setChrLocationInput('');
    props.toggleBrowserRegionFieldActive(false);
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

  const classList = classNames(styles.browserRegionField, {
    [browserNavStyles.opaqueArea]: props.browserRegionEditorActive
  });

  return props.browserActivated ? (
    <dd className={classList}>
      <form onSubmit={handleSubmit}>
        <label className="show-for-large">Region or location</label>
        <Input
          type="text"
          placeholder="0:1-1,000,000"
          value={chrLocationInput}
          onChange={changeChrLocationInput}
          onFocus={activateForm}
        />
        {props.browserRegionFieldActive && (
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
  ) : null;
};

const mapStateToProps = (state: RootState) => ({
  activeGenomeId: getBrowserActiveGenomeId(state),
  browserActivated: getBrowserActivated(state),
  chrLocation: getChrLocation(state) as ChrLocation,
  isDrawerOpened: getIsDrawerOpened(state),
  browserRegionEditorActive: getBrowserRegionEditorActive(state),
  browserRegionFieldActive: getBrowserRegionFieldActive(state)
});

const mapDispatchToProps = {
  toggleBrowserRegionFieldActive
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserRegionField);
