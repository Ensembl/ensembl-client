import { GenomeInfo, GenomeTrackCategory } from './genomeTypes';
import { EnsObject } from 'src/ens-object/ensObjectTypes';

export type GenomeInfoState = Readonly<{
  genomeInfoData: GenomeInfo | {};
  genomeInfoFetchFailed: boolean;
  genomeInfoFetching: boolean;
}>;

export const defaultGenomeInfoState: GenomeInfoState = {
  genomeInfoData: {},
  genomeInfoFetchFailed: false,
  genomeInfoFetching: false
};

export type GenomeTrackCategoriesState = Readonly<{
  genomeTrackCategoriesData: GenomeTrackCategory[];
  genomeTrackCategoriesFetchFailed: boolean;
  genomeTrackCategoriesFetching: boolean;
}>;

export const defaultGenomeTrackCategoriesState: GenomeTrackCategoriesState = {
  genomeTrackCategoriesData: [],
  genomeTrackCategoriesFetchFailed: false,
  genomeTrackCategoriesFetching: false
};

export type GenomeExampleEnsObjectsState = Readonly<{
  genomeExampleEnsObjectsData: EnsObject[];
  genomeExampleEnsObjectsFetchFailed: boolean;
  genomeExampleEnsObjectsFetching: boolean;
}>;

export const defaultGenomeExampleEnsObjectsState: GenomeExampleEnsObjectsState = {
  genomeExampleEnsObjectsData: [],
  genomeExampleEnsObjectsFetchFailed: false,
  genomeExampleEnsObjectsFetching: false
};
