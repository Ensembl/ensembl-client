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

import React from 'react';
import { useLocation } from 'react-router-dom';

import {
  buildFocusIdForUrl,
  buildFocusObjectId,
  parseFocusIdFromUrl
} from 'src/shared/helpers/focusObjectHelpers';

import { useUrlParams } from 'src/shared/hooks/useUrlParams';
import { useAppSelector } from 'src/store';

import {
  isGenomeNotFoundError,
  useGenomeInfoQuery
} from 'src/shared/state/genome/genomeApiSlice';

import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import {
  getBrowserActiveFocusObjectId,
  getBrowserActiveGenomeId
} from '../state/browser-general/browserGeneralSelectors';

type GenomeBrowserIdsContextType = {
  genomeIdInUrl: string | undefined;
  genomeIdForUrl: string | undefined;
  focusObjectIdInUrl: string | null;
  isFetchingGenomeId: boolean;
  isMissingGenomeId: boolean | undefined;
  genomeId: string | undefined;
  focusObjectId: string | undefined;
  focusObjectIdForUrl: string | undefined;
  parsedFocusObjectId:
    | {
        type: string;
        objectId: string;
        genomeId: string;
      }
    | undefined;
  isMalformedFocusObjectId: boolean;
};

export const GenomeBrowserIdsContext = React.createContext<
  GenomeBrowserIdsContextType | undefined
>(undefined);

export const GenomeBrowserIdsProvider = (props: {
  children?: React.ReactNode;
}) => {
  const params = useUrlParams<'genomeId'>('/genome-browser/:genomeId');
  const { genomeId: genomeIdInUrl } = params;

  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId);
  const activeFocusObjectId = useAppSelector(getBrowserActiveFocusObjectId);
  const committedSpecies = useAppSelector((state) =>
    getCommittedSpeciesById(state, activeGenomeId ?? '')
  );
  // TODO: check if the logic below is correct
  const genomeIdForUrl =
    genomeIdInUrl ??
    committedSpecies?.genome_tag ??
    committedSpecies?.genome_id;

  const { search } = useLocation();
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

  return (
    <GenomeBrowserIdsContext.Provider
      value={{
        genomeIdInUrl,
        genomeIdForUrl,
        focusObjectIdInUrl,
        isFetchingGenomeId: isFetching,
        isMissingGenomeId,
        genomeId,
        focusObjectId,
        focusObjectIdForUrl,
        parsedFocusObjectId,
        isMalformedFocusObjectId
      }}
    >
      {props.children}
    </GenomeBrowserIdsContext.Provider>
  );
};
