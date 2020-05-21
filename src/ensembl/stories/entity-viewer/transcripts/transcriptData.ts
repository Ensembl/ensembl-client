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

import { fetchGene } from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/geneData';
import { fetchTranscript } from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/transcriptData';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';
import { Gene } from 'src/content/app/entity-viewer/types/gene';

enum FeatureType {
  Gene = 'Gene',
  Transcript = 'Transcript',
  Unknown = 'Unknown'
}

export const getTranscriptData = async (
  id: string
): Promise<Gene | Transcript | null> => {
  const url = `https://rest.ensembl.org/lookup/id/${id}?content-type=application/json`;
  const data = await fetch(url).then((response) => response.json());

  if (data.object_type === FeatureType.Gene) {
    return fetchGene(id);
  } else if (data.object_type === FeatureType.Transcript) {
    return fetchTranscript(id);
  } else {
    console.error(`${id} is not a valid id`);
    return null;
  }
};
