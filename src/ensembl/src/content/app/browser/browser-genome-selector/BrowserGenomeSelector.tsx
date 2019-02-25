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

type BrowserGenomeSelectorProps = {
  browserActivated: boolean;
  browserImageEl: HTMLDivElement;
  chrLocation: ChrLocation;
  updateDefaultChrLocation: (chrLocation: ChrLocation) => void;
};

const BrowserGenomeSelector: FunctionComponent<BrowserGenomeSelectorProps> = (
  props: BrowserGenomeSelectorProps
) => {
  const [chrCode, chrStart, chrEnd] = props.chrLocation;
  const chrLocationStr = `${chrCode}:${chrStart}-${chrEnd}`;
  const [showInputs, setShowInputs] = useState(false);

  const [chrLocationInput, setChrLocationInput] = useState(chrLocationStr);

  useEffect(() => {
    setChrLocationInput(chrLocationStr);
  }, []);

  const activateForm = () => setShowInputs(true);

  const changeChrLocationInput = (event: ChangeEvent<HTMLInputElement>) =>
    setChrLocationInput(event.target.value);

  const closeForm = () => {
    setChrLocationInput(chrLocationStr);
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

      setShowInputs(false);
      sendLocationToBrowser(currChrLocation, props.browserImageEl);

      props.updateDefaultChrLocation(currChrLocation);
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

function sendLocationToBrowser(
  chrLocation: ChrLocation,
  browserImageEl: HTMLDivElement
) {
  const [chrCode, startBp, endBp] = chrLocation;
  const midChrLocation = startBp + (endBp - startBp) / 2;

  const genomeSelectorEvent = new CustomEvent('bpane', {
    bubbles: true,
    detail: {
      move_to_bp: Math.round(midChrLocation),
      stick: chrCode
    }
  });

  browserImageEl.dispatchEvent(genomeSelectorEvent);
}

export default BrowserGenomeSelector;
