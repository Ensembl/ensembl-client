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

import { Filters } from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';

import { metadataFields } from '../../gene-view/components/transcripts-filter/TranscriptsFilter';

type Transcript = {
  metadata: {
    biotype: { value: string } | null;
    tsl: { value: string } | null;
    appris: { value: string } | null;
  };
};

export function filterTranscripts<T extends Transcript>(
  transcripts: T[],
  filters: Filters
) {
  const selectedFilters = new Set([
    ...Object.keys(filters).filter((key) => filters[key].selected)
  ]);

  if (selectedFilters.size === 0) {
    return transcripts;
  }

  const filteredTranscripts = transcripts.filter((transcript) =>
    metadataFields.some((key) => {
      const value = transcript.metadata[key]?.value;
      return value ? selectedFilters.has(value) : false;
    })
  );

  return filteredTranscripts;
}
