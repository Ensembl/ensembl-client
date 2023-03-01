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

import { formatTSV } from 'src/shared/helpers/formatters/fileFormatter';

import type { BlastJobResult } from 'src/content/app/tools/blast/types/blastJob';

export const createTSVForGenomicBlast = (blastJobResult: BlastJobResult) => {
  const columnNames = [
    'E-value',
    'Hit length',
    '% ID',
    'Score',
    'Genomic location',
    'Hit orientation',
    'Hit start',
    'Hit end',
    'Query start',
    'Query end'
  ];

  const rows = [columnNames] as Array<string | number>[];

  for (const hit of blastJobResult.hits) {
    for (const hsp of hit.hit_hsps) {
      const {
        evalue,
        hitLength,
        percentId,
        score,
        hitOrientation,
        hitStart,
        hitEnd,
        queryStart,
        queryEnd
      } = getCommonFields({ blastHsp: hsp });
      const genomicStart =
        hitOrientation === 'Forward' ? hsp.hsp_hit_from : hsp.hsp_hit_to;
      const genomicEnd =
        hitOrientation === 'Forward' ? hsp.hsp_hit_to : hsp.hsp_hit_from;
      const genomicLocation = `${hit.hit_acc}:${genomicStart}-${genomicEnd}`;
      const newRow = [
        evalue,
        hitLength,
        percentId,
        score,
        genomicLocation,
        hitOrientation,
        hitStart,
        hitEnd,
        queryStart,
        queryEnd
      ];
      rows.push(newRow);
    }
  }

  sortTableRows(rows);

  return formatTSV(rows);
};

export const createTSVForTranscriptBlast = (blastJobResult: BlastJobResult) => {
  const columnNames = [
    'E-value',
    'Hit length',
    '% ID',
    'Score',
    'Transcript ID',
    'Hit orientation',
    'Hit start',
    'Hit end',
    'Query start',
    'Query end'
  ];

  const rows = [columnNames] as Array<string | number>[];

  for (const hit of blastJobResult.hits) {
    for (const hsp of hit.hit_hsps) {
      const {
        evalue,
        hitLength,
        percentId,
        score,
        hitOrientation,
        hitStart,
        hitEnd,
        queryStart,
        queryEnd
      } = getCommonFields({ blastHsp: hsp });
      const transcriptId = hit.hit_acc;
      const newRow = [
        evalue,
        hitLength,
        percentId,
        score,
        transcriptId,
        hitOrientation,
        hitStart,
        hitEnd,
        queryStart,
        queryEnd
      ];
      rows.push(newRow);
    }
  }

  sortTableRows(rows);

  return formatTSV(rows);
};

export const createTSVForProteinBlast = (blastJobResult: BlastJobResult) => {
  const columnNames = [
    'E-value',
    'Hit length',
    '% ID',
    'Score',
    'Protein ID',
    'Hit orientation',
    'Hit start',
    'Hit end',
    'Query start',
    'Query end'
  ];

  const rows = [columnNames] as Array<string | number>[];

  for (const hit of blastJobResult.hits) {
    for (const hsp of hit.hit_hsps) {
      const {
        evalue,
        hitLength,
        percentId,
        score,
        hitOrientation,
        hitStart,
        hitEnd,
        queryStart,
        queryEnd
      } = getCommonFields({ blastHsp: hsp });
      const proteinId = hit.hit_acc;
      const newRow = [
        evalue,
        hitLength,
        percentId,
        score,
        proteinId,
        hitOrientation,
        hitStart,
        hitEnd,
        queryStart,
        queryEnd
      ];
      rows.push(newRow);
    }
  }

  sortTableRows(rows);

  return formatTSV(rows);
};

const getCommonFields = ({
  blastHsp
}: {
  blastHsp: BlastJobResult['hits'][number]['hit_hsps'][number];
}) => ({
  evalue: blastHsp.hsp_expect,
  hitLength: blastHsp.hsp_align_len,
  percentId: blastHsp.hsp_identity,
  score: blastHsp.hsp_bit_score,
  hitOrientation: blastHsp.hsp_hit_frame === '1' ? 'Forward' : 'Reverse',
  hitStart: blastHsp.hsp_hit_from,
  hitEnd: blastHsp.hsp_hit_to,
  queryStart: blastHsp.hsp_query_from,
  queryEnd: blastHsp.hsp_query_to
});

// by default, downloaded tables of BLAST results should be sorted according to the e-value
const sortTableRows = (rows: Array<string | number>[]) => {
  rows.sort((row1, row2) => {
    const [evalue1] = row1;
    const [evalue2] = row2;

    if (typeof evalue1 === 'string' || typeof evalue2 === 'string') {
      return 0;
    } else {
      return evalue1 - evalue2;
    }
  });
};
