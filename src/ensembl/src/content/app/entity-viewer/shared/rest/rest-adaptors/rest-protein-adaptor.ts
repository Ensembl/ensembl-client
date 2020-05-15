import { ProteinStatsInResponse } from '../rest-data-fetchers/proteinData';

export const restProteinStatsAdaptor = (
  proteinStats: ProteinStatsInResponse
) => ({
  structures: proteinStats.pdbs,
  ligands: proteinStats.ligands,
  interactions: proteinStats.interaction_partners,
  annotations: proteinStats.annotations
});
