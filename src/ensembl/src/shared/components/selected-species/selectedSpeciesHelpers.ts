import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

export const getDisplayName = (species: CommittedItem) =>
  species.common_name || species.scientific_name;
