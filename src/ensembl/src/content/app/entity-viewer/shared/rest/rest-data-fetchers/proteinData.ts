/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

export type ProteinStats = {
  structuresCount: number;
  ligandsCount: number;
  interactionsCount: number;
  annotationsCount: number;
};

export const fetchProteinSummaryStats = async (
  transcriptId: string,
  signal?: AbortSignal
): Promise<ProteinStats | null> => {
  const transcriptUrl = `https://rest.ensembl.org/lookup/id/${transcriptId}?expand=1;content-type=application/json`;
  const transcript: TranscriptInResponse = await fetch(transcriptUrl, {
    signal
  }).then((response) => response.json());

  const xrefsUrl = `https://rest.ensembl.org/xrefs/id/${transcript.Translation?.id}?content-type=application/json;external_db=Uniprot/SWISSPROT`;
  const xrefsData: XrefsInResponse = await fetch(xrefsUrl, {
    signal
  }).then((response) => response.json());

  if (xrefsData[0]) {
    const pdbeId = xrefsData[0].display_id;

    const proteinStatsUrl = `https://www.ebi.ac.uk/pdbe/graph-api/uniprot/summary_stats/${pdbeId}`;
    const proteinStatsData: UniProtSummaryStats = await fetch(proteinStatsUrl, {
      signal
    }).then((response) => response.json());

    return restProteinStatsAdaptor(proteinStatsData[pdbeId]);
  } else {
    return null;
  }
};
