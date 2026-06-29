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

import { useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import isEqual from 'lodash/isEqual';

import { useAppSelector, useAppDispatch, type RootState } from 'src/store';
import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';
import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';
import usePrevious from 'src/shared/hooks/usePrevious';

import * as urlFor from 'src/shared/helpers/urlHelper';
import {
  getChrLocationFromStr,
  getChrLocationStr
} from '../helpers/browserHelper';
import {
  buildFocusIdForUrl,
  parseFocusObjectId,
  parseFocusIdFromUrl
} from 'src/shared/helpers/focusObjectHelpers';

import { setDataFromUrlAndSave } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import { fetchFocusObject } from 'src/content/app/genome-browser/state/focus-object/focusObjectSlice';

import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';
import { getBrowserActiveFocusObjectIds } from '../state/browser-general/browserGeneralSelectors';
import { getFocusObjectById } from 'src/content/app/genome-browser/state/focus-object/focusObjectSelectors';
import { getAllChrLocations } from '../state/browser-general/browserGeneralSelectors';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';
import type { ChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';

/*
 * Possible urls that the GenomeBrowser page has to deal with:
 * - /browser (no genome id selected)
 * - /browser/:genome_id (no focus object or location selected)
 * - /browser/:genome_id?focus=:focus_object_id (no location selected)
 * - /browser/:genome_id?focus=:focus_object_id&location=:location_id
 *
 * We are not dealing with urls where genome id and location id are defined, but focus id isn't
 *
 *  NOTE: focus id in the url has the format <type>:<id>;
 *  but internally in the app we will use the focus id format that is <genome_id>:<type>:<id>
 *  because without the genome id the focus id is not unique enough to be used as key in our Redux store
 */

const useBrowserRouting = () => {
  const firstRenderRef = useRef(true);
  const {
    genomeId,
    focusObjectId,
    genomeIdInUrl,
    focusObjectIdInUrl,
    activeGenomeId,
    activeFocusObjectId,
    genomeIdForUrl,
    isFetchingGenomeId,
    runAfterValidation
  } = useGenomeBrowserIds();
  const focusObject = useAppSelector((state: RootState) =>
    getFocusObjectById(state, activeFocusObjectId || '')
  );
  const { genomeBrowser, changeFocusObject, changeBrowserLocation } =
    useGenomeBrowser();
  const { search, state: locationState } = useLocation(); // from document.location provided by the router
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const dispatch = useAppDispatch();

  const urlSearchParams = new URLSearchParams(search);
  const location = urlSearchParams.get('location') || null;
  const isUrlUpdatedByGenomeBrowser =
    locationState?.updateSource === 'genome-browser'; // State set in useGenomeBrowserPosition hook

  const allCommittedSpecies = useAppSelector(getEnabledCommittedSpecies);
  const allChrLocations = useAppSelector(getAllChrLocations);
  const allActiveFocusObjectIds = useAppSelector(
    getBrowserActiveFocusObjectIds
  );

  const chrLocation = location ? getParsedChromosomeLocation(location) : null;
  const previousGenomeId = usePrevious(genomeId);
  const previousFocusObjectIdInUrl = usePrevious(focusObjectIdInUrl);
  const previousChrLocation = usePrevious(chrLocation);

  const changeGenomeId = useCallback(
    (genomeId: string) => {
      const species = allCommittedSpecies.find(
        (species) => species.genome_id === genomeId
      ) as CommittedItem;
      const genomeIdForUrl = species.genome_tag ?? species.genome_id;
      const chrLocation = allChrLocations[genomeId];
      const activeFocusObjectId = allActiveFocusObjectIds[genomeId];
      const focusIdForUrl = activeFocusObjectId
        ? buildFocusIdForUrl(activeFocusObjectId)
        : null;

      const nextUrlParams = {
        genomeId: genomeIdForUrl,
        focus: focusIdForUrl,
        location: chrLocation ? getChrLocationStr(chrLocation) : null
      };

      // Consider it as first render when we change genome
      firstRenderRef.current = true;

      // In case the url is simply /genome-browser, use the `replace` history method to redirect the user further.
      // This will allow the user to return from the next page (genome browser with genome id selected)
      // back to the page from which they have navigated to the current one. If the `push` method is used,
      // the user will not be able to get back past this page, because the url without genome id will remain
      // in the history, and the user will be forcefully redirected to the url with the genome id.
      //
      // NOTE: the logic will likely change in the future when /genome-browser without the selected genome id
      // becomes a valid searchable page in its own right.

      navigate(urlFor.browser(nextUrlParams), { replace: !genomeIdInUrl });
    },
    [
      genomeIdInUrl,
      allActiveFocusObjectIds,
      allChrLocations,
      allCommittedSpecies,
      navigate
    ]
  );

  const areSameParameters = ({
    genomeId,
    previousGenomeId,
    focusObjectIdInUrl,
    previousFocusObjectIdInUrl,
    chrLocation,
    previousChrLocation
  }: {
    genomeId: string | undefined;
    previousGenomeId: string | undefined;
    focusObjectIdInUrl: string | null;
    previousFocusObjectIdInUrl: string | null;
    chrLocation: ChrLocation | null | undefined;
    previousChrLocation: ChrLocation | null | undefined;
  }) => {
    return (
      genomeId === previousGenomeId &&
      focusObjectIdInUrl === previousFocusObjectIdInUrl &&
      JSON.stringify(chrLocation) === JSON.stringify(previousChrLocation)
    );
  };

  const shouldUpdateRedux = useCallback(() => {
    return (
      genomeId !== activeGenomeId ||
      focusObjectId !== activeFocusObjectId ||
      !isEqual(chrLocation, allChrLocations[activeGenomeId])
    );
  }, [
    genomeId,
    activeGenomeId,
    focusObjectId,
    activeFocusObjectId,
    chrLocation,
    allChrLocations
  ]);

  useEffect(() => {
    if (!genomeIdInUrl) {
      // handling navigation to /browser
      // select either the species that the user viewed during the previous visit,
      // or the first selected species
      const selectedSpecies = allCommittedSpecies.find(
        ({ genome_id }) => genome_id === activeGenomeId
      );
      const firstCommittedSpecies = allCommittedSpecies[0];
      if (selectedSpecies) {
        changeGenomeId(selectedSpecies.genome_id);
      } else if (firstCommittedSpecies) {
        changeGenomeId(firstCommittedSpecies.genome_id);
      }
      return;
    } else if (isFetchingGenomeId) {
      // don't do anything while the real genome id is being fetched from the backend
      return;
    }

    const payload = {
      activeGenomeId: genomeId,
      activeFocusObjectId: focusObjectId,
      chrLocation
    };

    if (
      !focusObjectIdInUrl &&
      genomeId === activeGenomeId &&
      activeFocusObjectId
    ) {
      const newFocus = buildFocusIdForUrl(
        parseFocusObjectId(activeFocusObjectId)
      );

      navigate(urlFor.browser({ genomeId: genomeIdForUrl, focus: newFocus }), {
        replace: true
      });
    } else if (focusObjectId && !chrLocation && genomeBrowser) {
      /*
       changeFocusObject needs to be called before setDataFromUrlAndSave
       because it will also try to bookmark the Ensembl object that is stored in redux state
       before it gets changed by setDataFromUrlAndSave
      */
      changeFocusObject(focusObjectId);
    } else if (focusObjectIdInUrl && chrLocation && genomeBrowser) {
      const sameAsPrev = areSameParameters({
        genomeId,
        previousGenomeId,
        focusObjectIdInUrl,
        previousFocusObjectIdInUrl,
        chrLocation,
        previousChrLocation
      });

      const isFirstRender = firstRenderRef.current;

      if ((isFirstRender && genomeId) || (!sameAsPrev && genomeId)) {
        // ignore url updates triggered by messages from the genome browser
        if (!(navigationType === 'REPLACE' && isUrlUpdatedByGenomeBrowser)) {
          const { type, objectId } = parseFocusIdFromUrl(focusObjectIdInUrl);
          changeBrowserLocation({
            genomeId,
            chrLocation,
            focus: {
              type,
              id: objectId
            }
          });
        }
      }
      if (isFirstRender) {
        firstRenderRef.current = false;
        runAfterValidation(() => {
          dispatch(setDataFromUrlAndSave(payload));
        });
        return;
      }
    }

    if (shouldUpdateRedux()) {
      runAfterValidation(() => {
        dispatch(setDataFromUrlAndSave(payload));
      });
    }
  }, [
    genomeId,
    previousGenomeId,
    activeGenomeId,
    activeFocusObjectId,
    allChrLocations,
    allCommittedSpecies,
    changeBrowserLocation,
    changeFocusObject,
    changeGenomeId,
    chrLocation,
    previousChrLocation,
    genomeIdForUrl,
    genomeIdInUrl,
    runAfterValidation,
    isFetchingGenomeId,
    focusObjectIdInUrl,
    previousFocusObjectIdInUrl,
    focusObjectId,
    genomeBrowser,
    shouldUpdateRedux,
    dispatch,
    navigate,
    location,
    navigationType,
    isUrlUpdatedByGenomeBrowser
  ]);

  useEffect(() => {
    if (!focusObject && activeFocusObjectId) {
      dispatch(fetchFocusObject(activeFocusObjectId));
    }
  }, [focusObject, activeFocusObjectId, dispatch]);

  return {
    changeGenomeId
  };
};

const getParsedChromosomeLocation = (locationStr: string | null) => {
  try {
    if (locationStr) {
      return getChrLocationFromStr(locationStr);
    }
  } catch {
    return null;
  }
};

export default useBrowserRouting;
