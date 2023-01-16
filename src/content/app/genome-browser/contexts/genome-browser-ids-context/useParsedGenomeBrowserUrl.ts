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

import { useLocation } from 'react-router-dom';

import {
  buildFocusObjectId,
  parseFocusIdFromUrl
} from 'src/shared/helpers/focusObjectHelpers';
import { getChrLocationFromStr } from 'src/content/app/genome-browser/helpers/browserHelper';

import { useUrlParams } from 'src/shared/hooks/useUrlParams';

import {
  isGenomeNotFoundError,
  useGenomeInfoQuery
} from 'src/shared/state/genome/genomeApiSlice';

const useParsedGenomeBrowserUrl = () => {
  const params = useUrlParams<'genomeId'>('/genome-browser/:genomeId');
  const { genomeId: genomeIdInUrl } = params;

  const { search } = useLocation();
  const urlSearchParams = new URLSearchParams(search);
  const focusObjectIdInUrl = urlSearchParams.get('focus');
  const locationInUrl = urlSearchParams.get('location');

  const {
    currentData: genomeInfo,
    isFetching,
    isError,
    error
  } = useGenomeInfoQuery(genomeIdInUrl ?? '', {
    skip: !genomeIdInUrl
  });
  const genomeId = genomeInfo?.genomeId;
  const isMissingGenomeId = isError && isGenomeNotFoundError(error);

  let focusObjectId;
  let parsedFocusObjectId;
  let isMalformedFocusObjectId = false;
  let parsedLocation;
  let isMalformedLocation = false;

  if (focusObjectIdInUrl && genomeId) {
    try {
      parsedFocusObjectId = {
        genomeId,
        ...parseFocusIdFromUrl(focusObjectIdInUrl)
      };
      focusObjectId = buildFocusObjectId(parsedFocusObjectId);
    } catch {
      isMalformedFocusObjectId = true;
    }
  }

  if (locationInUrl) {
    try {
      parsedLocation = getChrLocationFromStr(locationInUrl);
    } catch {
      isMalformedLocation = true;
    }
  }

  return {
    genomeIdInUrl,
    focusObjectIdInUrl,
    isFetchingGenomeId: isFetching,
    isMissingGenomeId,
    genomeId,
    focusObjectId,
    parsedFocusObjectId,
    isMalformedFocusObjectId,
    parsedLocation,
    isMalformedLocation
  };
};

export default useParsedGenomeBrowserUrl;
