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

import { createContext, type ReactNode } from 'react';
import noop from 'lodash/noop';

import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';

import { useAppSelector } from 'src/store';
import useParsedGenomeBrowserUrl from 'src/content/app/genome-browser/contexts/genome-browser-ids-context/useParsedGenomeBrowserUrl';
import useGenomeBrowserUrlValidator from 'src/content/app/genome-browser/contexts/genome-browser-ids-context/useGenomeBrowserUrlValidator';

import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';
import {
  getBrowserActiveFocusObjectId,
  getBrowserActiveGenomeId
} from '../../state/browser-general/browserGeneralSelectors';

import type { FocusObjectIdConstituents } from 'src/shared/types/focus-object/focusObjectTypes';

type GenomeBrowserIdsContextType = {
  genomeIdInUrl: string | undefined;
  genomeIdForUrl: string | undefined;
  focusObjectIdInUrl: string | null;
  isFetchingGenomeId: boolean;
  isMissingGenomeId: boolean;
  genomeId: string | undefined;
  activeGenomeId: string | null;
  focusObjectId: string | undefined;
  activeFocusObjectId: string | null;
  focusObjectIdForUrl: string | undefined;
  parsedFocusObjectId: FocusObjectIdConstituents | undefined;
  isValidating: boolean;
  doneValidating: boolean;
  isMissingFocusObject: boolean;
  isInvalidLocation: boolean;
  isMalformedFocusObjectId: boolean;
  isMalformedLocation: boolean;
  runAfterValidation: (fn: () => void) => void;
  resetValidator: () => void;
};

const defaultContext: GenomeBrowserIdsContextType = {
  genomeIdInUrl: undefined,
  genomeIdForUrl: undefined,
  focusObjectIdInUrl: null,
  isFetchingGenomeId: false,
  isMissingGenomeId: false,
  genomeId: undefined,
  activeGenomeId: null,
  focusObjectId: undefined,
  activeFocusObjectId: null,
  focusObjectIdForUrl: undefined,
  parsedFocusObjectId: undefined,
  isValidating: false,
  doneValidating: false,
  isMissingFocusObject: false,
  isInvalidLocation: false,
  isMalformedFocusObjectId: false,
  isMalformedLocation: false,
  runAfterValidation: noop,
  resetValidator: noop
};

export const GenomeBrowserIdsContext =
  createContext<GenomeBrowserIdsContextType>(defaultContext);

export const GenomeBrowserIdsProvider = (props: { children?: ReactNode }) => {
  const {
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
  } = useParsedGenomeBrowserUrl();
  const {
    isValidating,
    doneValidating,
    isMissingFocusObject,
    isInvalidLocation,
    runAfterValidation,
    resetValidator
  } = useGenomeBrowserUrlValidator({
    genomeId,
    parsedFocusObjectId,
    parsedLocation,
    hasMalformedLocation: isMalformedLocation
  });

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

  let focusObjectIdForUrl;

  if (focusObjectIdInUrl) {
    focusObjectIdForUrl = focusObjectIdInUrl;
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
        activeGenomeId,
        focusObjectId,
        activeFocusObjectId,
        focusObjectIdForUrl,
        parsedFocusObjectId,
        isMalformedFocusObjectId,
        isMalformedLocation,
        isValidating,
        doneValidating,
        isMissingFocusObject,
        isInvalidLocation,
        runAfterValidation,
        resetValidator
      }}
    >
      {props.children}
    </GenomeBrowserIdsContext.Provider>
  );
};
