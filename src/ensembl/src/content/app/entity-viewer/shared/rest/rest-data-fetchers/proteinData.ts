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

import apiService, { APIError } from 'src/services/api-service';

import { restProteinSummaryAdaptor } from '../rest-adaptors/rest-protein-adaptor';

export type Xref = {
  display_id: string;
};

export type XrefsInResponse = Xref[];

export type ProteinStatsInResponse = {
  pdbs: number;
  ligands: number;
  interaction_partners: number;
  annotations: number;
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
};

export type ProteinSummary = {
  proteinStats: ProteinStats;
  pdbeId: string;
};

export const fetchProteinSummary = async (
  proteinId: string,
  signal?: AbortSignal
): Promise<ProteinSummary | null | APIError> => {
  const xrefsUrl = `https://rest.ensembl.org/xrefs/id/${proteinId}?content-type=application/json;external_db=Uniprot/SWISSPROT`;

  let xrefsData: XrefsInResponse | undefined;
  try {
    xrefsData = await apiService.fetch(xrefsUrl, {
      signal
    });
  } catch (error) {
    return {
      error: true,
      message: 'Failed to get data'
    } as APIError;
  }

  if (!xrefsData) {
    return null;
  }

  if (xrefsData[0]) {
    const pdbeId = xrefsData[0].display_id;

    let proteinStatsData: UniProtSummaryStats | undefined;

    try {
      const proteinStatsUrl = `https://www.ebi.ac.uk/pdbe/graph-api/uniprot/summary_stats/${pdbeId}`;

      proteinStatsData = await apiService.fetch(proteinStatsUrl, {
        signal
      });
    } catch (error) {
      return {
        error: true,
        message: 'Failed to get data'
      } as APIError;
    }

    if (!proteinStatsData) {
      return null;
    }

    return restProteinSummaryAdaptor(proteinStatsData[pdbeId], pdbeId);
  } else {
    return null;
  }
};
