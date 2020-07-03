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

import downloadAsFile from 'src/shared/helpers/downloadAsFile';
import {
  ProteinOptions,
  ProteinOption,
  proteinOptionsOrder
} from 'src/shared/components/instant-download/instant-download-protein/InstantDownloadProtein';

type FetchPayload = {
  transcriptId: string;
  options: ProteinOptions;
};

export const fetchForProtein = async (payload: FetchPayload) => {
  const { transcriptId, options } = payload;
  const urls = buildUrlsForProtein(transcriptId, options);

  const sequencePromises = urls.map((url) =>
    fetch(url).then((response) => response.text())
  );

  const sequences = await Promise.all(sequencePromises);
  const combinedFasta = sequences.join('\n');

  downloadAsFile(combinedFasta, `${transcriptId}.fasta`, {
    type: 'text/x-fasta'
  });
};

const buildUrlsForProtein = (id: string, options: ProteinOptions) => {
  return options
    ? proteinOptionsOrder
        .filter((option) => options[option])
        .map((option) => buildFetchUrl(id, option))
    : [];
};

const buildFetchUrl = (id: string, sequenceType: ProteinOption) => {
  const sequenceTypeToTypeParam: Record<ProteinOption, string> = {
    proteinSequence: 'protein',
    cds: 'cds'
  };
  const typeParam = sequenceTypeToTypeParam[sequenceType];

  return `https://rest.ensembl.org/sequence/id/${id}?content-type=text/x-fasta&type=${typeParam}`;
};
