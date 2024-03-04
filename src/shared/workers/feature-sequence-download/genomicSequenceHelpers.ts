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

/**
 * Given an exon with its relative start and end coordinates (relative to transcript),
 * and transcript relative start and end coordinates (relative to gene),
 * return start and end coordinates for exon relative to the gene it is in.
 */
export const getExonRelativeLocationInGene = (params: {
  exon: {
    relative_start: number;
    relative_end: number;
  };
  transcript: {
    relative_start: number;
  };
}) => {
  const { transcript, exon } = params;
  const exonStartRelativeToGene =
    transcript.relative_start + exon.relative_start - 1;
  const exonEndRelativeToGene =
    transcript.relative_start + exon.relative_end - 1;

  return {
    start: exonStartRelativeToGene,
    end: exonEndRelativeToGene
  };
};
