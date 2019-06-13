import { RootState } from 'src/store';
import { GenomeInfo } from './genomeTypes';

export const getGenomeInfo = (state: RootState) =>
  state.genome.genomeInfo.genomeInfoData as GenomeInfo;

export const getGenomeInfoFetching = (state: RootState) =>
  state.genome.genomeInfo.genomeInfoFetching;

export const getGenomeInfoFetchFailed = (state: RootState) =>
  state.genome.genomeInfo.genomeInfoFetchFailed;

export const getGenomeTrackCategories = (state: RootState) =>
  state.genome.genomeTrackCategories.genomeTrackCategoriesData;

export const getGenomeTrackCategoriesFetching = (state: RootState) =>
  state.genome.genomeTrackCategories.genomeTrackCategoriesFetching;

export const getGenomeTrackCategoriesFetchFailed = (state: RootState) =>
  state.genome.genomeTrackCategories.genomeTrackCategoriesFetchFailed;

export const getGenomeExampleEnsObjects = (state: RootState) =>
  state.genome.genomeExampleEnsObjects.genomeExampleEnsObjectsData;

export const getGenomeExampleEnsObjectsFetching = (state: RootState) =>
  state.genome.genomeExampleEnsObjects.genomeExampleEnsObjectsFetching;

export const getGenomeExampleEnsObjectsFetchFailed = (state: RootState) =>
  state.genome.genomeExampleEnsObjects.genomeExampleEnsObjectsFetchFailed;
