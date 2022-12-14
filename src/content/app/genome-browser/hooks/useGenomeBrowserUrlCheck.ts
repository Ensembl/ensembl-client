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

import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';
import { useGetTrackPanelGeneQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';
import { useGbRegionQueryQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';

import { getChrLocationFromStr } from 'src/content/app/genome-browser/helpers/browserHelper';

/**
 * A hook for validating individual parts of the url.
 * TODO: might be worth adding validation of the 'location' parameter in the future
 */

const useGenomeBrowserUrlCheck = () => {
  const {
    genomeIdInUrl,
    isMissingGenomeId,
    isMalformedFocusObjectId,
    focusObjectIdInUrl,
    parsedFocusObjectId
  } = useGenomeBrowserIds();

  const focusObjectType = parsedFocusObjectId?.type;

  const isFocusGene = focusObjectType === 'gene';
  const isFocusLocation = focusObjectType === 'location';

  let isMissingFocusObject = false;

  const focusGeneCheck = useFocusGeneCheck(
    {
      focusObject: parsedFocusObjectId
    },
    {
      skip: !isFocusGene
    }
  );
  const focusLocationCheck = useFocusLocationCheck(
    {
      focusObject: parsedFocusObjectId
    },
    {
      skip: !isFocusLocation
    }
  );

  if (isFocusGene) {
    isMissingFocusObject = focusGeneCheck.isMissingFocusObject;
  } else if (isFocusLocation) {
    isMissingFocusObject = focusLocationCheck.isMissingFocusObject;
  }

  return {
    genomeIdInUrl,
    focusObjectIdInUrl,
    isMissingGenomeId,
    isMalformedFocusObjectId,
    isMissingFocusObject
  };
};

const useFocusGeneCheck = (
  params: {
    focusObject: ReturnType<typeof useGenomeBrowserIds>['parsedFocusObjectId'];
  },
  options: {
    skip?: boolean;
  }
) => {
  const { focusObject } = params;
  const { skip } = options;

  const genomeId = focusObject?.genomeId;
  const geneId = focusObject?.objectId;

  const { isError: isGeneQueryError, error: geneQueryError } =
    useGetTrackPanelGeneQuery(
      {
        genomeId: genomeId ?? '',
        geneId: geneId ?? ''
      },
      {
        skip: skip || !genomeId || !geneId
      }
    );

  const isMissingGene =
    isGeneQueryError &&
    'meta' in geneQueryError &&
    geneQueryError.meta.data.gene === null;

  return {
    isMissingFocusObject: isMissingGene
  };
};

const useFocusLocationCheck = (
  params: {
    focusObject: ReturnType<typeof useGenomeBrowserIds>['parsedFocusObjectId'];
  },
  options: {
    skip?: boolean;
  }
) => {
  const { focusObject } = params;
  const { skip } = options;

  const genomeId = focusObject?.genomeId;
  const locationId = focusObject?.objectId;

  let isValidLocation = true;
  let parsedLocation: ReturnType<typeof getChrLocationFromStr> | null = null;

  try {
    if (locationId) {
      parsedLocation = getChrLocationFromStr(locationId);
    }
  } catch {
    isValidLocation = false;
  }

  const [regionName, start, end] = parsedLocation || [];

  const { isInvalidLocation } = useLocationCheck(
    {
      genomeId: genomeId ?? '',
      regionName: regionName ?? '',
      start: start ?? 1,
      end: end ?? 1
    },
    {
      skip: skip || !isValidLocation || !genomeId || !parsedLocation
    }
  );

  return {
    isMissingFocusObject: isInvalidLocation
  };
};

const useLocationCheck = (
  params: {
    genomeId: string;
    regionName: string;
    start: number;
    end: number;
  },
  options: {
    skip?: boolean;
  }
) => {
  const { genomeId, regionName, start, end } = params;
  const { skip } = options;

  let isInvalidLocation = false;

  const {
    currentData: regionData,
    isError: isRegionQueryError,
    error: regionQueryError
  } = useGbRegionQueryQuery(
    {
      genomeId,
      regionName
    },
    {
      skip: skip
    }
  );

  if (regionData) {
    const { length, topology } = regionData.region;
    const isStartOutOfBounds = start < 1 || start > length;
    const isEndOutOfBounds = end < 1 || end > length;
    const isStartGreaterThanEnd = start > end && topology === 'linear';

    if (isStartOutOfBounds || isEndOutOfBounds || isStartGreaterThanEnd) {
      isInvalidLocation = true;
    } else if (
      isRegionQueryError &&
      (regionQueryError as any).errors[0]?.extensions?.code ===
        'REGION_NOT_FOUND'
    ) {
      isInvalidLocation = true;
    }
  }

  return {
    isInvalidLocation
  };
};

export default useGenomeBrowserUrlCheck;
