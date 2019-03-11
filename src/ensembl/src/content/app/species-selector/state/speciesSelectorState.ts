import { LoadingState } from 'src/content/app/species-selector/types/loading-state';
import { SearchMatch } from 'src/content/app/species-selector/types/species-search';

export type SpeciesSelectorState = {
  loadingStates: {
    autosuggestion: LoadingState;
  };
  autosuggestion: {
    text: string;
    results: SearchMatch[];
  };
};

const initialState: SpeciesSelectorState = {
  loadingStates: {
    autosuggestion: LoadingState.NOT_REQUESTED
  },
  autosuggestion: {
    text: '',
    results: []
  }
};

export default initialState;
