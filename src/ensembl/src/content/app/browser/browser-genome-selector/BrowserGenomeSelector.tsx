import React, {
  FunctionComponent,
  useState,
  Fragment,
  ChangeEvent,
  FormEvent,
  useEffect
} from 'react';

import { ChrLocation } from '../browserState';
import { chrOptions } from '../browserConfig';

import applyIcon from 'static/img/shared/apply.svg';
import clearIcon from 'static/img/shared/clear.svg';

import styles from './BrowserGenomeSelector.scss';

type BrowserGenomeSelectorProps = {
  browserActivated: boolean;
  chrLocation: ChrLocation;
  updateDefaultChrLocation: (chrLocation: ChrLocation) => void;
};

const BrowserGenomeSelector: FunctionComponent<BrowserGenomeSelectorProps> = (
  props: BrowserGenomeSelectorProps
) => {
  const [chrCode, chrStart, chrEnd] = props.chrLocation;
  const [showInputs, setShowInputs] = useState(false);

  const [chrCodeInput, setChrCodeInput] = useState(chrCode);
  const [chrStartInput, setChrStartInput] = useState(chrStart);
  const [chrEndInput, setChrEndInput] = useState(chrEnd);

  useEffect(() => {
    setChrCodeInput(chrCode);
    setChrStartInput(chrStart);
    setChrEndInput(chrEnd);
  }, [chrCode, chrStart, chrEnd]);

  const activateForm = () => setShowInputs(true);

  const closeForm = () => {
    setChrCodeInput(chrCode);
    setChrStartInput(chrStart);
    setChrEndInput(chrEnd);

    setShowInputs(false);
  };

  const changeChrCode = (event: ChangeEvent<HTMLSelectElement>) => {
    setChrCodeInput(event.target.value);
    setShowInputs(true);
  };

  const changeChrStart = (event: ChangeEvent<HTMLInputElement>) =>
    setChrStartInput(+event.target.value);

  const changeChrEnd = (event: ChangeEvent<HTMLInputElement>) =>
    setChrEndInput(+event.target.value);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (chrStartInput > chrEndInput) {
      return;
    }

    props.updateDefaultChrLocation([chrCodeInput, chrStartInput, chrEndInput]);
    setShowInputs(false);
  };

  return props.browserActivated ? (
    <dd className={styles.browserGenomeSelector}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="chromosome" className="show-for-large">
          Chromosome
        </label>
        <select id="chromosome" onChange={changeChrCode} value={chrCodeInput}>
          {chrOptions.map((chr) => (
            <option key={chr} value={chr}>
              {chr}
            </option>
          ))}
        </select>
        {showInputs ? (
          <Fragment>
            <label htmlFor="chromosome-start" className="show-for-sr" />
            <input
              type="text"
              id="chromosome-start"
              value={chrStartInput}
              onChange={changeChrStart}
            />
            <span> - </span>
            <label htmlFor="chromosome-end" className="show-for-sr" />
            <input
              type="text"
              id="chromosome-end"
              value={chrEndInput}
              onChange={changeChrEnd}
            />
            <button>
              <img src={applyIcon} alt="Apply changes" />
            </button>
            <button onClick={closeForm}>
              <img src={clearIcon} alt="Clear changes" />
            </button>
          </Fragment>
        ) : (
          <div className={styles.chrRegion}>
            <span onClick={activateForm}>{chrStart}</span>
            <span className={styles.chrSeparator}> - </span>
            <span onClick={activateForm}>{chrEnd}</span>
          </div>
        )}
      </form>
    </dd>
  ) : null;
};

export default BrowserGenomeSelector;
