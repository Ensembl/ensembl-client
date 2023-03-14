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

import {
  fetchAllBlastJobs,
  fetchAllBlastRawResults
} from 'src/content/app/tools/blast/state/blast-api/blastApiSlice';
import { getFormattedDate } from 'src/shared/helpers/formatters/dateFormatter';

import { printBlastSubmissionTable } from './renderSubmissionTable';
import { downloadBlobAsFile } from 'src/shared/helpers/downloadAsFile';

import type { AppDispatch } from 'src/store';
import type { SuccessfulBlastSubmission } from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

const downloadBlastSubmission = async (
  submission: SuccessfulBlastSubmission,
  dispatch: AppDispatch
) => {
  const jobIds = submission.results.map(({ jobId }) => jobId);
  const blastJobsQuery = dispatch(fetchAllBlastJobs.initiate(jobIds));
  const rawBlastResultsQuery = dispatch(
    fetchAllBlastRawResults.initiate(jobIds)
  );
  const { data: fetchedJobResults } = await blastJobsQuery;
  const { data: fetchedRawJobResults } = await rawBlastResultsQuery;

  blastJobsQuery.unsubscribe();
  rawBlastResultsQuery.unsubscribe();

  if (!fetchedJobResults || !fetchedRawJobResults) {
    throw 'Failed to download all BLAST jobs';
  }

  const allBlastJobs = submission.results.map((job, index) => ({
    ...job,
    data: fetchedJobResults[index].result
  }));

  const blastSubmissionTable = printBlastSubmissionTable({
    ...submission,
    results: allBlastJobs
  });

  const combinedRawJobResults = fetchedRawJobResults.reduce(
    (combinedText, { result: text }): string => {
      if (!combinedText) {
        return text;
      } else {
        return combinedText + '\n\n' + text;
      }
    },
    ''
  );

  // const allBlastJobsWithRawData = fetchedRawJobResults.map((job, index) => {
  //   const jobWithoutRawData = allBlastJobsWithTSVs[index];
  //   return {
  //     ...jobWithoutRawData,
  //     raw: job.result
  //   };
  // });

  const zip = await createZipArchive({
    submission,
    table: blastSubmissionTable,
    raw: combinedRawJobResults
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const zipFileName = getNameForZipRoot(submission);
  await downloadBlobAsFile(blob, `${zipFileName}.zip`);
};

const createZipArchive = async (params: {
  table: string;
  raw: string;
  submission: SuccessfulBlastSubmission;
}) => {
  const { submission, table, raw } = params;
  const JSZip = await import('jszip').then((module) => module.default); // use a dynamic import to split this library off in a separate chunk
  const tableFileName = 'table.tsv';
  const rawOutputFileName = 'output.txt';

  const zip = new JSZip();
  const rootFolder = zip.folder(getNameForZipRoot(submission));
  rootFolder?.file(tableFileName, table);
  rootFolder?.file(rawOutputFileName, raw);

  return zip;
};

const getNameForZipRoot = (submission: SuccessfulBlastSubmission) => {
  const {
    id,
    submittedData: {
      parameters: { program }
    },
    submittedAt
  } = submission;
  const date = new Date(submittedAt);
  const formattedDate = getFormattedDate(date);

  return `${program}-${id}-${formattedDate}`;
};

export default downloadBlastSubmission;
