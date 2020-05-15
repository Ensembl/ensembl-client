import { restProteinStatsAdaptor } from '../rest-adaptors/rest-protein-adaptor';
import { TranscriptInResponse } from './transcriptData';

export type XrefsInResponse = {
  display_id: string;
}[];

export type ProteinStatsInResponse = {
  pdbs: number;
  ligands: number;
  interaction_partners: number;
  annotations: number;
};

export type UniProtSummaryStats = {
  [key: string]: ProteinStatsInResponse;
};

export type ProteinStats = Pick<
  ProteinStatsInResponse,
  'ligands' | 'annotations'
> & {
  structures: number;
  interactions: number;
};

export const fetchProteinSummaryStats = async (
  transcriptId: string,
  signal?: AbortSignal
): Promise<ProteinStats> => {
  const transcriptUrl = `http://rest.ensembl.org/lookup/id/${transcriptId}?expand=1;content-type=application/json`;
  const transcript: TranscriptInResponse = (await fetch(transcriptUrl, {
    signal
  }).then((response) => response.json())) as TranscriptInResponse;

  const xrefsUrl = `http://rest.ensembl.org/xrefs/id/${transcript.Translation?.id}?content-type=application/json;external_db=Uniprot/SWISSPROT`;
  const xrefsData: XrefsInResponse = (await fetch(xrefsUrl, {
    signal
  }).then((response) => response.json())) as XrefsInResponse;
  const pdbeId = xrefsData[0].display_id;

  const proteinStatsUrl = `https://www.ebi.ac.uk/pdbe/graph-api/uniprot/summary_stats/${pdbeId}`;
  const proteinStatsData: UniProtSummaryStats = (await fetch(proteinStatsUrl, {
    signal
  }).then((response) => response.json())) as UniProtSummaryStats;

  return restProteinStatsAdaptor(proteinStatsData[pdbeId]);
};
