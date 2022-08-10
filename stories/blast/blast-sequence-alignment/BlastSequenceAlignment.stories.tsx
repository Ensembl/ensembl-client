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

import React from 'react';

import BlastSequenceAlignment from 'src/content/app/tools/blast/components/blast-sequence-alignment/BlastSequenceAlignment';

import { blastJob } from './sampleData';

// first hsp of the third hit is in the reverse direction to the query
// you can change the next line to use the first hit in order to view a match going in the same direction as the query
const hit = blastJob.result.hits[2];
const firstHspData = hit.hit_hsps[0];

export const BlastSequenceAlignmentStory = () => {
  const alignmentData = {
    querySequence: firstHspData.hsp_qseq,
    hitSequence: firstHspData.hsp_hseq,
    alignmentLine: firstHspData.hsp_mseq,
    queryStart: firstHspData.hsp_query_from,
    queryEnd: firstHspData.hsp_query_to,
    hitStart: firstHspData.hsp_hit_from,
    hitEnd: firstHspData.hsp_hit_to,
    hitId: hit.hit_acc
  };

  return (
    <BlastSequenceAlignment alignment={alignmentData} blastDatabase="dna" />
  );
};

BlastSequenceAlignmentStory.storyName = 'default';

export default {
  title: 'Components/Blast/BlastSequenceAlignment'
};
