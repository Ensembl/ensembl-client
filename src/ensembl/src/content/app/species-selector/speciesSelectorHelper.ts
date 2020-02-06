import {
  CommittedItem,
  PopularSpecies
} from 'src/content/app/species-selector/types/species-search';
import { CurrentItem } from 'src/content/app/species-selector/state/speciesSelectorState';
import { SearchMatch } from 'src/content/app/species-selector/types/species-search';

export const getSpeciesAnalyticsName = (
  species: CommittedItem | CurrentItem | PopularSpecies | SearchMatch
) => {
  return `${species.common_name || species.scientific_name} - ${
    species.assembly_name
  }`;
};
