import { LoadingState } from 'src/content/app/species-selector/types/loading-state';
import {
  SearchMatch,
  SearchMatches,
  Strain,
  Assembly,
  CommittedItem
} from 'src/content/app/species-selector/types/species-search';

type CurrentItem = {
  searchMatch: SearchMatch;
  selectedStrain: Strain | null; // or should it be strain id?
  selectedAssembly: Assembly | null; // or should it be just assembly's display name? Also, there will always be at least one assembly, right?
};

export type SpeciesSelectorState = {
  loadingStates: {
    search: LoadingState;
  };
  search: {
    text: string;
    results: SearchMatches[];
  };
  currentItem: CurrentItem | null;
  committedItems: CommittedItem[];
  strains: {
    [key: string]: Strain[]; // where key is the name of the parent/reference species
  };
  assemblies: {
    [key: string]: Assembly[]; // where key is the identifier of currently selected species
  };
};

const initialState: SpeciesSelectorState = {
  loadingStates: {
    search: LoadingState.NOT_REQUESTED
  },
  search: {
    text: '',
    results: []
  },
  currentItem: null,
  committedItems: [],
  strains: {},
  assemblies: {}
};

export default initialState;
