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

import type { TranscriptSequenceView } from 'src/content/app/sequence-viewer/types/transcriptSequenceView';
import type { SequenceTemplateMetadata } from './sequence-element';
import type { SequenceSelection } from './sequence-hit-testing';

export const getSelectionFastaHeader = ({
  metadata,
  sequenceType,
  selection: { start, end }
}: {
  metadata: SequenceTemplateMetadata | undefined;
  sequenceType: TranscriptSequenceView;
  selection: Pick<SequenceSelection, 'start' | 'end'>;
}): string | undefined => {
  if (!metadata) {
    return;
  }

  const {
    assemblyAccessionId,
    regionName,
    featureId,
    strand,
    reverseComplement
  } = metadata;
  const range = `${start}-${end}`;

  switch (sequenceType) {
    case 'genomic': {
      if (
        !regionName ||
        !assemblyAccessionId ||
        (strand !== 'forward' && strand !== 'reverse')
      ) {
        return;
      }

      const strandSymbol = strand === 'forward' ? '+' : '-';
      return `>${regionName} genomic assembly:${assemblyAccessionId} location:${regionName}:${range} strand:${strandSymbol}`;
    }

    case 'cdna':
    case 'cds': {
      if (!featureId || !assemblyAccessionId) {
        return;
      }

      const suffix = reverseComplement ? ' reverse complement' : '';
      return `>${featureId} ${sequenceType} assembly:${assemblyAccessionId} ${range}${suffix}`;
    }

    case 'protein':
      return featureId ? `>${featureId} pep ${range}` : undefined;
  }
};
