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
  buildFocusIdForUrl,
  parseFocusIdFromUrl,
  buildFocusObjectId
} from 'src/shared/helpers/focusObjectHelpers';

import { useAppSelector } from 'src/store';
import { useUrlParams } from 'src/shared/hooks/useUrlParams';
import {
  useGenomeInfoQuery,
  isGenomeNotFoundError
} from 'src/shared/state/genome/genomeApiSlice';

import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import {
  getBrowserActiveGenomeId,
  getBrowserActiveFocusObjectId
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

// TODO: remember that there will also be a lookup into the browser storage
// to determine whether the genome id in the url still matches the genome id
// that the backend thinks it should be associated with
const useGenomeBrowserIds = () => {
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId);
  const activeFocusObjectId = useAppSelector(getBrowserActiveFocusObjectId);
  const committedSpecies = useAppSelector((state) =>
    getCommittedSpeciesById(state, activeGenomeId ?? '')
  );
  const params = useUrlParams<'genomeId'>('/genome-browser/:genomeId');
  const { search } = useLocation();

  const { genomeId: genomeIdInUrl } = params;
  const urlSearchParams = new URLSearchParams(search);
  const focusObjectIdInUrl = urlSearchParams.get('focus');

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

  // TODO: check if the logic below is correct
  const genomeIdForUrl =
    genomeIdInUrl ?? committedSpecies?.url_slug ?? committedSpecies?.genome_id;

  let focusObjectId;
  let focusObjectIdForUrl;
  let parsedFocusObjectId;
  let isMalformedFocusObjectId = false;

  if (focusObjectIdInUrl) {
    focusObjectIdForUrl = focusObjectIdInUrl;
    if (genomeId) {
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
  } else if (activeFocusObjectId) {
    focusObjectIdForUrl = buildFocusIdForUrl(activeFocusObjectId);
  }

  return {
    isFetchingGenomeId: isFetching,
    isMissingGenomeId,
    genomeId,
    genomeIdInUrl,
    focusObjectId,
    focusObjectIdInUrl,
    activeGenomeId,
    activeFocusObjectId,
    genomeIdForUrl,
    focusObjectIdForUrl,
    parsedFocusObjectId,
    isMalformedFocusObjectId
  };
};

export default useGenomeBrowserIds;
