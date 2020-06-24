import {
  ProteinStatsInResponse,
  ProteinStats
} from '../rest-data-fetchers/proteinData';

export const restProteinStatsAdaptor = (
  proteinStats: ProteinStatsInResponse
): ProteinStats => ({
  structuresCount: proteinStats.pdbs,
  ligandsCount: proteinStats.ligands,
  interactionsCount: proteinStats.interaction_partners,
  annotationsCount: proteinStats.annotations
});
