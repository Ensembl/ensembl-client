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

import type {
  SuccessfulBlastSubmission,
  SubmittedBlastData,
  BlastJobWithResults
} from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';
import type { BlastHit, HSP } from 'src/content/app/tools/blast/types/blastJob';

type BlastSubmissionWithJobsWithResults = Omit<
  SuccessfulBlastSubmission,
  'results'
> & {
  results: BlastJobWithResults[];
};

export const printBlastSubmissionTable = (
  submission: BlastSubmissionWithJobsWithResults
) => {
  let table = '';
  table += printMetadata(submission);
  table += printData(submission);
  return table;
};

const printMetadata = (submission: BlastSubmissionWithJobsWithResults) => {
  const rows: string[] = [];
  const submissionDate = new Date(submission.submittedAt);
  const dateFormatter = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC' });
  const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    minute: 'numeric'
  });
  const formattedDate = dateFormatter.format(submissionDate);
  const formattedTime = `${timeFormatter.format(submissionDate)} GMT`;

  rows.push('[METADATA]');
  rows.push(tabulate(['Submission id', submission.id]));
  rows.push(tabulate(['Date', formattedDate]));
  rows.push(tabulate(['Time', formattedTime]));
  rows.push('[PARAMETERS]');
  rows.push(
    tabulate(['Blast type', submission.submittedData.parameters.program])
  );
  // TODO: store query sequence type
  // rows.push(tabulate([
  //   'Query sequence type',
  //   formatSequenceType(submission.submittedData.parameters.)
  // ]));
  rows.push(
    tabulate([
      'Database type queried',
      formatDatabaseType(submission.submittedData.parameters.database)
    ])
  );
  rows.push(tabulate(['Sensitivity', submission.submittedData.preset]));
  rows.push(
    tabulate(['Max alignments', submission.submittedData.parameters.alignments])
  );
  rows.push(
    tabulate(['Max scores', submission.submittedData.parameters.scores])
  );
  rows.push(tabulate(['E-threshold', submission.submittedData.parameters.exp]));
  rows.push(
    tabulate([
      'Statistical accuracy',
      submission.submittedData.parameters.compstats
    ])
  );
  rows.push(
    tabulate(['HSPs per hit', submission.submittedData.parameters.hsps])
  );
  rows.push(
    tabulate(['Drop-off', submission.submittedData.parameters.dropoff])
  );

  if (submission.submittedData.parameters.gapopen) {
    rows.push(
      tabulate(['Gap opening', submission.submittedData.parameters.gapopen])
    );
  }
  if (submission.submittedData.parameters.gapext) {
    rows.push(
      tabulate(['Gap extension', submission.submittedData.parameters.gapext])
    );
  }

  rows.push(
    tabulate(['Word size', submission.submittedData.parameters.wordsize])
  );

  if (submission.submittedData.parameters.match_scores) {
    rows.push(
      tabulate([
        'Match/mismatch',
        submission.submittedData.parameters.match_scores
      ])
    );
  }
  if (submission.submittedData.parameters.matrix) {
    rows.push(
      tabulate(['Scoring matrix', submission.submittedData.parameters.matrix])
    );
  }

  if (submission.submittedData.parameters.gapalign) {
    rows.push(
      tabulate([
        'Align gaps',
        formatGapAlign(submission.submittedData.parameters.gapalign)
      ])
    );
  }

  rows.push(
    tabulate([
      'Filter low complexity regions',
      formatLowComplexityFilter(submission.submittedData.parameters.filter)
    ])
  );

  return rows.join('\n');
};

const printData = (submission: BlastSubmissionWithJobsWithResults) => {
  const jobRenderer = getJobRenderer(
    submission.submittedData.parameters.database
  );

  let table = '';
  table += '\n[DATA]\n';

  for (const species of submission.submittedData.species) {
    for (const sequence of submission.submittedData.sequences) {
      const job = submission.results.find(
        (job) =>
          job.genomeId === species.genome_id && job.sequenceId === sequence.id
      );
      if (!job) {
        // shouldn't happen
        continue;
      }

      const tableForJob = jobRenderer({
        species,
        sequence,
        job
      });
      table += tableForJob;
    }
  }

  return table;
};

const getJobRenderer = (blastDatabase: string) => {
  switch (blastDatabase) {
    case 'pep':
      return printProteinsTable;
    case 'cdna':
      return printTranscriptsTable;
    default:
      return printGenomicTable;
  }
};

const printGenomicTable = (params: {
  species: SubmittedBlastData['species'][number];
  sequence: SubmittedBlastData['sequences'][number];
  job: BlastJobWithResults;
}) => {
  const { species, sequence, job } = params;
  const table: (string | number)[][] = [];
  const headerRow = [
    'Query sequence no.',
    'Query sequence header',
    'Query full length',
    'Species scientific name',
    'Assembly name',
    'E-value',
    'Hit length',
    '% ID',
    'Bit score',
    'Genomic location',
    'Hit orientation',
    'Hit start',
    'Hit end',
    'Query start',
    'Query end',
    'Alignment length',
    'Query sequence',
    'Hit sequence'
  ];
  table.push(headerRow);

  const hspsWithHits = job.data.hits.flatMap((hit) => {
    return hit.hit_hsps.map((hsp) => ({ ...hsp, hit }));
  });
  hspsWithHits.sort(sortByEValue);

  for (const hsp of hspsWithHits) {
    const commonCells = printCommonCells({
      species,
      sequence,
      hsp,
      hit: hsp.hit
    });
    const row = [
      commonCells.sequenceId,
      commonCells.sequenceHeader,
      commonCells.queryLength,
      commonCells.speciesName,
      commonCells.assemblyName,
      commonCells.evalue,
      commonCells.hitLength,
      commonCells.percentIdentity,
      commonCells.bitScore,
      `${hsp.hit.hit_acc}:${hsp.hsp_hit_from}-${hsp.hsp_hit_to}`,
      commonCells.hitOrientation,
      commonCells.hitStart,
      commonCells.hitEnd,
      commonCells.queryStart,
      commonCells.queryEnd,
      commonCells.alignmentLength,
      commonCells.querySequence,
      commonCells.hitSequence
    ];
    table.push(row);
  }

  return table.map(tabulate).join('\n');
};

const printTranscriptsTable = (params: {
  species: SubmittedBlastData['species'][number];
  sequence: SubmittedBlastData['sequences'][number];
  job: BlastJobWithResults;
}) => {
  const { species, sequence, job } = params;
  const table: (string | number)[][] = [];
  const headerRow = [
    'Query sequence no.',
    'Query sequence header',
    'Query full length',
    'Species scientific name',
    'Assembly name',
    'E-value',
    'Hit length',
    '% ID',
    'Bit score',
    'Transcript ID',
    'Hit orientation',
    'Hit start',
    'Hit end',
    'Query start',
    'Query end',
    'Alignment length',
    'Query sequence',
    'Hit sequence'
  ];
  table.push(headerRow);

  const hspsWithHits = job.data.hits.flatMap((hit) => {
    return hit.hit_hsps.map((hsp) => ({ ...hsp, hit }));
  });
  hspsWithHits.sort(sortByEValue);

  for (const hsp of hspsWithHits) {
    const commonCells = printCommonCells({
      species,
      sequence,
      hsp,
      hit: hsp.hit
    });
    const row = [
      commonCells.sequenceId,
      commonCells.sequenceHeader,
      commonCells.queryLength,
      commonCells.speciesName,
      commonCells.assemblyName,
      commonCells.evalue,
      commonCells.hitLength,
      commonCells.percentIdentity,
      commonCells.bitScore,
      hsp.hit.hit_acc,
      commonCells.hitOrientation,
      commonCells.hitStart,
      commonCells.hitEnd,
      commonCells.queryStart,
      commonCells.queryEnd,
      commonCells.alignmentLength,
      commonCells.querySequence,
      commonCells.hitSequence
    ];
    table.push(row);
  }

  return table.map(tabulate).join('\n');
};

const printProteinsTable = (params: {
  species: SubmittedBlastData['species'][number];
  sequence: SubmittedBlastData['sequences'][number];
  job: BlastJobWithResults;
}) => {
  const { species, sequence, job } = params;
  const table: (string | number)[][] = [];
  const headerRow = [
    'Query sequence no.',
    'Query sequence header',
    'Query full length',
    'Species scientific name',
    'Assembly name',
    'E-value',
    'Hit length',
    '% ID',
    'Bit score',
    'Protein ID',
    'Hit orientation',
    'Hit start',
    'Hit end',
    'Query start',
    'Query end',
    'Alignment length',
    'Query sequence',
    'Hit sequence'
  ];
  table.push(headerRow);

  const hspsWithHits = job.data.hits.flatMap((hit) => {
    return hit.hit_hsps.map((hsp) => ({ ...hsp, hit }));
  });
  hspsWithHits.sort(sortByEValue);

  for (const hsp of hspsWithHits) {
    const commonCells = printCommonCells({
      species,
      sequence,
      hsp,
      hit: hsp.hit
    });
    const row = [
      commonCells.sequenceId,
      commonCells.sequenceHeader,
      commonCells.queryLength,
      commonCells.speciesName,
      commonCells.assemblyName,
      commonCells.evalue,
      commonCells.hitLength,
      commonCells.percentIdentity,
      commonCells.bitScore,
      hsp.hit.hit_acc,
      commonCells.hitOrientation,
      commonCells.hitStart,
      commonCells.hitEnd,
      commonCells.queryStart,
      commonCells.queryEnd,
      commonCells.alignmentLength,
      commonCells.querySequence,
      commonCells.hitSequence
    ];
    table.push(row);
  }

  return table.map(tabulate).join('\n');
};

const printCommonCells = (params: {
  species: SubmittedBlastData['species'][number];
  sequence: SubmittedBlastData['sequences'][number];
  hit: BlastHit;
  hsp: HSP;
}) => {
  const { species, sequence, hit, hsp } = params;
  const sequenceHeader = sequence.header ?? `Sequence ${sequence.id}`;

  return {
    sequenceId: `sequence ${sequence.id}`,
    sequenceHeader,
    queryLength: sequence.value.length,
    speciesName: species.scientific_name,
    assemblyName: species.assembly_name,
    alignmentLength: hsp.hsp_align_len,
    evalue: hsp.hsp_expect,
    hitLength: hit.hit_len,
    percentIdentity: hsp.hsp_identity,
    bitScore: hsp.hsp_bit_score,
    hitOrientation: hsp.hsp_hit_frame === '1' ? 'Forward' : 'Reverse',
    hitStart: hsp.hsp_hit_from,
    hitEnd: hsp.hsp_hit_to,
    queryStart: hsp.hsp_query_from,
    queryEnd: hsp.hsp_query_to,
    querySequence: hsp.hsp_qseq,
    hitSequence: hsp.hsp_hseq
  };
};

// const formatSequenceType = (type: string) => {
//   if (type === 'protein') {
//     return 'Protein';
//   } else {
//     return 'Nucleotide';
//   }
// };

const formatDatabaseType = (type: string) => {
  if (type === 'pep') {
    return 'Proteins';
  } else if (type === 'cdna') {
    return 'Transcripts';
  } else if (type === 'dna_sm') {
    return 'Genomic (softmasked)';
  } else {
    return 'Genomic';
  }
};

const formatGapAlign = (value: string) => {
  return value === 'true' ? 'Yes' : 'No';
};

const formatLowComplexityFilter = (value: string) => {
  return value === 'T' ? 'Yes' : 'No';
};

const sortByEValue = (a: HSP, b: HSP) => {
  return a.hsp_expect - b.hsp_expect;
};

const tabulate = (strings: (string | number)[]) => strings.join('\t');
