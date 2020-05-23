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

import { restTranscriptAdaptor } from './rest-transcript-adaptor';

import { GeneInResponse } from '../rest-data-fetchers/geneData';
import { Gene } from 'src/content/app/entity-viewer/types/gene';
import { Strand } from 'src/content/app/entity-viewer/types/strand';

export const restGeneAdaptor = (gene: GeneInResponse): Gene => {
  const transcripts = gene.Transcript.map((transcript) =>
    restTranscriptAdaptor(transcript)
  );

  return {
    id: gene.id,
    type: 'Gene',
    symbol: gene.display_name,
    so_term: gene.biotype,
    slice: {
      location: {
        start: gene.start,
        end: gene.end
      },
      region: {
        name: gene.seq_region_name,
        strand: {
          code: gene.strand === 1 ? Strand.FORWARD : Strand.REFVERSE
        }
      }
    },
    transcripts
  };
};
