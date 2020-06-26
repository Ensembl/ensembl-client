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

import { useEffect, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { replace } from 'connected-react-router';
import { useSelector, useDispatch } from 'react-redux';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { getQueryParamsMap } from 'src/global/globalHelper';
import {
  buildFocusIdForUrl,
  parseFocusIdFromUrl,
  buildEnsObjectId,
  parseEnsObjectId
} from 'src/shared/state/ens-object/ensObjectHelpers';
import { getChrLocationFromStr, getChrLocationStr } from '../browserHelper';

import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import {
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObjectIds,
  getAllChrLocations
} from '../browserSelectors';

import {
  changeBrowserLocation,
  changeFocusObject,
  setDataFromUrlAndSave
} from '../browserActions';

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
  const params: { [key: string]: string } = useParams();
  const { search } = useLocation(); // from document.location provided by the router
  const dispatch = useDispatch();

  const { genomeId } = params;
  const { focus = null, location = null } = getQueryParamsMap(search);

  const activeGenomeId = useSelector(getBrowserActiveGenomeId);
  const committedSpecies = useSelector(getEnabledCommittedSpecies);
  const allChrLocations = useSelector(getAllChrLocations);
  const allActiveEnsObjectIds = useSelector(getBrowserActiveEnsObjectIds);
  const activeEnsObjectId = genomeId ? allActiveEnsObjectIds[genomeId] : null;
  const newFocusId = focus ? buildNewEnsObjectId(genomeId, focus) : null;
  const chrLocation = location ? getChrLocationFromStr(location) : null;

  useEffect(() => {
    if (!genomeId) {
      // handling navigation to /browser
      // select either the species that the user viewed during the previous visit,
      // of the first selected species
      const selectedSpecies = committedSpecies.find(
        ({ genome_id }) => genome_id === activeGenomeId
      );
      const firstCommittedSpecies = committedSpecies[0];
      if (selectedSpecies) {
        changeGenomeId(selectedSpecies.genome_id);
      } else if (firstCommittedSpecies) {
        changeGenomeId(firstCommittedSpecies.genome_id);
      }
      return;
    }

    const payload = {
      activeGenomeId: genomeId,
      activeEnsObjectId: newFocusId,
      chrLocation
    };

    if (!focus && activeEnsObjectId) {
      const newFocus = buildFocusIdForUrl(parseEnsObjectId(activeEnsObjectId));
      dispatch(replace(urlFor.browser({ genomeId, focus: newFocus })));
    } else if (focus && !chrLocation) {
      /*
       changeFocusObject needs to be called before setDataFromUrlAndSave
       in order to prevent creating a previouslyViewedObject entry
       for the focus object that is viewed first.
       */
      dispatch(changeFocusObject(newFocusId as string));
    } else if (focus && chrLocation) {
      dispatch(
        changeBrowserLocation({
          genomeId,
          ensObjectId: newFocusId,
          chrLocation
        })
      );
    } else if (chrLocation) {
      dispatch(
        changeBrowserLocation({
          genomeId,
          ensObjectId: newFocusId,
          chrLocation
        })
      );
    }

    dispatch(setDataFromUrlAndSave(payload));
  }, [genomeId, focus, location]);

  const changeGenomeId = useCallback(
    (genomeId: string) => {
      const chrLocation = allChrLocations[genomeId];
      const activeEnsObjectId = allActiveEnsObjectIds[genomeId];
      const focusIdForUrl = activeEnsObjectId
        ? buildFocusIdForUrl(activeEnsObjectId)
        : null;

      const params = {
        genomeId,
        focus: focusIdForUrl,
        location: chrLocation ? getChrLocationStr(chrLocation) : null
      };

      dispatch(replace(urlFor.browser(params)));
    },
    [genomeId]
  );

  return {
    genomeId,
    focusId: newFocusId,
    chrLocation,
    changeGenomeId
  };
};

const buildNewEnsObjectId = (genomeId: string, focusFromUrl: string) => {
  const parsedFocus = parseFocusIdFromUrl(focusFromUrl);
  return buildEnsObjectId({ genomeId, ...parsedFocus });
};

export default useBrowserRouting;
