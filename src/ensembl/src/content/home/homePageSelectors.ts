import * as urlFor from 'src/shared/helpers/urlHelper';
import { getChrLocationStr } from 'src/content/app/browser/browserHelper';

import {
  getBrowserActiveEnsObjectIds,
  getAllChrLocations
} from 'src/content/app/browser/browserSelectors';
import { getEnsObjectById } from 'src/ens-object/ensObjectSelectors';
import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import { RootState } from 'src/store';
import { EnsObject } from 'src/ens-object/ensObjectTypes';

export const getPreviouslyViewedGenomeBrowserObjects = (state: RootState) => {
  const ensObjectIdsMap = getBrowserActiveEnsObjectIds(state);
  const chrLocations = getAllChrLocations(state);
  const committedSpecies = getCommittedSpecies(state);

  const genomeIds = Object.keys(ensObjectIdsMap);

  const ensObjectMap: { [genomeId: string]: EnsObject } = Object.keys(
    ensObjectIdsMap
  ).reduce((result, genomeId) => {
    const ensObjectId = ensObjectIdsMap[genomeId];
    const ensObject = getEnsObjectById(state, ensObjectId);
    if (!ensObject) {
      return result;
    } else {
      return {
        ...result,
        [genomeId]: ensObject
      };
    }
  }, {});

  console.log('ensObjectMap', ensObjectMap);

  return Object.keys(ensObjectMap).map((id) => ({
    ensObjectLabel: ensObjectMap[id].label,
    link: urlFor.browser({
      genomeId: id,
      focus: ensObjectMap[id].object_id,
      location: getChrLocationStr(chrLocations[id])
    })
  }));
};
