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

import { useAppDispatch, useAppSelector, type AppDispatch } from 'src/store';

import { getGenomicLocationString } from 'src/shared/helpers/genomicLocationHelpers';

import { getChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import { useGenomeTopLevelRegionsQuery } from 'src/shared/state/genome/genomeApiSlice';
import { getGBRegion } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';
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
  const dispatch = useAppDispatch();

  const urlLocation = useLocation();
  const navigate = useNavigate();

  const [regionNameFromRedux] = chrLocation ?? [];

  const { data: genomeTopLevelRegions = [] } = useGenomeTopLevelRegionsQuery(
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

    const parsedInput = parseUserInput(locationInput);

    if (parsedInput.type === 'region_name') {
      const { location: newLocation } = await getLocationFromRegionName({
        genomeId: activeGenomeId as string,
        regionName: parsedInput.regionName,
        dispatch
      });
      if (newLocation) {
        onValidationSuccess({ location: newLocation });
      } else {
        onValidationError();
      }
      return;
    }

    let newLocation = locationInput;

    if (parsedInput.type === 'start_end') {
      // add regionNameInput if user only entered start:end
      newLocation = getGenomicLocationString({
        regionName: regionNameInput,
        start: parsedInput.start,
        end: parsedInput.end
      });
    }

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

  const getTopLevelRegionsOptions = () =>
    genomeTopLevelRegions.map(({ name }) => ({
      value: name,
      label: name
    }));

  const onRegionNameChange = (event: InputEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;
    const selectedTopLevelRegion = genomeTopLevelRegions.find(
      ({ name }) => name === value
    );

    if (selectedTopLevelRegion) {
      setRegionNameInput(value);

      const newRegionName = selectedTopLevelRegion.name;
      const newRegionLength = selectedTopLevelRegion.length;
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
          options={getTopLevelRegionsOptions()}
          value={regionNameInput}
          disabled={!genomeTopLevelRegions.length}
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

/**
 * Support the following use cases for the input string:
 * - Full location format (regionName:start-end)
 * - Only start and end, with the region implicitly being the current one (start-end)
 * - Only the region name (random string, no colons or hyphens)
 */

const parseUserInput = (input: string) => {
  const startEndLikeRegex = /^[\d.,]+-[\d.,]+$/;

  // Step 1: guess whether user's input is a full location string,
  // a partial location (start-end) string, or just a region name
  const [firstPart, secondPart = ''] = input.split(':');

  let regionNameString = '';
  let startEndString = '';

  if (secondPart && startEndLikeRegex.test(secondPart)) {
    // full location string
    regionNameString = firstPart;
    startEndString = secondPart;
  } else if (!secondPart && startEndLikeRegex.test(firstPart)) {
    // partial location string (just start-end)
    startEndString = firstPart;
  } else {
    // bail; assume the complete input string is a region name
    regionNameString = input;
  }

  // Step 2: clean up the start/end string
  if (startEndString) {
    startEndString = startEndString
      .replace(/[.,]/g, '') // remove dots and commas
      .replace(/\p{Pd}/gu, '-'); // replace all unicode dash punctuation characters with a single hyphen
  }

  // Step 3: Parse the result
  const startEndRegex = /(?<start>\d+)-(?<end>\d+)/;
  const startEndMatch = startEndString.match(startEndRegex);

  if (regionNameString && startEndMatch) {
    return {
      type: 'full_location',
      regionName: regionNameString,
      start: parseInt(startEndMatch.groups!.start, 10),
      end: parseInt(startEndMatch.groups!.end, 10)
    } as const;
  } else if (startEndMatch) {
    return {
      type: 'start_end',
      start: parseInt(startEndMatch.groups!.start, 10),
      end: parseInt(startEndMatch.groups!.end, 10)
    } as const;
  } else {
    return {
      type: 'region_name',
      regionName: input
    } as const;
  }
};

const getLocationFromRegionName = async ({
  genomeId,
  regionName,
  dispatch
}: {
  genomeId: string;
  regionName: string;
  dispatch: AppDispatch;
}) => {
  const { data } = await dispatch(
    getGBRegion.initiate({ genomeId, regionName }, { subscribe: false })
  );
  const { region } = data ?? {};
  if (!region) {
    return {
      location: null
    };
  }
  const genomicLocation = getGenomicLocationString({
    regionName,
    start: 1,
    end: region.length
  });
  return {
    location: genomicLocation
  };
};

export default TrackPanelLocationNavigation;
