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

type GenomeInHomology = {
  genome_id: string;
  common_name: string;
  scientific_name: string;
  assembly: {
    accession_id: string;
    name: string;
    url: string;
  };
};

type GeneInHomology = {
  stable_id: string;
  symbol: string | null;
  version: number | null;
  unversioned_stable_id: string;
};

type GeneHomologyStatistics = {
  query_percent_id: number;
  query_percent_coverage: number;
  target_percent_id: number;
  target_percent_coverage: number;
};

export type GeneHomology = {
  target_genome: GenomeInHomology;
  target_gene: GeneInHomology;
  query_genome: GenomeInHomology;
  query_gene: GeneInHomology;
  type: 'homology';
  subtype: string;
  stats: GeneHomologyStatistics;
};
