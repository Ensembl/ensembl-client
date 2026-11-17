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

import {
  useState,
  useRef,
  useId,
  type InputEvent,
  type SubmitEvent
} from 'react';
import classNames from 'classnames';

import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';

import { validateGenomicLocation } from 'src/content/app/genome-browser/helpers/browserHelper';

import useDOMElement from 'src/shared/hooks/useDOMElement';

import FlatInput from 'src/shared/components/input/FlatInput';
import ShadedInput from 'src/shared/components/input/ShadedInput';
import { PrimaryButton } from 'src/shared/components/button/Button';
import Tooltip from 'src/shared/components/tooltip/Tooltip';

import type { GenomicLocation } from 'src/shared/helpers/genomicLocationHelpers';

import styles from './LocationSearch.module.css';

type Props = {
  genomeId: string;
  location?: GenomicLocation;
  variety?: 'default' | 'compact';
  onChange: (locationString: string) => void;
  blurOnSubmit?: boolean; // remove focus from the input element on successful location change
  className?: string;
};

export const LocationSearch = (props: Props) => {
  const { genomeId, location: genomicLocation } = props;

  const formattedLocation = genomicLocation
    ? getFormattedLocation({
        chromosome: genomicLocation.regionName,
        start: genomicLocation.start,
        end: genomicLocation.end
      })
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
        genomeId
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
    props.onChange(locationString);
    if (props.blurOnSubmit) {
      inputRef.current?.blur();
    }
  };

  const removeWarning = () => {
    if (isInputError) {
      setIsInputError(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {props.variety === 'compact' ? (
        <CompactLocationSearch
          value={inputValue}
          onInput={onInputChange}
          onBlur={removeWarning}
          onWarningRemoval={removeWarning}
          isValidationError={isInputError}
          canSubmit={!isSubmitDisabled}
        />
      ) : (
        <DefaultLocationSearch
          value={inputValue}
          onInput={onInputChange}
          isValidationError={isInputError}
          canSubmit={!isSubmitDisabled}
        />
      )}
    </form>
  );
};

// This component variety is typically positioned in the grey bar at the top of the main area
// Because there is little available space around it, the submit button sit inline with the input,
// and validation errors are displayed in a tooltip
const CompactLocationSearch = ({
  value,
  onInput,
  onBlur,
  onWarningRemoval,
  isValidationError,
  canSubmit,
  className: classNameFromProps
}: {
  value: string;
  onInput: (event: InputEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onWarningRemoval: () => void;
  blurOnSubmit?: boolean;
  isValidationError: boolean;
  canSubmit: boolean;
  className?: string;
}) => {
  const [inputAnchor, setInputAnchorRef] = useDOMElement<HTMLInputElement>();

  const componentClasses = classNames(
    styles.containerCompact,
    classNameFromProps
  );

  return (
    <div className={componentClasses}>
      <div>
        <FlatInput
          ref={setInputAnchorRef}
          className={styles.inputCompact}
          value={value}
          onInput={onInput}
          onBlur={onBlur}
          aria-label="Genomic location"
        />
        {isValidationError && (
          <Tooltip anchor={inputAnchor} delay={0} onClose={onWarningRemoval}>
            Invalid location
          </Tooltip>
        )}
      </div>
      <PrimaryButton disabled={!canSubmit}>Go</PrimaryButton>
    </div>
  );
};

const DefaultLocationSearch = ({
  value,
  onInput,
  isValidationError,
  canSubmit,
  className: classNameFromProps
}: {
  value: string;
  onInput: (event: InputEvent<HTMLInputElement>) => void;
  isValidationError: boolean;
  canSubmit: boolean;
  className?: string;
}) => {
  const inputId = useId();

  return (
    <div className={classNameFromProps}>
      <div className={styles.containerDefault}>
        <label htmlFor={inputId} className={styles.label}>
          Go to
        </label>
        <ShadedInput
          id={inputId}
          className={styles.input}
          value={value}
          onInput={onInput}
          aria-label="Genomic location"
          placeholder="Add location co-ordinates"
        />
        <PrimaryButton disabled={!canSubmit}>Go</PrimaryButton>
      </div>
      {isValidationError && (
        <div className={styles.warning}>Invalid location</div>
      )}
    </div>
  );
};

export default LocationSearch;
