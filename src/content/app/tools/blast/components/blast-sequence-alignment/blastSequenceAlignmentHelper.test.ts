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

import { createBlastSequenceAlignment } from './blastSequenceAlignmentHelper';

const genomicAlignmentData = {
  querySequence:
    'TTCAACAGGAGCAGGAGAACAAAATCCAGTCTCATAGCAGAGGAGAATATAATGTTTACAGCACCTTCCAGAGCCATGAACCAGAGTTTGACTACTTGAAAAGTTTAGAAATAGAAGAAAAGATCAACAAAATTAGGTGGTTACCCC-AGAAAAATGCTGCTCAGTTTTTATTGTCTACCAATGATAAAACAATAAAATTATGGAAAATCAGTGAAAGGGACAAAAGACCAGAAGGGTATAACTTGAAAGAGGAGGATGGAAGGTATAGAGATCCTACTACAGTTACTACACTACGAGTGCCAGTCTTTAGGCCTATGGATCTAATGGTTGAGGCCAGTCCACGAAGAATATTTGCCAATGCTCATACATATCACATCAACTCAATTTCTATTAATAGTGATTATGAAACATATTTATCTGCAGATGATTTGCGGATTAA-------TCTTTGGCATCTGGAAATTACAGACAGGAGTTTTAACATTGTGGATATCAAGCCTGCCAATATGGAAGAGCTAACAGAGGTGATTACAGCAGCAGAATTTCATCCAAACAGCTGTAACACATTTGTATACAGCAGCAGTAAAGGAACTATTCGGCTATGTGACATGAGGGCATCTGCCCTCTGTGATAGACATTCTAAATTGTTTGAAGAACCTGAAGATCCCAGTAACAGGTCATTTTTTTCCGAAATCATCTCCTCTATTTCGGATGTAAAATTCAGCCATAGTGGTCGATATATGATGACTAGAGACTATTTGTCAGTCAAAATTTGGGACTTAAATATGGAAAAC',
  alignmentLine:
    '||||||||||||||  |||||||||||  ||| | |||||| | |||||  |||||||||| ||||| |||| | |||| |||||||||||| |||||||||||||||||| |||||||||| ||||||||  ||||||||| |||  |||||||| |||||||||    ||||||||||||| ||||||||||| |||||||||||||||||||||||||||||||||||||||| ||||||||| ||||||| |||||   || ||||||| | || || | |||| ||||  ||||||||||| |||||||  ||| ||||  ||| |  | || ||||| ||||  || |||||||||||||||   ||||| |||||||||| || ||||||| |||| |||||||||||||||||||| |||||||| ||| ||       |||||||||||||||||||| ||||||||||||||| ||||||||||||||||||| ||||||||||||||||||  |||||||| |||| |||||||| ||||  ||||||| |||||||| |||||  ||||||||||||||||||||| |   |||||||||||| || ||||||||||||||||| || |||| |     |||||||||||| ||| |||||||  |||||||||| || ||||||||||     ||||| || |||||||||||||||||||||| | ||||||||| ||||||| |||||| |||||||| |||| |||| ||||||||||||',
  hitSequence:
    'TTCAACAGGAGCAGATGAACAAAATCCCATCTTA-AGCAGAAGGGAATACCATGTTTACAGGACCTTTCAGAACGATGAGCCAGAGTTTGACCACTTGAAAAGTTTAGAAAGAGAAGAAAAGTTCAACAAAGCTAGGTGGTTTCCCTGAGAAAAATTCTGCTCAGT----ATTGTCTACCAATAATAAAACAATACAATTATGGAAAATCAGTGAAAGGGACAAAAGACCAGAAGGATATAACTTG-AAGAGGAAGATGGGGTGTGTAGAGATGCCACCACGGCTACTGCACTGTGAGTGCCAGTCGTTAGGCCCGTGGGTCTAGGGGTCGCAGTCACTCCACAAAGAGCATCTGCCAATGCTCATACTGGTCACACCAACTCAATTCCTGTTAATAGAGATTTTGAAACATATTTATCTGCAGGTGATTTGCAGATCAAAATCAAGTCTTTGGCATCTGGAAATTATAGACAGGAGTTTTAATATTGTGGATATCAAGCCTGACAATATGGAAGAGCTAAC--AGGTGATTTCAGCCGCAGAATTCCATCTGAACAGCTATAACACATCTGTATCTAGCAGCAGTAAAGGAACTATTTGCTCATGTGACATGAGAGCGTCTGCCCTCTGTGATAGGCA-TCTACA----CTGAAGAACCTGATGATTCCAGTAATGGGTCATTTTTGTCTGAAATCATCT----AATTTCTGACGTAAAATTCAGCCATAGTGGTC-AAATATGATGA-TAGAGACCATTTGTTAGTCAAAAGTTGGAACTTCAATATGGAAAAC',
  queryStart: 10,
  queryEnd: 797,
  hitStart: 1095275,
  hitEnd: 1094499
  // hitLineTitle: "4"
};

describe('createBlastSequenceAlignment', () => {
  it('creates an alignment between a blast sequence and a match', () => {
    const alignment = createBlastSequenceAlignment(genomicAlignmentData);
    console.log(alignment); // eslint-disable-line
  });
});
