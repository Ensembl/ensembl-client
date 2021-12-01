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

import apiService from 'src/services/api-service';

import { restProteinSummaryAdaptor } from '../rest-adaptors/rest-protein-adaptor';

export type ProteinStatsInResponse = {
  pdbs: number;
  ligands: number;
  interaction_partners: number;
  annotations: number;
  similar_proteins: number;
};

export type ProteinAcessionInResponse = {
  protein: {
    recommendedName: {
      fullName: string;
    };
  };
};

export type UniProtSummaryStats = {
  [key: string]: ProteinStatsInResponse;
};

export type ProteinStats = {
  structuresCount: number;
  ligandsCount: number;
  interactionsCount: number;
  annotationsCount: number;
  similarProteinsCount: number;
};

export const fetchProteinSummaryStats = async (
  xrefId: string,
  signal?: AbortSignal
): Promise<ProteinStats | null> => {
  const proteinStatsUrl = `https://www.ebi.ac.uk/pdbe/graph-api/uniprot/summary_stats/${xrefId}`;

  const proteinStatsData: UniProtSummaryStats | undefined =
    await apiService.fetch(proteinStatsUrl, {
      signal
    });
  if (!proteinStatsData) {
    return null;
  }

  return restProteinSummaryAdaptor(proteinStatsData[xrefId]);
};
