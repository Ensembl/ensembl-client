/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useState, useRef, type InputEvent, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { validateGenomicLocation } from 'src/content/app/genome-browser/helpers/browserHelper';

import { useAppSelector } from 'src/store';
import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';

import { getActualChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import FlatInput from 'src/shared/components/input/FlatInput';
import { PrimaryButton } from 'src/shared/components/button/Button';
import Tooltip from 'src/shared/components/tooltip/Tooltip';

import type { ChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';

import styles from './BrowserLocationIndicator.module.css';

type Props = {
  className?: string;
};

export const BrowserLocationIndicator = (props: Props) => {
  const chrLocation = useAppSelector(getActualChrLocation);
  const { activeGenomeId, genomeIdForUrl } = useGenomeBrowserIds();
  const navigate = useNavigate();

  const formattedLocation = chrLocation
    ? formatLocationString(chrLocation)
    : '';
  const [prevFormattedLocation, setPrevFormattedLocation] =
    useState(formattedLocation);
  const [inputValue, setInputValue] = useState(formattedLocation);
  const [isInputError, setIsInputError] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  if (formattedLocation !== prevFormattedLocation) {
    setPrevFormattedLocation(formattedLocation);
    setInputValue(formattedLocation);
  }

  const isSubmitDisabled = formattedLocation === inputValue || isValidating;

  const onInputChange = (event: InputEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setInputValue(value);

    if (isInputError) {
      setIsInputError(false);
    }
  };

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitDisabled) {
      return;
    }

    try {
      setIsValidating(true);
      const validationResult = await validateGenomicLocation({
        location: inputValue,
        genomeId: activeGenomeId as string
      });
      const validatedLocation = validationResult.location;
      if (validatedLocation) {
        onValidationSuccess(validatedLocation);
      } else throw new Error();
    } catch {
      setIsInputError(true);
    } finally {
      setIsValidating(false);
    }
  };

  const onValidationSuccess = (locationString: string) => {
    navigate(
      urlFor.browser({
        genomeId: genomeIdForUrl,
        focus: `location:${locationString}`
      }),
      {
        replace: true
      }
    );
  };

  const [regionName, start, end] = chrLocation || [];

  if (!activeGenomeId || !regionName || !start || !end) {
    return null;
  }

  const componentClasses = classNames(styles.container, props.className);

  return (
    <form className={componentClasses} onSubmit={onSubmit}>
      <div>
        <FlatInput
          ref={inputRef}
          className={styles.input}
          value={inputValue}
          onInput={onInputChange}
        />
        {isInputError && (
          <Tooltip anchor={inputRef.current} delay={0}>
            Invalid location
          </Tooltip>
        )}
      </div>
      <PrimaryButton disabled={isSubmitDisabled}>Go</PrimaryButton>
    </form>
  );
};

const formatLocationString = (chrLocation: ChrLocation) => {
  return getFormattedLocation({
    chromosome: chrLocation[0],
    start: chrLocation[1],
    end: chrLocation[2]
  });
};

export default BrowserLocationIndicator;
