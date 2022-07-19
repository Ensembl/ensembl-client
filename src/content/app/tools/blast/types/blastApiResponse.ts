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

export type BlastApiResponse = {
  result: {
    hits: Hit[];
  };
};

type Hit = HSP[];

type HSP = {
  hsp_score: number;
  hsp_bit_score: number;
  hsp_expect: number;
  hsp_align_len: number;
  hsp_identity: number;
  hsp_positive: number;
  hsp_gaps: number;
  hsp_query_frame: string;
  hsp_hit_frame: string;
  hsp_strand: string;
  hsp_query_from: number;
  hsp_query_to: number;
  hsp_hit_from: number;
  hsp_hit_to: number;
  hsp_qseq: string;
  hsp_mseq: string;
  hsp_hseq: string;
};
