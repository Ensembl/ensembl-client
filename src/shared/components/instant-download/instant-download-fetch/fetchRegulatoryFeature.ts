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

import { wrap } from 'comlink';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { fetchRegionSequenceChecksum } from './fetchSequenceChecksums';

import { downloadTextAsFile } from 'src/shared/helpers/downloadAsFile';

import type {
  WorkerApi,
  SingleSequenceFetchParams
} from 'src/shared/workers/sequenceFetcher.worker';

export const fetchRegulatoryFeatureSequences = async (payload: {
  id: string;
  genomeId: string;
  featureType: string;
  regionName: string;
  coreRegion?: {
    start: number;
    end: number;
  };
  boundaryRegion?: {
    start: number;
    end: number;
  };
}) => {
  const { id, genomeId, featureType, regionName, coreRegion, boundaryRegion } =
    payload;

  if (!coreRegion && !boundaryRegion) {
    throw new Error('Feature location for download was not provided');
  }

  const regionSequenceChecksum = await fetchRegionSequenceChecksum({
    genomeId,
    regionName
  });

  const downloadParameters: SingleSequenceFetchParams[] = [];

  if (coreRegion) {
    const { start, end } = coreRegion;
    const label = buildFastaHeader({
      id,
      featureType,
      regionName,
      start,
      end
    });
    downloadParameters.push(
      prepareRegulatoryFeatureDownloadParameters({
        label,
        checksum: regionSequenceChecksum,
        start,
        end
      })
    );
  }

  if (boundaryRegion) {
    const { start, end } = boundaryRegion;
    const label = buildFastaHeader({
      id,
      featureType,
      regionName,
      start,
      end
    });
    downloadParameters.push(
      prepareRegulatoryFeatureDownloadParameters({
        label,
        checksum: regionSequenceChecksum,
        start,
        end
      })
    );
  }

  const worker = new Worker(
    new URL('src/shared/workers/sequenceFetcher.worker.ts', import.meta.url)
  );

  const service = wrap<WorkerApi>(worker);
  const sequences = await service.downloadSequences(downloadParameters);

  worker.terminate();

  await downloadTextAsFile(sequences, `${id}.fasta`, {
    type: 'text/x-fasta'
  });
};

const prepareRegulatoryFeatureDownloadParameters = (params: {
  label: string;
  checksum: string;
  start: number;
  end: number;
}) => {
  const { label, start, end, checksum } = params;
  const url = urlFor.refget({ checksum, start, end });

  return {
    label,
    url
  };
};

const buildFastaHeader = (params: {
  id: string;
  featureType: string;
  regionName: string;
  start: number;
  end: number;
}) => {
  const { id, featureType, regionName, start, end } = params;
  return `>er|${id}|${featureType}|${regionName}:${start}-${end}`;
};
