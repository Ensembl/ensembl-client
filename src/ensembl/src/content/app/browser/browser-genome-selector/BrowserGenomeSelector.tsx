import React, {
  FunctionComponent,
  useState,
  ChangeEvent,
  FormEvent,
  useEffect
} from 'react';
import classNames from 'classnames';

import { ChrLocation } from '../browserState';
import { getChrLocationStr } from '../browserHelper';
import { getCommaSeparatedNumber } from 'src/shared/helpers/numberFormatter';

import applyIcon from 'static/img/shared/apply.svg';
import clearIcon from 'static/img/shared/clear.svg';

import styles from './BrowserGenomeSelector.scss';

type BrowserGenomeSelectorProps = {
  activeGenomeId: string | null;
  browserActivated: boolean;
  chrLocation: ChrLocation;
  dispatchBrowserLocation: (
    genomeId: string,
    focus: string | null,
    chrLocation: ChrLocation
  ) => void;
  isDrawerOpened: boolean;
  genomeSelectorActive: boolean;
  toggleGenomeSelector: (genomeSelectorActive: boolean) => void;
};

const BrowserGenomeSelector: FunctionComponent<BrowserGenomeSelectorProps> = (
  props: BrowserGenomeSelectorProps
) => {
  const { activeGenomeId, chrLocation, isDrawerOpened } = props;
  const chrLocationStr = getChrLocationStr(chrLocation);

  const [chrLocationPlaceholder, setChrLocationPlaceholder] = useState('');
  const [chrLocationInput, setChrLocationInput] = useState('');

  const [chrCode, chrStart, chrEnd] = chrLocation;
  const displayChrRegion = !(chrStart === 0 && chrEnd === 0);

  useEffect(() => {
    setChrLocationPlaceholder(chrLocationStr);
  }, []);

  const activateForm = () => {
    if (isDrawerOpened) {
      return;
    }

    setChrLocationPlaceholder(chrLocationStr);
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
    if (!activeGenomeId) {
      return;
    }

    if (
      chrLocationInput &&
      chrLocationInput.indexOf(':') === -1 &&
      chrLocationInput.indexOf('-') === -1
    ) {
      closeForm();

      props.dispatchBrowserLocation(activeGenomeId, null, [
        chrLocationInput,
        0,
        0
      ]);
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

        props.dispatchBrowserLocation(activeGenomeId, null, currChrLocation);
      }
    }
  };

  const className = classNames(styles.browserGenomeSelector, {
    [styles.browserGenomeSelectorDisabled]: isDrawerOpened
  });

  return props.browserActivated ? (
    <dd className={className}>
      <label className="show-for-large">Chromosome</label>
      {props.genomeSelectorActive ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={chrLocationPlaceholder}
            value={chrLocationInput}
            onChange={changeChrLocationInput}
          />
          <button>
            <img src={applyIcon} alt="Apply changes" />
          </button>
          <button onClick={closeForm}>
            <img src={clearIcon} alt="Clear changes" />
          </button>
        </form>
      ) : (
        <div className={styles.chrLocationView} onClick={activateForm}>
          <div className={styles.chrCode}>{chrCode}</div>
          {displayChrRegion ? (
            <div className={styles.chrRegion}>
              <span>{getCommaSeparatedNumber(chrStart)}</span>
              <span className={styles.chrSeparator}> - </span>
              <span>{getCommaSeparatedNumber(chrEnd)}</span>
            </div>
          ) : null}
        </div>
      )}
    </dd>
  ) : null;
};

export default BrowserGenomeSelector;
