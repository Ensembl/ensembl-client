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

import { useState, useEffect } from 'react';
import { from } from 'rxjs';

import {
  fetchAnnotatedSequence,
  prepareOptionsForPayload
} from 'src/content/app/sequence-viewer/utils/fetchAnnotatedSequence';

import {
  getGenomicLocationFromString,
  type GenomicLocation
} from 'src/shared/helpers/genomicLocationHelpers';

import type {
  SequenceSettings,
  LocationSequenceSettings
} from 'src/content/app/sequence-viewer/state/settings/settingsSlice';

type Data = {
  parsedLocation: GenomicLocation;
  annotatedSequence: string;
};

type State = {
  data: Data | null;
  isLoading: boolean;
  isError: boolean;
};

const initialState: State = {
  data: null,
  isLoading: false,
  isError: false
};

const useLocationSequence = ({
  genomeId,
  location,
  settings
}: {
  genomeId: string;
  location: string;
  settings: SequenceSettings | null;
}) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (
      !settings ||
      settings.type !== 'location' ||
      settings.location !== location
    ) {
      return;
    }

    const subscription = from(
      fetchData({
        genomeId,
        location,
        settings
      })
    ).subscribe((data) => {
      setState(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [genomeId, location, settings]);

  return state;
};

async function* fetchData({
  genomeId,
  location,
  settings
}: {
  genomeId: string;
  location: string;
  settings: LocationSequenceSettings;
}) {
  yield {
    data: null,
    isLoading: true,
    isError: false
  };

  let annotatedSequence: string;
  let parsedLocation: GenomicLocation;

  try {
    parsedLocation = getGenomicLocationFromString(location);
    const options = prepareOptionsForPayload(settings);

    annotatedSequence = await fetchAnnotatedSequence({
      genome_uuid: genomeId,
      focus_location: {
        region_name: parsedLocation.regionName,
        start: parsedLocation.start,
        end: parsedLocation.end
      },
      options
    });
  } catch {
    yield {
      data: null,
      isLoading: false,
      isError: true
    };
    return;
  }

  yield {
    data: {
      annotatedSequence,
      parsedLocation
    },
    isLoading: false,
    isError: false
  };
}

export default useLocationSequence;
