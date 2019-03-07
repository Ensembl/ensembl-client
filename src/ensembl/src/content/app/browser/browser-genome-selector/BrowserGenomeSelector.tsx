import React, {
  FunctionComponent,
  useState,
  ChangeEvent,
  FormEvent,
  useEffect
} from 'react';

import { ChrLocation } from '../browserState';

import applyIcon from 'static/img/shared/apply.svg';
import clearIcon from 'static/img/shared/clear.svg';

import styles from './BrowserGenomeSelector.scss';
import { getChrLocationStr } from '../browserHelper';

type BrowserGenomeSelectorProps = {
  browserActivated: boolean;
  changeBrowserLocation: () => void;
  defaultChrLocation: ChrLocation;
  updateDefaultChrLocation: (chrLocation: ChrLocation) => void;
};

const BrowserGenomeSelector: FunctionComponent<BrowserGenomeSelectorProps> = (
  props: BrowserGenomeSelectorProps
) => {
  const chrLocationStr = getChrLocationStr(props.defaultChrLocation);
  const [showInputs, setShowInputs] = useState(false);

  const [chrLocationPlaceholder, setChrLocationPlaceholder] = useState('');
  const [chrLocationInput, setChrLocationInput] = useState('');

  const [chrCode, chrStart, chrEnd] = props.defaultChrLocation;

  useEffect(() => {
    setChrLocationPlaceholder(chrLocationStr);
  }, []);

  const activateForm = () => {
    setChrLocationPlaceholder(chrLocationStr);
    setShowInputs(true);
  };

  const changeChrLocationInput = (event: ChangeEvent<HTMLInputElement>) =>
    setChrLocationInput(event.target.value);

  const closeForm = () => {
    setChrLocationInput('');
    setShowInputs(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const [chrCodeInput, chrRegionInput] = chrLocationInput.split(':');
    const [chrStartInput, chrEndInput] = chrRegionInput.split('-');

    if (chrCodeInput && +chrStartInput < +chrEndInput) {
      const currChrLocation: ChrLocation = [
        chrCodeInput,
        +chrStartInput,
        +chrEndInput
      ];

      closeForm();

      props.updateDefaultChrLocation(currChrLocation);
      props.changeBrowserLocation();
    } else {
      return;
    }
  };

  return props.browserActivated ? (
    <dd className={styles.browserGenomeSelector}>
      {showInputs ? (
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
          <div className={styles.chrRegion}>
            <span>{chrStart}</span>
            <span className={styles.chrSeparator}> - </span>
            <span>{chrEnd}</span>
          </div>
        </div>
      )}
    </dd>
  ) : null;
};

export default BrowserGenomeSelector;
