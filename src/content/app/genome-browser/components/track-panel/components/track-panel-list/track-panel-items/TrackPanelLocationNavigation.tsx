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
  useRef,
  useState,
  useId,
  type InputEvent,
  type KeyboardEvent
} from 'react';
import { useNavigate } from 'react-router-dom';

import { useGenomeKaryotypeQuery } from 'src/shared/state/genome/genomeApiSlice';
import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';

import * as urlFor from 'src/shared/helpers/urlHelper';
import {
  validateGenomicLocation,
  type LocationValidationResponse
} from 'src/content/app/genome-browser/helpers/browserHelper';

import FlatInput from 'src/shared/components/input/FlatInput';
import { PrimaryButton } from 'src/shared/components/button/Button';
import SimpleSelect, {
  type SimpleSelectMethods
} from 'src/shared/components/simple-select/SimpleSelect';
import {
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'src/shared/components/accordion';

import trackPanelStyles from '../TrackPanelList.module.css';
import styles from './TrackPanelLocationNavigation.module.css';

const ERROR_MESSAGE =
  'Sorry, we do not recognise this location in this genome.';

const LocationNavigation = () => {
  const { activeGenomeId, genomeIdForUrl } = useGenomeBrowserIds();
  const regionSelectId = useId();
  const locationInputId = useId();
  const selectRef = useRef<SimpleSelectMethods | null>(null);

  const navigate = useNavigate();

  const { data: genomeKaryotype = [] } = useGenomeKaryotypeQuery(
    activeGenomeId as string
  );

  const [regionNameInput, setRegionNameInput] = useState('');
  const [locationInput, setLocationInput] = useState('');

  const [shouldShowErrorMessage, setShowErrorMessage] =
    useState<boolean>(false);

  const shouldDisableSubmission = !locationInput;

  const handleSubmit = async () => {
    setShowErrorMessage(false);

    // add regionNameInput if user only entered start:end
    const newLocation = locationInput;

    try {
      const validatedLocation = await validateGenomicLocation({
        location: newLocation,
        genomeId: activeGenomeId as string
      });
      onValidationSuccess(validatedLocation);
    } catch (error) {
      if (error && typeof error === 'object' && 'location' in error) {
        onValidationError();
      }
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.currentTarget.blur();
      resetForm();
    }

    if (event.key === 'Enter' && !shouldDisableSubmission) {
      event.currentTarget.blur();
      handleSubmit();
    }
  };

  const getKaryotypeOptions = () =>
    genomeKaryotype.map(({ name }) => ({
      value: name,
      label: name
    }));

  const updateRegionName = (event: InputEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;
    const selectedKaryotypeItem = genomeKaryotype.find(
      ({ name }) => name === value
    );

    if (selectedKaryotypeItem) {
      setRegionNameInput(value);
    }
  };

  const onLocationInputChange = (event: InputEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setLocationInput(value);
    setShowErrorMessage(false);
  };

  const onValidationError = () => {
    setShowErrorMessage(true);
  };

  const resetForm = () => {
    selectRef.current?.clear();
    setLocationInput('');
    setShowErrorMessage(false);
  };

  const onValidationSuccess = (
    validatedLocation: LocationValidationResponse
  ) => {
    resetForm();
    const { location } = validatedLocation;

    navigate(
      urlFor.browser({
        genomeId: genomeIdForUrl,
        focus: `location:${location}`
      }),
      {
        replace: true
      }
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <label htmlFor={regionSelectId}>Region</label>
        <SimpleSelect
          id={regionSelectId}
          onInput={updateRegionName}
          onKeyUp={handleKeyPress}
          options={getKaryotypeOptions()}
          value={regionNameInput}
          disabled={!genomeKaryotype.length}
          className={styles.rangeNameSelect}
          placeholder="Select"
          ref={selectRef}
        />
        <label htmlFor={locationInputId}>
          <span>Go to</span>
        </label>
        <div className={styles.locationInputWrapper}>
          <FlatInput
            id={locationInputId}
            type="text"
            onInput={onLocationInputChange}
            onKeyUp={handleKeyPress}
            value={locationInput}
            placeholder="Add location co-ordinates..."
          />
          <PrimaryButton
            onClick={handleSubmit}
            disabled={shouldDisableSubmission}
          >
            Go
          </PrimaryButton>
        </div>
      </div>
      {shouldShowErrorMessage && (
        <div className={styles.errorMessage}>{ERROR_MESSAGE}</div>
      )}
    </div>
  );
};

const TrackPanelLocationNavigation = () => {
  return (
    <AccordionItem
      className={trackPanelStyles.trackPanelAccordionItem}
      uuid="genomic_location"
    >
      <AccordionItemHeading
        className={trackPanelStyles.trackPanelAccordionHeader}
      >
        <AccordionItemButton
          className={trackPanelStyles.trackPanelAccordionButton}
        >
          Location
        </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel
        className={trackPanelStyles.trackPanelAccordionItemContent}
      >
        <LocationNavigation />
      </AccordionItemPanel>
    </AccordionItem>
  );
};

export default TrackPanelLocationNavigation;
