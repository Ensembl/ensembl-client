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
  getSplicedRNALength,
  getProductAminoAcidLength
} from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import {
  getCCDSXref,
  getNCBITranscriptData,
  getTranscriptBiotype,
  getTranscriptFlags,
  getUniprotXref
} from './transcriptTableHelpers';
import { formatCSV } from 'src/shared/helpers/formatters/tabularFileFormatter';

import type { DefaultEntityViewerTranscript } from 'src/content/app/entity-viewer/state/api/queries/defaultGeneQuery';

export const getDownloadableTranscriptTable = ({
  transcripts
}: {
  transcripts: DefaultEntityViewerTranscript[];
}) => {
  const tableHead = [
    'Transcript',
    'cDNA length',
    'Protein length',
    'Biotype',
    'CCDS',
    'UniProt match',
    'RefSeq match',
    'Flags'
  ];

  const rows = transcripts.map((transcript) => {
    const ccdsXref = getCCDSXref(transcript);
    const uniprotXref = getUniprotXref(transcript);
    const ncbiTranscript = getNCBITranscriptData(transcript);
    const transcriptFlags = getTranscriptFlags(transcript).join(', ');
    const escapedTranscriptFlagsString = transcriptFlags
      ? `"${transcriptFlags}"`
      : '';

    return [
      transcript.stable_id,
      getSplicedRNALength(transcript),
      getProductAminoAcidLength(transcript),
      getTranscriptBiotype(transcript),
      ccdsXref?.accession_id ?? '-',
      uniprotXref?.accession_id ?? '-',
      ncbiTranscript?.id ?? '-',
      escapedTranscriptFlagsString
    ];
  });

  return formatCSV([tableHead, ...rows]);
};
