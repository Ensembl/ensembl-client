import React, { useState, FormEvent, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Input from 'src/shared/components/input/Input';
import Tooltip from 'src/shared/components/tooltip/Tooltip';

import { ChrLocation, BrowserRegionValidationResponse } from '../browserState';
import { RootState } from 'src/store';
import {
  resetBrowserRegionValidaion,
  toggleBrowserRegionFieldActive,
  validateBrowserRegion
} from '../browserActions';
import {
  getBrowserActiveGenomeId,
  getBrowserRegionEditorActive,
  getBrowserRegionFieldActive,
  getBrowserRegionFieldErrors
} from '../browserSelectors';
import { getIsDrawerOpened } from '../drawer/drawerSelectors';
import { GenomeKaryotype } from 'src/genome/genomeTypes';
import { getBrowserRegionFieldErrorMessages } from '../browserHelper';
import { getGenomeKaryotypes } from 'src/genome/genomeSelectors';

import applyIcon from 'static/img/shared/apply.svg';
import clearIcon from 'static/img/shared/clear.svg';

import styles from './BrowserRegionField.scss';
import browserStyles from '../Browser.scss';
import browserNavBarStyles from '../browser-nav/BrowserNavBar.scss';

type BrowserRegionFieldProps = {
  activeGenomeId: string | null;
  browserRegionEditorActive: boolean;
  browserRegionFieldActive: boolean;
  browserRegionFieldErrors: BrowserRegionValidationResponse | null;
  genomeKaryotypes: GenomeKaryotype[] | null;
  isDrawerOpened: boolean;
  dispatchBrowserLocation: (genomeId: string, chrLocation: ChrLocation) => void;
  resetBrowserRegionValidaion: () => void;
  toggleBrowserRegionFieldActive: (browserRegionFieldActive: boolean) => void;
  validateBrowserRegion: (region: string) => void;
};

export const BrowserRegionField = (props: BrowserRegionFieldProps) => {
  const { activeGenomeId } = props;
  const [regionFieldInput, setRegionFieldInput] = useState('');
  const [regionFieldErrorMessages, setRegionFieldErrorMessages] = useState<
    string | null
  >(null);

  const activateForm = () => {
    if (props.browserRegionFieldActive || props.isDrawerOpened) {
      return;
    }

    props.toggleBrowserRegionFieldActive(true);
  };

  const changeRegionFieldInput = (value: string) => setRegionFieldInput(value);

  const closeForm = () => {
    setRegionFieldInput('');
    props.toggleBrowserRegionFieldActive(false);
    props.resetBrowserRegionValidaion();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeGenomeId || !regionFieldInput) {
      return;
    }

    props.validateBrowserRegion(regionFieldInput);
  };

  useEffect(() => () => props.resetBrowserRegionValidaion(), []);

  useEffect(() => {
    const errorMessages = getBrowserRegionFieldErrorMessages(
      props.browserRegionFieldErrors,
      props.genomeKaryotypes
    );

    setRegionFieldErrorMessages(errorMessages);
  }, [props.browserRegionFieldErrors]);

  const regionFieldClassNames = classNames(styles.browserRegionField, {
    [browserStyles.semiOpaque]: props.browserRegionEditorActive
  });

  const inputClassNames = classNames({
    [browserNavBarStyles.errorText]: regionFieldErrorMessages
  });

  const buttonsClassNames = classNames(
    browserNavBarStyles.browserNavBarButtons,
    {
      [browserNavBarStyles.browserNavBarButtonsVisible]:
        props.browserRegionFieldActive
    }
  );

  return (
    <div className={regionFieldClassNames}>
      {props.browserRegionEditorActive ? (
        <div
          className={browserStyles.browserOverlay}
          id="region-field-overlay"
        ></div>
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
          <button onClick={closeForm}>
            <img src={clearIcon} alt="Clear changes" id="close-button" />
          </button>
        </span>
      </form>
      {regionFieldErrorMessages ? (
        <Tooltip autoAdjust={true}>{regionFieldErrorMessages}</Tooltip>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  activeGenomeId: getBrowserActiveGenomeId(state),
  browserRegionEditorActive: getBrowserRegionEditorActive(state),
  browserRegionFieldActive: getBrowserRegionFieldActive(state),
  browserRegionFieldErrors: getBrowserRegionFieldErrors(state),
  genomeKaryotypes: getGenomeKaryotypes(state),
  isDrawerOpened: getIsDrawerOpened(state)
});

const mapDispatchToProps = {
  resetBrowserRegionValidaion,
  toggleBrowserRegionFieldActive,
  validateBrowserRegion
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserRegionField);
