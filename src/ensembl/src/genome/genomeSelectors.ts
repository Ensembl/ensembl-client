import { RootState } from 'src/store';
import { GenomeInfo, GenomeInfoData } from './genomeTypes';
import { getBrowserActiveGenomeId } from 'src/content/app/browser/browserSelectors';

export const getGenomeInfo = (state: RootState) =>
  state.genome.genomeInfo.genomeInfoData as GenomeInfoData;

export const getGenomeInfoById = (
  state: RootState,
  genomeId: string
): GenomeInfo | null => {
  const allGenomesInfo = getGenomeInfo(state);
  return allGenomesInfo[genomeId] || null;
};

export const getGenomeInfoFetching = (state: RootState) =>
  state.genome.genomeInfo.genomeInfoFetching;

export const getGenomeInfoFetchFailed = (state: RootState) =>
  state.genome.genomeInfo.genomeInfoFetchFailed;

export const getGenomeTrackCategories = (state: RootState) =>
  state.genome.genomeTrackCategories.genomeTrackCategoriesData;

export const getGenomeTrackCategoriesById = (
  state: RootState,
  genomeId: string
) =>
  state.genome.genomeTrackCategories.genomeTrackCategoriesData[genomeId] || [];

export const getGenomeTrackCategoriesFetching = (state: RootState) =>
  state.genome.genomeTrackCategories.genomeTrackCategoriesFetching;

export const getGenomeTrackCategoriesFetchFailed = (state: RootState) =>
  state.genome.genomeTrackCategories.genomeTrackCategoriesFetchFailed;

export const getGenomeKaryotypes = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);
  return activeGenomeId
    ? state.genome.genomeKaryotypes.genomeKaryotypesData[activeGenomeId]
    : null;
};

export const getGenomeKaryotypesFetching = (state: RootState) =>
  state.genome.genomeKaryotypes.genomeKaryotypesFetching;

export const getGenomeKaryotypesFetchFailed = (state: RootState) =>
  state.genome.genomeKaryotypes.genomeKaryotypesFetchFailed;
