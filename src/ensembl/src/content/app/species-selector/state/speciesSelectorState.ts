import { LoadingState } from 'src/content/app/species-selector/types/loading-state';
import { SearchMatch } from 'src/content/app/species-selector/types/species-search';

export type SpeciesSelectorState = {
  loadingStates: {
    search: LoadingState;
  };
  search: {
    text: string;
    results: SearchMatch[];
  };
};

const initialState: SpeciesSelectorState = {
  loadingStates: {
    search: LoadingState.NOT_REQUESTED
  },
  search: {
    text: '',
    results: []
  }
};

export default initialState;
