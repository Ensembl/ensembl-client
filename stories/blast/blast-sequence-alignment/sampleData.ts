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

export const blastJob = {
  result: {
    program: 'blastn',
    version: 'BLASTN 2.12.0+',
    command:
      '$APPBIN/ncbi-blast-2.9.0+/bin/blastn -db &quot;ensembl/homo_sapiens_GCA_000001405_14/dna/homo_sapiens_GCA_000001405_14.dna.toplevel&quot; -query ncbiblast-R20220809-093334-0601-51526838-np2.sequence  -task blastn -num_threads 32 -outfmt 11 -out ncbiblast-R20220809-093334-0601-51526838-np2.archive -max_target_seqs 50 -evalue 10 -reward 1 -penalty -3 -max_hsps 100 -gapopen 5 -gapextend 2 -dust yes -word_size 11',
    query_def:
      'ENST00000380737.8 Ensembl Transcript chromosome:GRCh38:8:1:145138636:1',
    query_db: 'ENST00000380737.8 Ensembl Transcript chromosome',
    query_id: 'NA',
    query_acc: 'NA',
    query_desc: 'NA',
    query_url: 'NA',
    query_os: 'NA',
    query_stype: 'nucleotide',
    query_len: 3923,
    db_count: 1,
    db_num: 297,
    db_len: 32036512383,
    dbs: [
      {
        name: 'ensembl/homo_sapiens_GCA_000001405_14/dna/homo_sapiens_GCA_000001405_14.dna.toplevel',
        stype: 'nucleotide',
        created: '2022-06-16T02:02:00+01:00'
      }
    ],
    alignments: 50,
    scores: 50,
    expect_upper: 10,
    filter: 'T',
    gap_extend: 2,
    gap_open: 5,
    start: '2022-08-09T09:33:34+01:00',
    end: '2022-08-09T09:38:37+01:00',
    search: 'P0Y0M0DT0H0M303.000S',
    hits: [
      {
        hit_num: 1,
        hit_def: 'EG:8 dna:chromosome chromosome:GRCh37:8:1:146364022:1 REF',
        hit_db: 'EG',
        hit_id: '8',
        hit_acc: '8',
        hit_desc: 'dna:chromosome chromosome:GRCh37:8:1:146364022:1 REF',
        hit_url: '',
        hit_xref_url: '',
        hit_os: 'NA',
        hit_len: 146364022,
        hit_hsps: [
          {
            hsp_num: 1,
            hsp_score: 2551,
            hsp_bit_score: 5057.48,
            hsp_expect: 0,
            hsp_align_len: 2551,
            hsp_identity: 100,
            hsp_positive: 100,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 1373,
            hsp_query_to: 3923,
            hsp_hit_from: 26227646,
            hsp_hit_to: 26230196,
            hsp_qseq:
              'ACAGTGTTGTCATGACTGGATCTTACAATAATTTCTTCAGAATGTTTGACAGAAACACAAAGCGAGACATAACCCTAGAAGCATCGCGGGAAAACAATAAGCCTCGCACAGTTCTGAAGCCTCGCAAAGTCTGTGCAAGTGGCAAGCGAAAGAAAGATGAAATAAGTGTTGACAGCCTAGACTTCAATAAGAAAATCCTTCACACAGCCTGGCACCCCAAGGAAAATATCATTGCCGTAGCTACTACAAACAATCTGTATATATTTCAAGACAAAGTGAATTAGGGTTGGCATTCCTAGCAGAAGAACCCACTTCCTGCTTAGTTGAGATAGTTGAATCTAGCATTCGTTCCTATAAAAGAGAGAGGTCCATTGTGGCGCCCCTTTCCAGTGTTTGACAGTGTGCCATTCGACAACACATTGTTATAGCTACATGGAGAAAGCTCTGTGGATTCATCACTGTGGTGTTCTCCATGTCTGCTAGCCATTTAGGTAAGGGTAGGGCACTTTTAATTTAAATGACTTCTTGCACCATCTTGCCTAATGGACTAGATTGGACTGTATCAACATTGATTTACTCCACTTTTTATGCCTTCCATTGTGATGACGTCAAACACAGTGAAAGCCTTCAGTCATGCTATGGGATTTAATTGTGTATCCTCATTACTGTATCATTTGTGGGGTACACCCCTTCCCCCTTTTTTTAAATTAAATACAGCTCATTCTTACTGTGGCTTGTAGCATTCCTCCTCTTCTGGCCTCCTGGACTGCTCCCCTTCATCTCTTACCCTTGCCCCCTCCACCCGGTCTTGGTGGTGGTATATTAAAAAAAGAAAGAATGAAAGCACACAAAATGAGTCAGTTTGGGGTCAGTGGTATAAAGGGGGTATATGTTGCAAACAAATGTTTTAGTAACAGTTGGCTGTAATCACTCCTCGCCGTGTCTGGCACTGAAAATAAGGAAAAAAAACCTACTACTGAATAAAAGTGACAAAGAATGGAGAATCTGGTTTTCTTTTTCTTTTTAACCTACCTCTTGTAGCCAATATTTTGTGTCATACCTTTGGGCACAGTGAAACAAAATGGGTTTTCATTGTTTATTGGTATTTTTGTTAATTATTTTTAACAAGTGTTCTTTTACATGCAGGAGGAGAGGTATTGGTTCTCTATGAACATATTTTGAATATAGGTTTTATTAAGGATTTCACAATCTATAAATGCTACTAGTTTTTTTTTTTTTTTTTACCATCATGAGGGTATTGGATACATTGTGTCTCTATTTAACTCATTATGTGTTAATGAAATTGTTGTAAATGGGAACCAAATTTGTAGAACTTAATTTCTACTTTTTAGAGTGCTTAATTTCATTTTTGCCTTACTAAATAGTCAAAGACTTATAAAACATTTTTAACAAGTTAGAACTTTTTTGTTATTCAGTCATATAAAATAGCAGAAAACTAACATCAAGTGACACTGCACTAAATACTTTTTTTGTATTTTACTGCTATCAAATCAGAATGAAATATACTTTACCATAGATATTTTTCTTCTATTTTTGGTTTTCCAAAGCTATATGAAAGACAAATTTTTAAAGGTACAGCGTTCAAAAAGTGCTTAATGAACTCCAACAGCTGCCTCAAATAAAAATCTGTATATGAATACATTTTCCCTAAGCGGTGATACATTATCCAAAGATGAAGAGTGCTCCTATTTTTAATAGGTAGAATGTACCTTTGTCAGTCTTGCAGAAACTTTAATGGAGAAGAAATGGACTTTATTTTTGAAAGGTGAAATGAACAGGCATTTATATTATTAGAGAATGGTAGTCTTATTTTGGTGGAACATAATGTAACAACCTTGAATTTCAGAGGACTCTGAGTGCTTCTATGTCCACTACCTATTGTTCTATTCTTCAATAATGAAAAAGAATTCAACGAGCCGACCGTGATTCCCTCTACTACAAATATTATGTCTTGTAAGTTAGCATTTTTAGCACACAGGAGAAATTTTATGTAATAAAATTACTGTATCTTTTGGATTTAACAAATTTGTATTTGAAACACATTCTATGTCTGATAATTCTTAATGGCACTTTTACTAATTTATTTGGGGATCTTGGGTACATTCTTAATTTGTGTTTATTCTTCACGCTTGACTTGCAAGTGGGATATTCCCCTGCCACAAGTGTCAAACAGTGATATTCTTCCTGTGTTGTGACTGGACAGTTTTCCAGATCTTTTTTGGGAGATTTTCCTACAGCTTGGTTGTATGTCTTGAGATAACACCACCAAACAGCTCTCAGAAATTCTTTTTTGATTGATCAGTAGCTATGATGATTCTCCTCCATGACACTAAGGATTAGTTTATATATTTAAGAGAAATAATTGCTAAAATTAAAATGCCTCTATCAAGGAATGCTATTATAAATTATTGTTAACATTCTCAAGTATTAATTTTTTAATTTCATTGGTGTAGCAAACTCTAAGCCCAGCCACTCATTTTACATGGCCATGGTTAATCTTTTTATTAATAAAAATTATACTTAGAATAAA',
            hsp_mseq:
              '|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||',
            hsp_hseq:
              'ACAGTGTTGTCATGACTGGATCTTACAATAATTTCTTCAGAATGTTTGACAGAAACACAAAGCGAGACATAACCCTAGAAGCATCGCGGGAAAACAATAAGCCTCGCACAGTTCTGAAGCCTCGCAAAGTCTGTGCAAGTGGCAAGCGAAAGAAAGATGAAATAAGTGTTGACAGCCTAGACTTCAATAAGAAAATCCTTCACACAGCCTGGCACCCCAAGGAAAATATCATTGCCGTAGCTACTACAAACAATCTGTATATATTTCAAGACAAAGTGAATTAGGGTTGGCATTCCTAGCAGAAGAACCCACTTCCTGCTTAGTTGAGATAGTTGAATCTAGCATTCGTTCCTATAAAAGAGAGAGGTCCATTGTGGCGCCCCTTTCCAGTGTTTGACAGTGTGCCATTCGACAACACATTGTTATAGCTACATGGAGAAAGCTCTGTGGATTCATCACTGTGGTGTTCTCCATGTCTGCTAGCCATTTAGGTAAGGGTAGGGCACTTTTAATTTAAATGACTTCTTGCACCATCTTGCCTAATGGACTAGATTGGACTGTATCAACATTGATTTACTCCACTTTTTATGCCTTCCATTGTGATGACGTCAAACACAGTGAAAGCCTTCAGTCATGCTATGGGATTTAATTGTGTATCCTCATTACTGTATCATTTGTGGGGTACACCCCTTCCCCCTTTTTTTAAATTAAATACAGCTCATTCTTACTGTGGCTTGTAGCATTCCTCCTCTTCTGGCCTCCTGGACTGCTCCCCTTCATCTCTTACCCTTGCCCCCTCCACCCGGTCTTGGTGGTGGTATATTAAAAAAAGAAAGAATGAAAGCACACAAAATGAGTCAGTTTGGGGTCAGTGGTATAAAGGGGGTATATGTTGCAAACAAATGTTTTAGTAACAGTTGGCTGTAATCACTCCTCGCCGTGTCTGGCACTGAAAATAAGGAAAAAAAACCTACTACTGAATAAAAGTGACAAAGAATGGAGAATCTGGTTTTCTTTTTCTTTTTAACCTACCTCTTGTAGCCAATATTTTGTGTCATACCTTTGGGCACAGTGAAACAAAATGGGTTTTCATTGTTTATTGGTATTTTTGTTAATTATTTTTAACAAGTGTTCTTTTACATGCAGGAGGAGAGGTATTGGTTCTCTATGAACATATTTTGAATATAGGTTTTATTAAGGATTTCACAATCTATAAATGCTACTAGTTTTTTTTTTTTTTTTTACCATCATGAGGGTATTGGATACATTGTGTCTCTATTTAACTCATTATGTGTTAATGAAATTGTTGTAAATGGGAACCAAATTTGTAGAACTTAATTTCTACTTTTTAGAGTGCTTAATTTCATTTTTGCCTTACTAAATAGTCAAAGACTTATAAAACATTTTTAACAAGTTAGAACTTTTTTGTTATTCAGTCATATAAAATAGCAGAAAACTAACATCAAGTGACACTGCACTAAATACTTTTTTTGTATTTTACTGCTATCAAATCAGAATGAAATATACTTTACCATAGATATTTTTCTTCTATTTTTGGTTTTCCAAAGCTATATGAAAGACAAATTTTTAAAGGTACAGCGTTCAAAAAGTGCTTAATGAACTCCAACAGCTGCCTCAAATAAAAATCTGTATATGAATACATTTTCCCTAAGCGGTGATACATTATCCAAAGATGAAGAGTGCTCCTATTTTTAATAGGTAGAATGTACCTTTGTCAGTCTTGCAGAAACTTTAATGGAGAAGAAATGGACTTTATTTTTGAAAGGTGAAATGAACAGGCATTTATATTATTAGAGAATGGTAGTCTTATTTTGGTGGAACATAATGTAACAACCTTGAATTTCAGAGGACTCTGAGTGCTTCTATGTCCACTACCTATTGTTCTATTCTTCAATAATGAAAAAGAATTCAACGAGCCGACCGTGATTCCCTCTACTACAAATATTATGTCTTGTAAGTTAGCATTTTTAGCACACAGGAGAAATTTTATGTAATAAAATTACTGTATCTTTTGGATTTAACAAATTTGTATTTGAAACACATTCTATGTCTGATAATTCTTAATGGCACTTTTACTAATTTATTTGGGGATCTTGGGTACATTCTTAATTTGTGTTTATTCTTCACGCTTGACTTGCAAGTGGGATATTCCCCTGCCACAAGTGTCAAACAGTGATATTCTTCCTGTGTTGTGACTGGACAGTTTTCCAGATCTTTTTTGGGAGATTTTCCTACAGCTTGGTTGTATGTCTTGAGATAACACCACCAAACAGCTCTCAGAAATTCTTTTTTGATTGATCAGTAGCTATGATGATTCTCCTCCATGACACTAAGGATTAGTTTATATATTTAAGAGAAATAATTGCTAAAATTAAAATGCCTCTATCAAGGAATGCTATTATAAATTATTGTTAACATTCTCAAGTATTAATTTTTTAATTTCATTGGTGTAGCAAACTCTAAGCCCAGCCACTCATTTTACATGGCCATGGTTAATCTTTTTATTAATAAAAATTATACTTAGAATAAA'
          },
          {
            hsp_num: 2,
            hsp_score: 320,
            hsp_bit_score: 634.846,
            hsp_expect: 9.7e-178,
            hsp_align_len: 320,
            hsp_identity: 100,
            hsp_positive: 100,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 1,
            hsp_query_to: 320,
            hsp_hit_from: 26149024,
            hsp_hit_to: 26149343,
            hsp_qseq:
              'AGGCCAGCCGGCGCCATTTTGAAAGTGGAGTCGCCTGCCCCTGCCGCTGCCGCCGCCGCCGTCGCTGTCGTAGTCGCCGCCGCCGCTGCCGGAGAAAGAGCACGAGCGGGGAAGCCCCAGAGTGAAATCTAGCATCCTGCCGGCTGGTCTGCCCGCCCCTCCTTCCTTTTCCCCCCGGCCCCCGTCCCCTCCCCCCGCAGGTGCCATCCGCCGCCATCCGCCCTCTCTACCCCCCCATCCCCAGGTGAGGGGGGTGAGTTCAGGAAGCGGAGACCCCGAGGAACCCAGCAGGGTCACCATTTGCAGCGCAACATGGCAGG',
            hsp_mseq:
              '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||',
            hsp_hseq:
              'AGGCCAGCCGGCGCCATTTTGAAAGTGGAGTCGCCTGCCCCTGCCGCTGCCGCCGCCGCCGTCGCTGTCGTAGTCGCCGCCGCCGCTGCCGGAGAAAGAGCACGAGCGGGGAAGCCCCAGAGTGAAATCTAGCATCCTGCCGGCTGGTCTGCCCGCCCCTCCTTCCTTTTCCCCCCGGCCCCCGTCCCCTCCCCCCGCAGGTGCCATCCGCCGCCATCCGCCCTCTCTACCCCCCCATCCCCAGGTGAGGGGGGTGAGTTCAGGAAGCGGAGACCCCGAGGAACCCAGCAGGGTCACCATTTGCAGCGCAACATGGCAGG'
          },
          {
            hsp_num: 3,
            hsp_score: 178,
            hsp_bit_score: 353.352,
            hsp_expect: 5.3e-93,
            hsp_align_len: 178,
            hsp_identity: 100,
            hsp_positive: 100,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 772,
            hsp_query_to: 949,
            hsp_hit_from: 26218490,
            hsp_hit_to: 26218667,
            hsp_qseq:
              'GTGCCAGTCTTTAGGCCTATGGATCTAATGGTTGAGGCCAGTCCACGAAGAATATTTGCCAATGCTCATACATATCACATCAACTCAATTTCTATTAATAGTGATTATGAAACATATTTATCTGCAGATGATTTGCGGATTAATCTTTGGCATCTGGAAATTACAGACAGGAGTTTTA',
            hsp_mseq:
              '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||',
            hsp_hseq:
              'GTGCCAGTCTTTAGGCCTATGGATCTAATGGTTGAGGCCAGTCCACGAAGAATATTTGCCAATGCTCATACATATCACATCAACTCAATTTCTATTAATAGTGATTATGAAACATATTTATCTGCAGATGATTTGCGGATTAATCTTTGGCATCTGGAAATTACAGACAGGAGTTTTA'
          },
          {
            hsp_num: 4,
            hsp_score: 172,
            hsp_bit_score: 341.458,
            hsp_expect: 2e-89,
            hsp_align_len: 172,
            hsp_identity: 100,
            hsp_positive: 100,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 1115,
            hsp_query_to: 1286,
            hsp_hit_from: 26221237,
            hsp_hit_to: 26221408,
            hsp_qseq:
              'TGTTTGAAGAACCTGAAGATCCCAGTAACAGGTCATTTTTTTCCGAAATCATCTCCTCTATTTCGGATGTAAAATTCAGCCATAGTGGTCGATATATGATGACTAGAGACTATTTGTCAGTCAAAATTTGGGACTTAAATATGGAAAACAGGCCTGTGGAAACATACCAGGT',
            hsp_mseq:
              '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||',
            hsp_hseq:
              'TGTTTGAAGAACCTGAAGATCCCAGTAACAGGTCATTTTTTTCCGAAATCATCTCCTCTATTTCGGATGTAAAATTCAGCCATAGTGGTCGATATATGATGACTAGAGACTATTTGTCAGTCAAAATTTGGGACTTAAATATGGAAAACAGGCCTGTGGAAACATACCAGGT'
          },
          {
            hsp_num: 5,
            hsp_score: 168,
            hsp_bit_score: 333.528,
            hsp_expect: 4.9e-87,
            hsp_align_len: 168,
            hsp_identity: 100,
            hsp_positive: 100,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 491,
            hsp_query_to: 658,
            hsp_hit_from: 26211982,
            hsp_hit_to: 26212149,
            hsp_qseq:
              'AGAACAAAATCCAGTCTCATAGCAGAGGAGAATATAATGTTTACAGCACCTTCCAGAGCCATGAACCAGAGTTTGACTACTTGAAAAGTTTAGAAATAGAAGAAAAGATCAACAAAATTAGGTGGTTACCCCAGAAAAATGCTGCTCAGTTTTTATTGTCTACCAATG',
            hsp_mseq:
              '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||',
            hsp_hseq:
              'AGAACAAAATCCAGTCTCATAGCAGAGGAGAATATAATGTTTACAGCACCTTCCAGAGCCATGAACCAGAGTTTGACTACTTGAAAAGTTTAGAAATAGAAGAAAAGATCAACAAAATTAGGTGGTTACCCCAGAAAAATGCTGCTCAGTTTTTATTGTCTACCAATG'
          },
          {
            hsp_num: 6,
            hsp_score: 165,
            hsp_bit_score: 327.581,
            hsp_expect: 3.1e-85,
            hsp_align_len: 165,
            hsp_identity: 100,
            hsp_positive: 100,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 950,
            hsp_query_to: 1114,
            hsp_hit_from: 26220200,
            hsp_hit_to: 26220364,
            hsp_qseq:
              'ACATTGTGGATATCAAGCCTGCCAATATGGAAGAGCTAACAGAGGTGATTACAGCAGCAGAATTTCATCCAAACAGCTGTAACACATTTGTATACAGCAGCAGTAAAGGAACTATTCGGCTATGTGACATGAGGGCATCTGCCCTCTGTGATAGACATTCTAAAT',
            hsp_mseq:
              '|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||',
            hsp_hseq:
              'ACATTGTGGATATCAAGCCTGCCAATATGGAAGAGCTAACAGAGGTGATTACAGCAGCAGAATTTCATCCAAACAGCTGTAACACATTTGTATACAGCAGCAGTAAAGGAACTATTCGGCTATGTGACATGAGGGCATCTGCCCTCTGTGATAGACATTCTAAAT'
          },
          {
            hsp_num: 7,
            hsp_score: 116,
            hsp_bit_score: 230.446,
            hsp_expect: 5.3e-56,
            hsp_align_len: 116,
            hsp_identity: 100,
            hsp_positive: 100,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 658,
            hsp_query_to: 773,
            hsp_hit_from: 26217684,
            hsp_hit_to: 26217799,
            hsp_qseq:
              'GATAAAACAATAAAATTATGGAAAATCAGTGAAAGGGACAAAAGACCAGAAGGGTATAACTTGAAAGAGGAGGATGGAAGGTATAGAGATCCTACTACAGTTACTACACTACGAGT',
            hsp_mseq:
              '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||',
            hsp_hseq:
              'GATAAAACAATAAAATTATGGAAAATCAGTGAAAGGGACAAAAGACCAGAAGGGTATAACTTGAAAGAGGAGGATGGAAGGTATAGAGATCCTACTACAGTTACTACACTACGAGT'
          },
          {
            hsp_num: 8,
            hsp_score: 100,
            hsp_bit_score: 198.728,
            hsp_expect: 1.9e-46,
            hsp_align_len: 100,
            hsp_identity: 100,
            hsp_positive: 100,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 393,
            hsp_query_to: 492,
            hsp_hit_from: 26196404,
            hsp_hit_to: 26196503,
            hsp_qseq:
              'AGCAGATATAATTTCTACAGTAGAATTTAATCATTCTGGAGAATTACTAGCAACAGGAGATAAAGGTGGTAGAGTTGTCATCTTTCAACAGGAGCAGGAG',
            hsp_mseq:
              '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||',
            hsp_hseq:
              'AGCAGATATAATTTCTACAGTAGAATTTAATCATTCTGGAGAATTACTAGCAACAGGAGATAAAGGTGGTAGAGTTGTCATCTTTCAACAGGAGCAGGAG'
          },
          {
            hsp_num: 9,
            hsp_score: 96,
            hsp_bit_score: 190.799,
            hsp_expect: 4.6e-44,
            hsp_align_len: 96,
            hsp_identity: 100,
            hsp_positive: 100,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 1281,
            hsp_query_to: 1376,
            hsp_hit_from: 26223827,
            hsp_hit_to: 26223922,
            hsp_qseq:
              'CCAGGTGCATGAATACCTCAGAAGTAAACTCTGTTCACTGTATGAAAATGACTGCATATTTGACAAATTTGAATGTTGTTGGAATGGATCTGACAG',
            hsp_mseq:
              '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||',
            hsp_hseq:
              'CCAGGTGCATGAATACCTCAGAAGTAAACTCTGTTCACTGTATGAAAATGACTGCATATTTGACAAATTTGAATGTTGTTGGAATGGATCTGACAG'
          },
          {
            hsp_num: 10,
            hsp_score: 78,
            hsp_bit_score: 155.117,
            hsp_expect: 2.5e-33,
            hsp_align_len: 78,
            hsp_identity: 100,
            hsp_positive: 100,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 317,
            hsp_query_to: 394,
            hsp_hit_from: 26151179,
            hsp_hit_to: 26151256,
            hsp_qseq:
              'CAGGAGCTGGAGGAGGGAATGATATTCAGTGGTGTTTTTCTCAGGTGAAAGGAGCAGTAGATGATGATGTAGCAGAAG',
            hsp_mseq:
              '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||',
            hsp_hseq:
              'CAGGAGCTGGAGGAGGGAATGATATTCAGTGGTGTTTTTCTCAGGTGAAAGGAGCAGTAGATGATGATGTAGCAGAAG'
          }
        ]
      },
      {
        hit_num: 2,
        hit_def: 'EG:13 dna:chromosome chromosome:GRCh37:13:1:115169878:1 REF',
        hit_db: 'EG',
        hit_id: '13',
        hit_acc: '13',
        hit_desc: 'dna:chromosome chromosome:GRCh37:13:1:115169878:1 REF',
        hit_url: '',
        hit_xref_url: '',
        hit_os: 'NA',
        hit_len: 115169878,
        hit_hsps: [
          {
            hsp_num: 1,
            hsp_score: 326,
            hsp_bit_score: 646.74,
            hsp_expect: 0,
            hsp_align_len: 412,
            hsp_identity: 95.6,
            hsp_positive: 95.6,
            hsp_gaps: 1,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 1965,
            hsp_query_to: 2373,
            hsp_hit_from: 45095411,
            hsp_hit_to: 45095819,
            hsp_qseq:
              'TTCCATTGTGATGACGTCAAACACAGTGAAAGCCTTCAGTCATGCTATGGGATTTAATTGTGTATCCTCATTACTGTATCATTTGTGGGGTACACCCCTTCCCCCTTTTTTT-AAATTAAATACAGCTCATTCTTACTGTGGCTTGTAGCATTCCTCCTCTTCTGGCCTCCTGGACTGCTCCCCTTCATCTC--TTACCCTTGCCCCCTCCACCCGGTCTTGGTGGTGGTATATTAAAAAAAGAAAGAATGAAAGCACACAAAATGAGTCAGTTTGGGGTCAGTGGTATAAAGGGGGTATATGTTGCAAACAAATGTTTTAGTAACAGTTGGCTGTAATCACTCCTCGCCGTGTCTGGCACTGAAAATAAGGAAAAAAAACCTACTACTGAATAAAAGTGACAAAGAATGGA',
            hsp_mseq:
              '|||||||||||||| |||||||||||||||||| |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| |||||||||||||||||||||||||||||||||||||||||| ||||||||||||||||||||| ||||||||||||||  |||||||||||||||||||||||||||| | |||||||||||||||||||||||||||||||||| ||||||||||||||||||||||||||||||||||||||||||||||  ||||||||||||| |||||||||||||||||||||||||||| ||||||||||||||||||||| ||||||| |  ||||||||||||||||||||||||||||',
            hsp_hseq:
              'TTCCATTGTGATGATGTCAAACACAGTGAAAGCTTTCAGTCATGCTATGGGATTTAATTGTGTATCCTCATTACTGTATCATTTGTGGGGTACACCCCTTCCCCCTTTTTTTTAAATTAAATACAGCTCATTCTTACTGTGGCTTGTAGCATTCC-CCTCTTCTGGCCTCCTGGACTCCTCCCCTTCATCTCTCTTACCCTTGCCCCCTCCACCCGGTCTTGATAGTGGTATATTAAAAAAAGAAAGAATGAAAGCACATAAAATGAGTCAGTTTGGGGTCAGTGGTATAAAGGGGGTATATGTTGTGAACAAATGTTTTAATAACAGTTGGCTGTAATCACTCCTCGCCATGTCTGGCACTGAAAATAAGGGAAAAAAAAC--CTACTGAATAAAAGTGACAAAGAATGGA'
          },
          {
            hsp_num: 2,
            hsp_score: 22,
            hsp_bit_score: 44.1047,
            hsp_expect: 6.6,
            hsp_align_len: 26,
            hsp_identity: 96.2,
            hsp_positive: 96.2,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '-1',
            hsp_strand: 'plus/minus',
            hsp_query_from: 2390,
            hsp_query_to: 2415,
            hsp_hit_from: 61431583,
            hsp_hit_to: 61431558,
            hsp_qseq: 'TTCTTTTTAACCTACCTCTTGTAGCC',
            hsp_mseq: '|||||||||||||||||||| |||||',
            hsp_hseq: 'TTCTTTTTAACCTACCTCTTTTAGCC'
          },
          {
            hsp_num: 3,
            hsp_score: 22,
            hsp_bit_score: 44.1047,
            hsp_expect: 6.6,
            hsp_align_len: 30,
            hsp_identity: 93.3,
            hsp_positive: 93.3,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '-1',
            hsp_strand: 'plus/minus',
            hsp_query_from: 3015,
            hsp_query_to: 3044,
            hsp_hit_from: 108791517,
            hsp_hit_to: 108791488,
            hsp_qseq: 'AAAATCTGTATATGAATACATTTTCCCTAA',
            hsp_mseq: '|||||||||||||||| ||||| |||||||',
            hsp_hseq: 'AAAATCTGTATATGAAAACATTATCCCTAA'
          }
        ]
      },
      {
        hit_num: 3,
        hit_def: 'EG:4 dna:chromosome chromosome:GRCh37:4:1:191154276:1 REF',
        hit_db: 'EG',
        hit_id: '4',
        hit_acc: '4',
        hit_desc: 'dna:chromosome chromosome:GRCh37:4:1:191154276:1 REF',
        hit_url: '',
        hit_xref_url: '',
        hit_os: 'NA',
        hit_len: 191154276,
        hit_hsps: [
          {
            hsp_num: 1,
            hsp_score: 282,
            hsp_bit_score: 559.517,
            hsp_expect: 4.6e-155,
            hsp_align_len: 862,
            hsp_identity: 84,
            hsp_positive: 84,
            hsp_gaps: 3,
            hsp_query_frame: '1',
            hsp_hit_frame: '-1',
            hsp_strand: 'plus/minus',
            hsp_query_from: 410,
            hsp_query_to: 1263,
            hsp_hit_from: 1095341,
            hsp_hit_to: 1094499,
            hsp_qseq:
              'CAGTAGAATTTAATCATTCTGGAGAATTACTAGCAACAGGAGATAAAGGTGGTAGAGTTGTCATCTTTCAACAGGAGCAGGAGAACAAAATCCAGTCTCATAGCAGAGGAGAATATAATGTTTACAGCACCTTCCAGAGCCATGAACCAGAGTTTGACTACTTGAAAAGTTTAGAAATAGAAGAAAAGATCAACAAAATTAGGTGGTTACCCC-AGAAAAATGCTGCTCAGTTTTTATTGTCTACCAATGATAAAACAATAAAATTATGGAAAATCAGTGAAAGGGACAAAAGACCAGAAGGGTATAACTTGAAAGAGGAGGATGGAAGGTATAGAGATCCTACTACAGTTACTACACTACGAGTGCCAGTCTTTAGGCCTATGGATCTAATGGTTGAGGCCAGTCCACGAAGAATATTTGCCAATGCTCATACATATCACATCAACTCAATTTCTATTAATAGTGATTATGAAACATATTTATCTGCAGATGATTTGCGGATTAA-------TCTTTGGCATCTGGAAATTACAGACAGGAGTTTTAACATTGTGGATATCAAGCCTGCCAATATGGAAGAGCTAACAGAGGTGATTACAGCAGCAGAATTTCATCCAAACAGCTGTAACACATTTGTATACAGCAGCAGTAAAGGAACTATTCGGCTATGTGACATGAGGGCATCTGCCCTCTGTGATAGACATTCTAAATTGTTTGAAGAACCTGAAGATCCCAGTAACAGGTCATTTTTTTCCGAAATCATCTCCTCTATTTCGGATGTAAAATTCAGCCATAGTGGTCGATATATGATGACTAGAGACTATTTGTCAGTCAAAATTTGGGACTTAAATATGGAAAAC',
            hsp_mseq:
              '|||||||| ||| |||||||||||||||| ||| ||| ||||||| |||||| |||||  | ||| ||||||||||||||  |||||||||||  ||| | |||||| | |||||  |||||||||| ||||| |||| | |||| |||||||||||| |||||||||||||||||| |||||||||| ||||||||  ||||||||| |||  |||||||| |||||||||    ||||||||||||| ||||||||||| |||||||||||||||||||||||||||||||||||||||| ||||||||| ||||||| |||||   || ||||||| | || || | |||| ||||  ||||||||||| |||||||  ||| ||||  ||| |  | || ||||| ||||  || |||||||||||||||   ||||| |||||||||| || ||||||| |||| |||||||||||||||||||| |||||||| ||| ||       |||||||||||||||||||| ||||||||||||||| ||||||||||||||||||| ||||||||||||||||||  |||||||| |||| |||||||| ||||  ||||||| |||||||| |||||  ||||||||||||||||||||| |   |||||||||||| || ||||||||||||||||| || |||| |     |||||||||||| ||| |||||||  |||||||||| || ||||||||||     ||||| || |||||||||||||||||||||| | ||||||||| ||||||| |||||| |||||||| |||| |||| ||||||||||||',
            hsp_hseq:
              'CAGTAGAACTTATTCATTCTGGAGAATTAGTAGGAACTGGAGATACAGGTGGCAGAGTCATAATCCTTCAACAGGAGCAGATGAACAAAATCCCATCTTA-AGCAGAAGGGAATACCATGTTTACAGGACCTTTCAGAACGATGAGCCAGAGTTTGACCACTTGAAAAGTTTAGAAAGAGAAGAAAAGTTCAACAAAGCTAGGTGGTTTCCCTGAGAAAAATTCTGCTCAGT----ATTGTCTACCAATAATAAAACAATACAATTATGGAAAATCAGTGAAAGGGACAAAAGACCAGAAGGATATAACTTG-AAGAGGAAGATGGGGTGTGTAGAGATGCCACCACGGCTACTGCACTGTGAGTGCCAGTCGTTAGGCCCGTGGGTCTAGGGGTCGCAGTCACTCCACAAAGAGCATCTGCCAATGCTCATACTGGTCACACCAACTCAATTCCTGTTAATAGAGATTTTGAAACATATTTATCTGCAGGTGATTTGCAGATCAAAATCAAGTCTTTGGCATCTGGAAATTATAGACAGGAGTTTTAATATTGTGGATATCAAGCCTGACAATATGGAAGAGCTAAC--AGGTGATTTCAGCCGCAGAATTCCATCTGAACAGCTATAACACATCTGTATCTAGCAGCAGTAAAGGAACTATTTGCTCATGTGACATGAGAGCGTCTGCCCTCTGTGATAGGCA-TCTACA----CTGAAGAACCTGATGATTCCAGTAATGGGTCATTTTTGTCTGAAATCATCT----AATTTCTGACGTAAAATTCAGCCATAGTGGTC-AAATATGATGA-TAGAGACCATTTGTTAGTCAAAAGTTGGAACTTCAATATGGAAAAC'
          },
          {
            hsp_num: 2,
            hsp_score: 47,
            hsp_bit_score: 93.6635,
            hsp_expect: 8e-15,
            hsp_align_len: 203,
            hsp_identity: 82.3,
            hsp_positive: 82.3,
            hsp_gaps: 4,
            hsp_query_frame: '1',
            hsp_hit_frame: '-1',
            hsp_strand: 'plus/minus',
            hsp_query_from: 1354,
            hsp_query_to: 1555,
            hsp_hit_from: 1094090,
            hsp_hit_to: 1093895,
            hsp_qseq:
              'TGTTGTTGGAATGGATCTGACAGTGTTGTCATGACTGGATCTTA-CAATAATTTCTTCAGAATGTTTGACAGAAACACAAAGCGAGACATAACCCTAGAAGCATCGCGGGAAAACAATAAGCCTCGCACAGTTCTGAAGCCTCGCAAAGTCTGTGCAAGTGGCAAGCGAAAGAAAGATGAAATAAGTGTTGACAGCCTAGACT',
            hsp_mseq:
              '||||||||||||||||||||| |||||||   |||||| ||||| ||||||||||   |||||||||||||| |||||||| | |||| |||| ||||||| ||| ||||||| || ||||||| | ||  ||||||| ||  ||||||||    || |  |||||| |||| |||||||||| ||||||||||||| |||||',
            hsp_hseq:
              'TGTTGTTGGAATGGATCTGACGGTGTTGT---GACTGGGTCTTAACAATAATTTC---AGAATGTTTGACAGGAACACAAAACAAGACCTAACGCTAGAAGTATCACGGGAAAGCAGTAAGCCTGGTACGATTCTGAAACCGTGCAAAGTCCACACAGGCAGCAAGCAAAAG-AAGATGAAATTAGTGTTGACAGCCGAGACT'
          },
          {
            hsp_num: 3,
            hsp_score: 36,
            hsp_bit_score: 71.8576,
            hsp_expect: 2.9e-8,
            hsp_align_len: 80,
            hsp_identity: 88.8,
            hsp_positive: 88.8,
            hsp_gaps: 2,
            hsp_query_frame: '1',
            hsp_hit_frame: '-1',
            hsp_strand: 'plus/minus',
            hsp_query_from: 313,
            hsp_query_to: 392,
            hsp_hit_from: 1095496,
            hsp_hit_to: 1095419,
            hsp_qseq:
              'ATGGCAGGAGCTGGAGGAGGGAATGATATTCAGTGGTGTTTTTCTCAGGTGAAAGGAGCAGTAGATGATGATGTAGCAGA',
            hsp_mseq:
              '||||||||||||||||||||| |||| | ||||| | |  |||||||||||||||||||| ||||||| |||||||||||',
            hsp_hseq:
              'ATGGCAGGAGCTGGAGGAGGG-ATGACACTCAGTAGAG-GTTTCTCAGGTGAAAGGAGCAATAGATGACGATGTAGCAGA'
          },
          {
            hsp_num: 4,
            hsp_score: 27,
            hsp_bit_score: 54.0164,
            hsp_expect: 0.0069,
            hsp_align_len: 75,
            hsp_identity: 84,
            hsp_positive: 84,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '-1',
            hsp_strand: 'plus/minus',
            hsp_query_from: 1973,
            hsp_query_to: 2047,
            hsp_hit_from: 1093541,
            hsp_hit_to: 1093467,
            hsp_qseq:
              'TGATGACGTCAAACACAGTGAAAGCCTTCAGTCATGCTATGGGATTTAATTGTGTATCCTCATTACTGTATCATT',
            hsp_mseq:
              '||||||||||| || |||  || ||||||||||| ||| || ||||||| | ||||||||| |||||||| ||||',
            hsp_hseq:
              'TGATGACGTCAGACGCAGCAAAGGCCTTCAGTCACGCTGTGAGATTTAACTATGTATCCTCGTTACTGTACCATT'
          },
          {
            hsp_num: 5,
            hsp_score: 24,
            hsp_bit_score: 48.0694,
            hsp_expect: 0.42,
            hsp_align_len: 56,
            hsp_identity: 85.7,
            hsp_positive: 85.7,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '-1',
            hsp_strand: 'plus/minus',
            hsp_query_from: 1117,
            hsp_query_to: 1172,
            hsp_hit_from: 6335456,
            hsp_hit_to: 6335401,
            hsp_qseq:
              'TTTGAAGAACCTGAAGATCCCAGTAACAGGTCATTTTTTTCCGAAATCATCTCCTC',
            hsp_mseq:
              '|||||||| ||||| || ||||||||| | ||||| || || ||||||||||||||',
            hsp_hseq: 'TTTGAAGAGCCTGAGGACCCCAGTAACCGCTCATTCTTCTCGGAAATCATCTCCTC'
          },
          {
            hsp_num: 6,
            hsp_score: 22,
            hsp_bit_score: 44.1047,
            hsp_expect: 6.6,
            hsp_align_len: 62,
            hsp_identity: 83.9,
            hsp_positive: 83.9,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '-1',
            hsp_strand: 'plus/minus',
            hsp_query_from: 1528,
            hsp_query_to: 1589,
            hsp_hit_from: 6325169,
            hsp_hit_to: 6325108,
            hsp_qseq:
              'GATGAAATAAGTGTTGACAGCCTAGACTTCAATAAGAAAATCCTTCACACAGCCTGGCACCC',
            hsp_mseq:
              '||||| || ||||| |||||| | |||||||  ||||| ||||| ||||| |||||||||||',
            hsp_hseq:
              'GATGACATCAGTGTGGACAGCTTGGACTTCACCAAGAAGATCCTGCACACGGCCTGGCACCC'
          },
          {
            hsp_num: 7,
            hsp_score: 22,
            hsp_bit_score: 44.1047,
            hsp_expect: 6.6,
            hsp_align_len: 38,
            hsp_identity: 89.5,
            hsp_positive: 89.5,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '-1',
            hsp_strand: 'plus/minus',
            hsp_query_from: 532,
            hsp_query_to: 569,
            hsp_hit_from: 6380260,
            hsp_hit_to: 6380223,
            hsp_qseq: 'TACAGCACCTTCCAGAGCCATGAACCAGAGTTTGACTA',
            hsp_mseq: '|||||||| ||||||||||| || || |||||||||||',
            hsp_hseq: 'TACAGCACTTTCCAGAGCCACGAGCCGGAGTTTGACTA'
          },
          {
            hsp_num: 8,
            hsp_score: 22,
            hsp_bit_score: 44.1047,
            hsp_expect: 6.6,
            hsp_align_len: 22,
            hsp_identity: 100,
            hsp_positive: 100,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 3898,
            hsp_query_to: 3919,
            hsp_hit_from: 30978904,
            hsp_hit_to: 30978925,
            hsp_qseq: 'TTAATAAAAATTATACTTAGAA',
            hsp_mseq: '||||||||||||||||||||||',
            hsp_hseq: 'TTAATAAAAATTATACTTAGAA'
          }
        ]
      },
      {
        hit_num: 4,
        hit_def: 'EG:10 dna:chromosome chromosome:GRCh37:10:1:135534747:1 REF',
        hit_db: 'EG',
        hit_id: '10',
        hit_acc: '10',
        hit_desc: 'dna:chromosome chromosome:GRCh37:10:1:135534747:1 REF',
        hit_url: '',
        hit_xref_url: '',
        hit_os: 'NA',
        hit_len: 135534747,
        hit_hsps: [
          {
            hsp_num: 1,
            hsp_score: 66,
            hsp_bit_score: 131.328,
            hsp_expect: 3.7e-26,
            hsp_align_len: 142,
            hsp_identity: 86.6,
            hsp_positive: 86.6,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 517,
            hsp_query_to: 658,
            hsp_hit_from: 133753559,
            hsp_hit_to: 133753700,
            hsp_qseq:
              'GGAGAATATAATGTTTACAGCACCTTCCAGAGCCATGAACCAGAGTTTGACTACTTGAAAAGTTTAGAAATAGAAGAAAAGATCAACAAAATTAGGTGGTTACCCCAGAAAAATGCTGCTCAGTTTTTATTGTCTACCAATG',
            hsp_mseq:
              '|||||||||||||||||||||||||| || || |||||||| ||||||||||| ||||||||| ||||||| || ||||| || || ||||||||||||||||| ||  | ||||||||||| ||| || ||||||| ||||',
            hsp_hseq:
              'GGAGAATATAATGTTTACAGCACCTTTCAAAGTCATGAACCGGAGTTTGACTATTTGAAAAGTCTAGAAATTGAGGAAAAAATTAATAAAATTAGGTGGTTACCACAACAGAATGCTGCTCATTTTCTACTGTCTACAAATG'
          },
          {
            hsp_num: 2,
            hsp_score: 44,
            hsp_bit_score: 87.7165,
            hsp_expect: 4.9e-13,
            hsp_align_len: 80,
            hsp_identity: 88.8,
            hsp_positive: 88.8,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 658,
            hsp_query_to: 737,
            hsp_hit_from: 133754085,
            hsp_hit_to: 133754164,
            hsp_qseq:
              'GATAAAACAATAAAATTATGGAAAATCAGTGAAAGGGACAAAAGACCAGAAGGGTATAACTTGAAAGAGGAGGATGGAAG',
            hsp_mseq:
              '|||||||| ||||||||||||||||| |||||| |||| |||||| ||||||| |||||| ||||||| || ||||||||',
            hsp_hseq:
              'GATAAAACTATAAAATTATGGAAAATAAGTGAACGGGATAAAAGAGCAGAAGGTTATAACCTGAAAGACGAAGATGGAAG'
          },
          {
            hsp_num: 3,
            hsp_score: 40,
            hsp_bit_score: 79.787,
            hsp_expect: 1.2e-10,
            hsp_align_len: 248,
            hsp_identity: 79,
            hsp_positive: 79,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 1117,
            hsp_query_to: 1364,
            hsp_hit_from: 133761036,
            hsp_hit_to: 133761283,
            hsp_qseq:
              'TTTGAAGAACCTGAAGATCCCAGTAACAGGTCATTTTTTTCCGAAATCATCTCCTCTATTTCGGATGTAAAATTCAGCCATAGTGGTCGATATATGATGACTAGAGACTATTTGTCAGTCAAAATTTGGGACTTAAATATGGAAAACAGGCCTGTGGAAACATACCAGGTGCATGAATACCTCAGAAGTAAACTCTGTTCACTGTATGAAAATGACTGCATATTTGACAAATTTGAATGTTGTTGGAA',
            hsp_mseq:
              '|||||||| |||||||||||||| |  ||||| || || || ||||| || || || || || |||||||||||||| |||||||| || || |||||||| ||||||||  |||| || ||  | |||||| | || ||||| | |||||| ||||| ||  ||||||| || || |||||  | || || ||||| || || ||||| || |||||||| |||||||| ||||| ||||| |||||',
            hsp_hseq:
              'TTTGAAGAGCCTGAAGATCCCAGCAGTAGGTCCTTCTTCTCAGAAATAATTTCATCCATATCCGATGTAAAATTCAGTCATAGTGGGCGGTACATGATGACCAGAGACTACCTGTCGGTGAAGGTGTGGGACCTCAACATGGAGAGCAGGCCGGTGGAGACCCACCAGGTCCACGAGTACCTGCGCAGCAAGCTCTGCTCTCTCTATGAGAACGACTGCATCTTTGACAAGTTTGAGTGTTGCTGGAA'
          },
          {
            hsp_num: 4,
            hsp_score: 37,
            hsp_bit_score: 73.84,
            hsp_expect: 7.4e-9,
            hsp_align_len: 113,
            hsp_identity: 83.2,
            hsp_positive: 83.2,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 790,
            hsp_query_to: 902,
            hsp_hit_from: 133757490,
            hsp_hit_to: 133757602,
            hsp_qseq:
              'ATGGATCTAATGGTTGAGGCCAGTCCACGAAGAATATTTGCCAATGCTCATACATATCACATCAACTCAATTTCTATTAATAGTGATTATGAAACATATTTATCTGCAGATGA',
            hsp_mseq:
              '|||||||| ||||| || || ||||||||  |||| ||||| |||||||| |||||||| || || || |||||  | ||||||||| ||||||||||| | |||||||||||',
            hsp_hseq:
              'ATGGATCTTATGGTAGAAGCGAGTCCACGGCGAATTTTTGCAAATGCTCACACATATCATATAAATTCCATTTCAGTAAATAGTGATCATGAAACATATCTTTCTGCAGATGA'
          },
          {
            hsp_num: 5,
            hsp_score: 35,
            hsp_bit_score: 69.8753,
            hsp_expect: 1.2e-7,
            hsp_align_len: 87,
            hsp_identity: 85.1,
            hsp_positive: 85.1,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 1524,
            hsp_query_to: 1610,
            hsp_hit_from: 133769335,
            hsp_hit_to: 133769421,
            hsp_qseq:
              'GAAAGATGAAATAAGTGTTGACAGCCTAGACTTCAATAAGAAAATCCTTCACACAGCCTGGCACCCCAAGGAAAATATCATTGCCGT',
            hsp_mseq:
              '|||||| || || ||||| ||||| || |||||||| ||||| ||||| ||||||||||||||||||  ||| ||| ||||||||||',
            hsp_hseq:
              'GAAAGACGAGATCAGTGTGGACAGTCTGGACTTCAACAAGAAGATCCTGCACACAGCCTGGCACCCCGTGGACAATGTCATTGCCGT'
          }
        ]
      },
      {
        hit_num: 5,
        hit_def:
          'EG:HG1479_PATCH dna:chromosome chromosome:GRCh37:HG1479_PATCH:1:135573846:1 PATCH_FIX',
        hit_db: 'EG',
        hit_id: 'HG1479_PATCH',
        hit_acc: 'HG1479_PATCH',
        hit_desc:
          'dna:chromosome chromosome:GRCh37:HG1479_PATCH:1:135573846:1 PATCH_FIX',
        hit_url: '',
        hit_xref_url: '',
        hit_os: 'NA',
        hit_len: 135573846,
        hit_hsps: [
          {
            hsp_num: 1,
            hsp_score: 66,
            hsp_bit_score: 131.328,
            hsp_expect: 3.7e-26,
            hsp_align_len: 142,
            hsp_identity: 86.6,
            hsp_positive: 86.6,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 517,
            hsp_query_to: 658,
            hsp_hit_from: 133792658,
            hsp_hit_to: 133792799,
            hsp_qseq:
              'GGAGAATATAATGTTTACAGCACCTTCCAGAGCCATGAACCAGAGTTTGACTACTTGAAAAGTTTAGAAATAGAAGAAAAGATCAACAAAATTAGGTGGTTACCCCAGAAAAATGCTGCTCAGTTTTTATTGTCTACCAATG',
            hsp_mseq:
              '|||||||||||||||||||||||||| || || |||||||| ||||||||||| ||||||||| ||||||| || ||||| || || ||||||||||||||||| ||  | ||||||||||| ||| || ||||||| ||||',
            hsp_hseq:
              'GGAGAATATAATGTTTACAGCACCTTTCAAAGTCATGAACCGGAGTTTGACTATTTGAAAAGTCTAGAAATTGAGGAAAAAATTAATAAAATTAGGTGGTTACCACAACAGAATGCTGCTCATTTTCTACTGTCTACAAATG'
          },
          {
            hsp_num: 2,
            hsp_score: 44,
            hsp_bit_score: 87.7165,
            hsp_expect: 4.9e-13,
            hsp_align_len: 80,
            hsp_identity: 88.8,
            hsp_positive: 88.8,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 658,
            hsp_query_to: 737,
            hsp_hit_from: 133793184,
            hsp_hit_to: 133793263,
            hsp_qseq:
              'GATAAAACAATAAAATTATGGAAAATCAGTGAAAGGGACAAAAGACCAGAAGGGTATAACTTGAAAGAGGAGGATGGAAG',
            hsp_mseq:
              '|||||||| ||||||||||||||||| |||||| |||| |||||| ||||||| |||||| ||||||| || ||||||||',
            hsp_hseq:
              'GATAAAACTATAAAATTATGGAAAATAAGTGAACGGGATAAAAGAGCAGAAGGTTATAACCTGAAAGACGAAGATGGAAG'
          },
          {
            hsp_num: 3,
            hsp_score: 40,
            hsp_bit_score: 79.787,
            hsp_expect: 1.2e-10,
            hsp_align_len: 248,
            hsp_identity: 79,
            hsp_positive: 79,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 1117,
            hsp_query_to: 1364,
            hsp_hit_from: 133800135,
            hsp_hit_to: 133800382,
            hsp_qseq:
              'TTTGAAGAACCTGAAGATCCCAGTAACAGGTCATTTTTTTCCGAAATCATCTCCTCTATTTCGGATGTAAAATTCAGCCATAGTGGTCGATATATGATGACTAGAGACTATTTGTCAGTCAAAATTTGGGACTTAAATATGGAAAACAGGCCTGTGGAAACATACCAGGTGCATGAATACCTCAGAAGTAAACTCTGTTCACTGTATGAAAATGACTGCATATTTGACAAATTTGAATGTTGTTGGAA',
            hsp_mseq:
              '|||||||| |||||||||||||| |  ||||| || || || ||||| || || || || || |||||||||||||| |||||||| || || |||||||| ||||||||  |||| || ||  | |||||| | || ||||| | |||||| ||||| ||  ||||||| || || |||||  | || || ||||| || || ||||| || |||||||| |||||||| ||||| ||||| |||||',
            hsp_hseq:
              'TTTGAAGAGCCTGAAGATCCCAGCAGTAGGTCCTTCTTCTCAGAAATAATTTCATCCATATCCGATGTAAAATTCAGTCATAGTGGGCGGTACATGATGACCAGAGACTACCTGTCGGTGAAGGTGTGGGACCTCAACATGGAGAGCAGGCCGGTGGAGACCCACCAGGTCCACGAGTACCTGCGCAGCAAGCTCTGCTCTCTCTATGAGAACGACTGCATCTTTGACAAGTTTGAGTGTTGCTGGAA'
          },
          {
            hsp_num: 4,
            hsp_score: 37,
            hsp_bit_score: 73.84,
            hsp_expect: 7.4e-9,
            hsp_align_len: 113,
            hsp_identity: 83.2,
            hsp_positive: 83.2,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 790,
            hsp_query_to: 902,
            hsp_hit_from: 133796589,
            hsp_hit_to: 133796701,
            hsp_qseq:
              'ATGGATCTAATGGTTGAGGCCAGTCCACGAAGAATATTTGCCAATGCTCATACATATCACATCAACTCAATTTCTATTAATAGTGATTATGAAACATATTTATCTGCAGATGA',
            hsp_mseq:
              '|||||||| ||||| || || ||||||||  |||| ||||| |||||||| |||||||| || || || |||||  | ||||||||| ||||||||||| | |||||||||||',
            hsp_hseq:
              'ATGGATCTTATGGTAGAAGCGAGTCCACGGCGAATTTTTGCAAATGCTCACACATATCATATAAATTCCATTTCAGTAAATAGTGATCATGAAACATATCTTTCTGCAGATGA'
          },
          {
            hsp_num: 5,
            hsp_score: 35,
            hsp_bit_score: 69.8753,
            hsp_expect: 1.2e-7,
            hsp_align_len: 87,
            hsp_identity: 85.1,
            hsp_positive: 85.1,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 1524,
            hsp_query_to: 1610,
            hsp_hit_from: 133808434,
            hsp_hit_to: 133808520,
            hsp_qseq:
              'GAAAGATGAAATAAGTGTTGACAGCCTAGACTTCAATAAGAAAATCCTTCACACAGCCTGGCACCCCAAGGAAAATATCATTGCCGT',
            hsp_mseq:
              '|||||| || || ||||| ||||| || |||||||| ||||| ||||| ||||||||||||||||||  ||| ||| ||||||||||',
            hsp_hseq:
              'GAAAGACGAGATCAGTGTGGACAGTCTGGACTTCAACAAGAAGATCCTGCACACAGCCTGGCACCCCGTGGACAATGTCATTGCCGT'
          }
        ]
      },
      {
        hit_num: 6,
        hit_def: 'EG:5 dna:chromosome chromosome:GRCh37:5:1:180915260:1 REF',
        hit_db: 'EG',
        hit_id: '5',
        hit_acc: '5',
        hit_desc: 'dna:chromosome chromosome:GRCh37:5:1:180915260:1 REF',
        hit_url: '',
        hit_xref_url: '',
        hit_os: 'NA',
        hit_len: 180915260,
        hit_hsps: [
          {
            hsp_num: 1,
            hsp_score: 53,
            hsp_bit_score: 105.558,
            hsp_expect: 2.1e-18,
            hsp_align_len: 89,
            hsp_identity: 89.9,
            hsp_positive: 89.9,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '-1',
            hsp_strand: 'plus/minus',
            hsp_query_from: 520,
            hsp_query_to: 608,
            hsp_hit_from: 146077680,
            hsp_hit_to: 146077592,
            hsp_qseq:
              'GAATATAATGTTTACAGCACCTTCCAGAGCCATGAACCAGAGTTTGACTACTTGAAAAGTTTAGAAATAGAAGAAAAGATCAACAAAAT',
            hsp_mseq:
              '||||| |||||||||||||| ||||||||||||||||| ||||| || ||| |||| |||||||||||||||||||| ||||| |||||',
            hsp_hseq:
              'GAATACAATGTTTACAGCACATTCCAGAGCCATGAACCCGAGTTCGATTACCTGAAGAGTTTAGAAATAGAAGAAAAAATCAATAAAAT'
          },
          {
            hsp_num: 2,
            hsp_score: 35,
            hsp_bit_score: 69.8753,
            hsp_expect: 1.2e-7,
            hsp_align_len: 123,
            hsp_identity: 82.1,
            hsp_positive: 82.1,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '-1',
            hsp_strand: 'plus/minus',
            hsp_query_from: 1117,
            hsp_query_to: 1239,
            hsp_hit_from: 145980021,
            hsp_hit_to: 145979899,
            hsp_qseq:
              'TTTGAAGAACCTGAAGATCCCAGTAACAGGTCATTTTTTTCCGAAATCATCTCCTCTATTTCGGATGTAAAATTCAGCCATAGTGGTCGATATATGATGACTAGAGACTATTTGTCAGTCAAA',
            hsp_mseq:
              '|||||||| || |||||||| || ||||| |||||||| || ||||| ||||| || ||||||||||| || |||||||| |||||  | ||||| ||||| || ||||| ||| | ||||||',
            hsp_hseq:
              'TTTGAAGAGCCGGAAGATCCAAGCAACAGATCATTTTTCTCTGAAATTATCTCTTCGATTTCGGATGTGAAGTTCAGCCACAGTGGGAGGTATATCATGACCAGGGACTACTTGACCGTCAAA'
          },
          {
            hsp_num: 3,
            hsp_score: 33,
            hsp_bit_score: 65.9106,
            hsp_expect: 0.0000018,
            hsp_align_len: 149,
            hsp_identity: 80.5,
            hsp_positive: 80.5,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '-1',
            hsp_strand: 'plus/minus',
            hsp_query_from: 952,
            hsp_query_to: 1100,
            hsp_hit_from: 146017976,
            hsp_hit_to: 146017828,
            hsp_qseq:
              'ATTGTGGATATCAAGCCTGCCAATATGGAAGAGCTAACAGAGGTGATTACAGCAGCAGAATTTCATCCAAACAGCTGTAACACATTTGTATACAGCAGCAGTAAAGGAACTATTCGGCTATGTGACATGAGGGCATCTGCCCTCTGTGA',
            hsp_mseq:
              '|||||||| || ||||| ||||| ||||| ||||| || |||||||| |||||||| || || || ||  |    || ||||| || || ||||||||||| ||||| || || ||||| ||||||||| ||||||||||||| |||||',
            hsp_hseq:
              'ATTGTGGACATTAAGCCAGCCAACATGGAGGAGCTCACGGAGGTGATCACAGCAGCCGAGTTCCACCCCCATCATTGCAACACCTTCGTGTACAGCAGCAGCAAAGGGACAATCCGGCTGTGTGACATGCGGGCATCTGCCCTGTGTGA'
          },
          {
            hsp_num: 4,
            hsp_score: 32,
            hsp_bit_score: 63.9282,
            hsp_expect: 0.0000071,
            hsp_align_len: 68,
            hsp_identity: 86.8,
            hsp_positive: 86.8,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '-1',
            hsp_strand: 'plus/minus',
            hsp_query_from: 790,
            hsp_query_to: 857,
            hsp_hit_from: 146030269,
            hsp_hit_to: 146030202,
            hsp_qseq:
              'ATGGATCTAATGGTTGAGGCCAGTCCACGAAGAATATTTGCCAATGCTCATACATATCACATCAACTC',
            hsp_mseq:
              '||||| || ||||| |||||||  ||||||||| |||||||||| || || |||||||||||||||||',
            hsp_hseq:
              'ATGGACCTGATGGTGGAGGCCACCCCACGAAGAGTATTTGCCAACGCACACACATATCACATCAACTC'
          },
          {
            hsp_num: 5,
            hsp_score: 28,
            hsp_bit_score: 55.9988,
            hsp_expect: 0.0017,
            hsp_align_len: 72,
            hsp_identity: 84.7,
            hsp_positive: 84.7,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '-1',
            hsp_strand: 'plus/minus',
            hsp_query_from: 1281,
            hsp_query_to: 1352,
            hsp_hit_from: 145972629,
            hsp_hit_to: 145972558,
            hsp_qseq:
              'CCAGGTGCATGAATACCTCAGAAGTAAACTCTGTTCACTGTATGAAAATGACTGCATATTTGACAAATTTGA',
            hsp_mseq:
              '|||||| ||||| |||||| | || || || ||||| || ||||||||||||||||| ||||| ||||||||',
            hsp_hseq:
              'CCAGGTTCATGACTACCTCCGCAGCAAGCTGTGTTCCCTCTATGAAAATGACTGCATTTTTGATAAATTTGA'
          },
          {
            hsp_num: 6,
            hsp_score: 23,
            hsp_bit_score: 46.087,
            hsp_expect: 1.7,
            hsp_align_len: 55,
            hsp_identity: 85.5,
            hsp_positive: 85.5,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '-1',
            hsp_strand: 'plus/minus',
            hsp_query_from: 1382,
            hsp_query_to: 1436,
            hsp_hit_from: 145969784,
            hsp_hit_to: 145969730,
            hsp_qseq: 'TCATGACTGGATCTTACAATAATTTCTTCAGAATGTTTGACAGAAACACAAAGCG',
            hsp_mseq: '||||||| || || ||||| || |||||||| ||||| ||||||||||| |||||',
            hsp_hseq: 'TCATGACAGGCTCCTACAACAACTTCTTCAGGATGTTCGACAGAAACACCAAGCG'
          },
          {
            hsp_num: 7,
            hsp_score: 22,
            hsp_bit_score: 44.1047,
            hsp_expect: 6.6,
            hsp_align_len: 22,
            hsp_identity: 100,
            hsp_positive: 100,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '-1',
            hsp_strand: 'plus/minus',
            hsp_query_from: 2490,
            hsp_query_to: 2511,
            hsp_hit_from: 133816050,
            hsp_hit_to: 133816029,
            hsp_qseq: 'ATTTTTAACAAGTGTTCTTTTA',
            hsp_mseq: '||||||||||||||||||||||',
            hsp_hseq: 'ATTTTTAACAAGTGTTCTTTTA'
          }
        ]
      },
      {
        hit_num: 7,
        hit_def: 'EG:3 dna:chromosome chromosome:GRCh37:3:1:198022430:1 REF',
        hit_db: 'EG',
        hit_id: '3',
        hit_acc: '3',
        hit_desc: 'dna:chromosome chromosome:GRCh37:3:1:198022430:1 REF',
        hit_url: '',
        hit_xref_url: '',
        hit_os: 'NA',
        hit_len: 198022430,
        hit_hsps: [
          {
            hsp_num: 1,
            hsp_score: 40,
            hsp_bit_score: 79.787,
            hsp_expect: 1.2e-10,
            hsp_align_len: 219,
            hsp_identity: 79.9,
            hsp_positive: 79.9,
            hsp_gaps: 3,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 517,
            hsp_query_to: 735,
            hsp_hit_from: 38093170,
            hsp_hit_to: 38093381,
            hsp_qseq:
              'GGAGAATATAATGTTTACAGCACCTTCCAGAGCCATGAACCAGAGTTTGACTACTTGAAAAGTTTAGAAATAGAAGAAAAGATCAACAAAATTAGGTGGTTACCCCAGAAAAATGCTGCTCAGTTTTTATTGTCTACCAATGATAAAACAATAAAATTATGGAAAATCAGTGAAAGGGACAAAAGACCAGAAGGGTATAACTTGAAAGAGGAGGATGGA',
            hsp_mseq:
              '|||||||||||||||||||| |||||  |  | |||||||||| ||||| ||| | ||||||| ||||||| ||  |||| ||    ||||||||||||||||  ||||| |   ||||||| ||| || | ||||| ||||||||||| ||||||||||||||||  || | | | || |||||| ||||| | ||||||||||| || || ||||||',
            hsp_hseq:
              'GGAGAATATAATGTTTACAGTACCTTTAAAGGTCATGAACCAGGGTTTGGCTATTAGAAAAGTCTAGAAATTGAGCAAAAAAT----AAAATTAGGTGGTTACAACAGAACA---CTGCTCATTTTCTACTCTCTACAAATGATAAAACTATAAAATTATGGAAAAGAAGCGGATGAGATAAAAGAGCAGAAAGTTATAACTTGAATGATGAAGATGGA'
          },
          {
            hsp_num: 2,
            hsp_score: 23,
            hsp_bit_score: 46.087,
            hsp_expect: 1.7,
            hsp_align_len: 47,
            hsp_identity: 87.2,
            hsp_positive: 87.2,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 1321,
            hsp_query_to: 1367,
            hsp_hit_from: 38093836,
            hsp_hit_to: 38093882,
            hsp_qseq: 'TATGAAAATGACTGCATATTTGACAAATTTGAATGTTGTTGGAATGG',
            hsp_mseq: '||||| ||||||||||| ||||| |  ||||||||||| ||||||||',
            hsp_hseq: 'TATGAGAATGACTGCATCTTTGATAGCTTTGAATGTTGCTGGAATGG'
          },
          {
            hsp_num: 3,
            hsp_score: 22,
            hsp_bit_score: 44.1047,
            hsp_expect: 6.6,
            hsp_align_len: 26,
            hsp_identity: 96.2,
            hsp_positive: 96.2,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 2602,
            hsp_query_to: 2627,
            hsp_hit_from: 89095573,
            hsp_hit_to: 89095598,
            hsp_qseq: 'TTTTTTTTTTTTTTACCATCATGAGG',
            hsp_mseq: '|||||||||||||| |||||||||||',
            hsp_hseq: 'TTTTTTTTTTTTTTGCCATCATGAGG'
          }
        ]
      },
      {
        hit_num: 8,
        hit_def: 'EG:7 dna:chromosome chromosome:GRCh37:7:1:159138663:1 REF',
        hit_db: 'EG',
        hit_id: '7',
        hit_acc: '7',
        hit_desc: 'dna:chromosome chromosome:GRCh37:7:1:159138663:1 REF',
        hit_url: '',
        hit_xref_url: '',
        hit_os: 'NA',
        hit_len: 159138663,
        hit_hsps: [
          {
            hsp_num: 1,
            hsp_score: 25,
            hsp_bit_score: 50.0517,
            hsp_expect: 0.11,
            hsp_align_len: 29,
            hsp_identity: 96.6,
            hsp_positive: 96.6,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 2587,
            hsp_query_to: 2615,
            hsp_hit_from: 113077169,
            hsp_hit_to: 113077197,
            hsp_qseq: 'AAATGCTACTAGTTTTTTTTTTTTTTTTT',
            hsp_mseq: '||||||||||| |||||||||||||||||',
            hsp_hseq: 'AAATGCTACTAATTTTTTTTTTTTTTTTT'
          },
          {
            hsp_num: 2,
            hsp_score: 23,
            hsp_bit_score: 46.087,
            hsp_expect: 1.7,
            hsp_align_len: 31,
            hsp_identity: 93.5,
            hsp_positive: 93.5,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 2584,
            hsp_query_to: 2614,
            hsp_hit_from: 122928521,
            hsp_hit_to: 122928551,
            hsp_qseq: 'TATAAATGCTACTAGTTTTTTTTTTTTTTTT',
            hsp_mseq: '|||||||||||||  ||||||||||||||||',
            hsp_hseq: 'TATAAATGCTACTGATTTTTTTTTTTTTTTT'
          }
        ]
      },
      {
        hit_num: 9,
        hit_def: 'EG:18 dna:chromosome chromosome:GRCh37:18:1:78077248:1 REF',
        hit_db: 'EG',
        hit_id: '18',
        hit_acc: '18',
        hit_desc: 'dna:chromosome chromosome:GRCh37:18:1:78077248:1 REF',
        hit_url: '',
        hit_xref_url: '',
        hit_os: 'NA',
        hit_len: 78077248,
        hit_hsps: [
          {
            hsp_num: 1,
            hsp_score: 24,
            hsp_bit_score: 48.0694,
            hsp_expect: 0.42,
            hsp_align_len: 28,
            hsp_identity: 96.4,
            hsp_positive: 96.4,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 2588,
            hsp_query_to: 2615,
            hsp_hit_from: 5200171,
            hsp_hit_to: 5200198,
            hsp_qseq: 'AATGCTACTAGTTTTTTTTTTTTTTTTT',
            hsp_mseq: '||||||||||| ||||||||||||||||',
            hsp_hseq: 'AATGCTACTAGATTTTTTTTTTTTTTTT'
          }
        ]
      },
      {
        hit_num: 10,
        hit_def: 'EG:16 dna:chromosome chromosome:GRCh37:16:1:90354753:1 REF',
        hit_db: 'EG',
        hit_id: '16',
        hit_acc: '16',
        hit_desc: 'dna:chromosome chromosome:GRCh37:16:1:90354753:1 REF',
        hit_url: '',
        hit_xref_url: '',
        hit_os: 'NA',
        hit_len: 90354753,
        hit_hsps: [
          {
            hsp_num: 1,
            hsp_score: 24,
            hsp_bit_score: 48.0694,
            hsp_expect: 0.42,
            hsp_align_len: 32,
            hsp_identity: 93.8,
            hsp_positive: 93.8,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 2584,
            hsp_query_to: 2615,
            hsp_hit_from: 3385506,
            hsp_hit_to: 3385537,
            hsp_qseq: 'TATAAATGCTACTAGTTTTTTTTTTTTTTTTT',
            hsp_mseq: '|||||||||||||  |||||||||||||||||',
            hsp_hseq: 'TATAAATGCTACTGCTTTTTTTTTTTTTTTTT'
          }
        ]
      },
      {
        hit_num: 11,
        hit_def: 'EG:19 dna:chromosome chromosome:GRCh37:19:1:59128983:1 REF',
        hit_db: 'EG',
        hit_id: '19',
        hit_acc: '19',
        hit_desc: 'dna:chromosome chromosome:GRCh37:19:1:59128983:1 REF',
        hit_url: '',
        hit_xref_url: '',
        hit_os: 'NA',
        hit_len: 59128983,
        hit_hsps: [
          {
            hsp_num: 1,
            hsp_score: 22,
            hsp_bit_score: 44.1047,
            hsp_expect: 6.6,
            hsp_align_len: 22,
            hsp_identity: 100,
            hsp_positive: 100,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '-1',
            hsp_strand: 'plus/minus',
            hsp_query_from: 2195,
            hsp_query_to: 2216,
            hsp_hit_from: 40116221,
            hsp_hit_to: 40116200,
            hsp_qseq: 'TTAAAAAAAGAAAGAATGAAAG',
            hsp_mseq: '||||||||||||||||||||||',
            hsp_hseq: 'TTAAAAAAAGAAAGAATGAAAG'
          }
        ]
      },
      {
        hit_num: 12,
        hit_def: 'EG:12 dna:chromosome chromosome:GRCh37:12:1:133851895:1 REF',
        hit_db: 'EG',
        hit_id: '12',
        hit_acc: '12',
        hit_desc: 'dna:chromosome chromosome:GRCh37:12:1:133851895:1 REF',
        hit_url: '',
        hit_xref_url: '',
        hit_os: 'NA',
        hit_len: 133851895,
        hit_hsps: [
          {
            hsp_num: 1,
            hsp_score: 22,
            hsp_bit_score: 44.1047,
            hsp_expect: 6.6,
            hsp_align_len: 30,
            hsp_identity: 93.3,
            hsp_positive: 93.3,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '-1',
            hsp_strand: 'plus/minus',
            hsp_query_from: 2587,
            hsp_query_to: 2616,
            hsp_hit_from: 106267643,
            hsp_hit_to: 106267614,
            hsp_qseq: 'AAATGCTACTAGTTTTTTTTTTTTTTTTTA',
            hsp_mseq: '||||||||||| |||||||||| |||||||',
            hsp_hseq: 'AAATGCTACTAATTTTTTTTTTCTTTTTTA'
          }
        ]
      },
      {
        hit_num: 13,
        hit_def: 'EG:1 dna:chromosome chromosome:GRCh37:1:1:249250621:1 REF',
        hit_db: 'EG',
        hit_id: '1',
        hit_acc: '1',
        hit_desc: 'dna:chromosome chromosome:GRCh37:1:1:249250621:1 REF',
        hit_url: '',
        hit_xref_url: '',
        hit_os: 'NA',
        hit_len: 249250621,
        hit_hsps: [
          {
            hsp_num: 1,
            hsp_score: 22,
            hsp_bit_score: 44.1047,
            hsp_expect: 6.6,
            hsp_align_len: 30,
            hsp_identity: 96.7,
            hsp_positive: 96.7,
            hsp_gaps: 3,
            hsp_query_frame: '1',
            hsp_hit_frame: '-1',
            hsp_strand: 'plus/minus',
            hsp_query_from: 2912,
            hsp_query_to: 2940,
            hsp_hit_from: 228048657,
            hsp_hit_to: 228048628,
            hsp_qseq: 'ATTTTTCT-TCTATTTTTGGTTTTCCAAAG',
            hsp_mseq: '|||||||| |||||||||||||||||||||',
            hsp_hseq: 'ATTTTTCTATCTATTTTTGGTTTTCCAAAG'
          },
          {
            hsp_num: 2,
            hsp_score: 22,
            hsp_bit_score: 44.1047,
            hsp_expect: 6.6,
            hsp_align_len: 22,
            hsp_identity: 100,
            hsp_positive: 100,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 3012,
            hsp_query_to: 3033,
            hsp_hit_from: 181037404,
            hsp_hit_to: 181037425,
            hsp_qseq: 'ATAAAAATCTGTATATGAATAC',
            hsp_mseq: '||||||||||||||||||||||',
            hsp_hseq: 'ATAAAAATCTGTATATGAATAC'
          }
        ]
      },
      {
        hit_num: 14,
        hit_def: 'EG:X dna:chromosome chromosome:GRCh37:X:1:155270560:1 REF',
        hit_db: 'EG',
        hit_id: 'X',
        hit_acc: 'X',
        hit_desc: 'dna:chromosome chromosome:GRCh37:X:1:155270560:1 REF',
        hit_url: '',
        hit_xref_url: '',
        hit_os: 'NA',
        hit_len: 155270560,
        hit_hsps: [
          {
            hsp_num: 1,
            hsp_score: 22,
            hsp_bit_score: 44.1047,
            hsp_expect: 6.6,
            hsp_align_len: 22,
            hsp_identity: 100,
            hsp_positive: 100,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 588,
            hsp_query_to: 609,
            hsp_hit_from: 76897225,
            hsp_hit_to: 76897246,
            hsp_qseq: 'AGAAGAAAAGATCAACAAAATT',
            hsp_mseq: '||||||||||||||||||||||',
            hsp_hseq: 'AGAAGAAAAGATCAACAAAATT'
          }
        ]
      },
      {
        hit_num: 15,
        hit_def: 'EG:22 dna:chromosome chromosome:GRCh37:22:1:51304566:1 REF',
        hit_db: 'EG',
        hit_id: '22',
        hit_acc: '22',
        hit_desc: 'dna:chromosome chromosome:GRCh37:22:1:51304566:1 REF',
        hit_url: '',
        hit_xref_url: '',
        hit_os: 'NA',
        hit_len: 51304566,
        hit_hsps: [
          {
            hsp_num: 1,
            hsp_score: 22,
            hsp_bit_score: 44.1047,
            hsp_expect: 6.6,
            hsp_align_len: 22,
            hsp_identity: 100,
            hsp_positive: 100,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 318,
            hsp_query_to: 339,
            hsp_hit_from: 27806484,
            hsp_hit_to: 27806505,
            hsp_qseq: 'AGGAGCTGGAGGAGGGAATGAT',
            hsp_mseq: '||||||||||||||||||||||',
            hsp_hseq: 'AGGAGCTGGAGGAGGGAATGAT'
          }
        ]
      },
      {
        hit_num: 16,
        hit_def:
          'EG:HG1426_PATCH dna:chromosome chromosome:GRCh37:HG1426_PATCH:1:155276017:1 PATCH_FIX',
        hit_db: 'EG',
        hit_id: 'HG1426_PATCH',
        hit_acc: 'HG1426_PATCH',
        hit_desc:
          'dna:chromosome chromosome:GRCh37:HG1426_PATCH:1:155276017:1 PATCH_FIX',
        hit_url: '',
        hit_xref_url: '',
        hit_os: 'NA',
        hit_len: 155276017,
        hit_hsps: [
          {
            hsp_num: 1,
            hsp_score: 22,
            hsp_bit_score: 44.1047,
            hsp_expect: 6.6,
            hsp_align_len: 22,
            hsp_identity: 100,
            hsp_positive: 100,
            hsp_gaps: 0,
            hsp_query_frame: '1',
            hsp_hit_frame: '1',
            hsp_strand: 'plus/plus',
            hsp_query_from: 588,
            hsp_query_to: 609,
            hsp_hit_from: 76902689,
            hsp_hit_to: 76902710,
            hsp_qseq: 'AGAAGAAAAGATCAACAAAATT',
            hsp_mseq: '||||||||||||||||||||||',
            hsp_hseq: 'AGAAGAAAAGATCAACAAAATT'
          }
        ]
      }
    ]
  }
};
