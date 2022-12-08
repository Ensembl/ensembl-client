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

import {
  createCSVForGenomicBlast,
  createCSVForTranscriptBlast,
  createCSVForProteinBlast
} from './createBlastCSVTable';
import { downloadBlobAsFile } from 'src/shared/helpers/downloadAsFile';

import type { AppDispatch } from 'src/store';
import type {
  SuccessfulBlastSubmission,
  BlastJobWithResults
} from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

/**
 * 1) Take a BLAST submission as an input
 * 2) Fetch all results for this submission (sometimes this will already be cached in redux)
 * 3) Also, fetch all raw BLAST files
 * 4) Create comma-separated tables for results
 * 5) Pack everything into a zip file according to a defined folder structure
 * 
 * The desired file tree structure (as a rough approximation):

    submission/
    ├─ species 1/
    │  ├─ sequence 1/
    │  │  ├─ table.csv
    │  │  ├─ alignments.txt
    │  ├─ sequence 2/
    │  │  ├─ table.csv
    │  │  ├─ alignments.txt
    ├─ species 2/
    │  ├─ sequence 1/
    │  │  ├─ table.csv
    │  │  ├─ alignments.txt
    │  ├─ sequence 2/
    │  │  ├─ table.csv
    │  │  ├─ alignments.txt

 */

type EnrichedBlastJobWithResults = BlastJobWithResults & {
  csv: string;
  raw: string;
};

type EnrichedBlastSubmission = SuccessfulBlastSubmission & {
  results: EnrichedBlastJobWithResults[];
};

const downloadBlastSubmission = async (
  submission: SuccessfulBlastSubmission,
  dispatch: AppDispatch
) => {
  const blastedAgainst = submission.submittedData.parameters.database; // 'dna_sm' | 'dna' | 'cdna' | 'pep'
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

  const allBlastJobsWithCSVs = allBlastJobs.map((job) => {
    let csv = '';
    if (blastedAgainst === 'dna' || blastedAgainst === 'dna_sm') {
      csv = createCSVForGenomicBlast(job.data);
    } else if (blastedAgainst === 'cdna') {
      csv = createCSVForTranscriptBlast(job.data);
    } else if (blastedAgainst === 'pep') {
      csv = createCSVForProteinBlast(job.data);
    }

    return {
      ...job,
      csv
    };
  });

  const allBlastJobsWithRawData = fetchedRawJobResults.map((job, index) => {
    const jobWithoutRawData = allBlastJobsWithCSVs[index];
    return {
      ...jobWithoutRawData,
      raw: job.result
    };
  });

  const zip = await createZipArchive({
    ...submission,
    results: allBlastJobsWithRawData
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const zipFileName = getNameForZipRoot(submission);
  await downloadBlobAsFile(blob, `${zipFileName}.zip`);
};

const createZipArchive = async (submission: EnrichedBlastSubmission) => {
  const JSZip = await import('jszip').then((module) => module.default); // use a dynamic import to split this library off in a separate chunk

  const {
    submittedData: { species: allSpecies },
    results
  } = submission;
  const speciesFolderNamesMap = new Map<string, string>();

  for (const species of allSpecies) {
    const folderName = `${species.scientific_name}-${species.genome_id}`;
    speciesFolderNamesMap.set(species.genome_id, folderName);
  }

  const zip = new JSZip();
  const rootFolder = zip.folder(getNameForZipRoot(submission));

  for (const blastResult of results) {
    const { genomeId, sequenceId, csv, raw } = blastResult;
    const csvFileName = 'table'; // NOTE: this will probably change
    const rawFileName = 'output'; // NOTE: this will probably change
    const speciesFolderName = speciesFolderNamesMap.get(genomeId);
    const sequenceFolderName = `Query sequence ${sequenceId}`; // NOTE: this name will probably change as well
    if (!speciesFolderName) {
      // should never happen
      continue;
    }
    rootFolder?.file(
      `${speciesFolderName}/${sequenceFolderName}/${csvFileName}.csv`,
      csv
    );
    rootFolder?.file(
      `${speciesFolderName}/${sequenceFolderName}/${rawFileName}.txt`,
      raw
    );
  }

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
