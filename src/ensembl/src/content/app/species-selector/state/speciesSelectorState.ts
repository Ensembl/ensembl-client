import { LoadingState } from 'src/content/app/species-selector/types/loading-state';
import {
  SearchMatches,
  Strain,
  Assembly,
  CommittedItem
} from 'src/content/app/species-selector/types/species-search';

export type CurrentItem = {
  genome_id: string; // changes every time we update strain or assembly
  reference_genome_id: string | null;
  common_name: string | null;
  scientific_name: string;
  assembly_name: string | null; // name of the selected assembly
  selectedStrainId: string | null; // genome_id of selected strain
  selectedAssemblyId: string; // genome_id of selected assembly; initially same as the genome_id field
  strains: Strain[];
  assemblies: Assembly[];
};

export type SpeciesSelectorState = {
  loadingStates: {
    search: LoadingState;
  };
  ui: {
    isSelectingStrain: boolean;
    isSelectingAssembly: boolean;
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
  ui: {
    isSelectingStrain: false,
    isSelectingAssembly: false
  },
  search: {
    text: '', // FIXME: delete this field?
    results: []
  },
  currentItem: null,
  committedItems: [],
  strains: {},
  assemblies: {}
};

export default initialState;
