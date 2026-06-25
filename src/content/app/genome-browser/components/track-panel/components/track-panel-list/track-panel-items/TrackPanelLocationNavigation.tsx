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

import { useState, useId, type InputEvent, type KeyboardEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAppSelector } from 'src/store';

import { getGenomicLocationString } from 'src/shared/helpers/genomicLocationHelpers';

import { getChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import { useGenomeKaryotypeQuery } from 'src/shared/state/genome/genomeApiSlice';
import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';

import * as urlFor from 'src/shared/helpers/urlHelper';
import {
  validateGenomicLocation,
  type LocationValidationResponse
} from 'src/content/app/genome-browser/helpers/browserHelper';

import ShadedInput from 'src/shared/components/input/ShadedInput';
import { PrimaryButton } from 'src/shared/components/button/Button';
import SimpleSelect from 'src/shared/components/simple-select/SimpleSelect';
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
  const chrLocation = useAppSelector(getChrLocation);
  const { activeGenomeId, genomeIdForUrl } = useGenomeBrowserIds();
  const regionSelectId = useId();
  const locationInputId = useId();

  const urlLocation = useLocation();
  const navigate = useNavigate();

  const [regionNameFromRedux] = chrLocation ?? [];

  const { data: genomeKaryotype = [] } = useGenomeKaryotypeQuery(
    activeGenomeId as string
  );

  const [regionNameInput, setRegionNameInput] = useState(
    regionNameFromRedux ?? ''
  );
  const [locationInput, setLocationInput] = useState('');

  if (regionNameFromRedux && !regionNameInput) {
    setRegionNameInput(regionNameFromRedux);
  }

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

  const onRegionNameChange = (event: InputEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;
    const selectedKaryotypeItem = genomeKaryotype.find(
      ({ name }) => name === value
    );

    if (selectedKaryotypeItem) {
      setRegionNameInput(value);

      const newRegionName = selectedKaryotypeItem.name;
      const newRegionLength = selectedKaryotypeItem.length;
      const newGenomicLocation = getGenomicLocationString({
        regionName: newRegionName,
        start: 1,
        end: newRegionLength
      });

      const { pathname } = urlLocation;
      const newSearchParams = new URLSearchParams();
      newSearchParams.set('focus', `location:${newGenomicLocation}`);
      const newQueryString = decodeURIComponent(newSearchParams.toString());
      const url = `${pathname}?${newQueryString}`;
      navigate(url);
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
        focus: `location:${location}`,
        location
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
          onInput={onRegionNameChange}
          onKeyUp={handleKeyPress}
          options={getKaryotypeOptions()}
          value={regionNameInput}
          disabled={!genomeKaryotype.length}
          className={styles.select}
          placeholder="Select"
        />
        <label htmlFor={locationInputId}>
          <span>Go to</span>
        </label>
        <div className={styles.locationInputWrapper}>
          <ShadedInput
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
  const { activeGenomeId } = useGenomeBrowserIds();

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
        {/* reset LocationNavigation component when the genome id changes */}
        <LocationNavigation key={activeGenomeId} />
      </AccordionItemPanel>
    </AccordionItem>
  );
};

export default TrackPanelLocationNavigation;
