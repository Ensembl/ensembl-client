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

import type { VocabularyEntry } from 'src/content/app/tools/vep/views/vep-submission-results/components/vep-results-annotation-detail/displaySpecRenderer';
import type { AfSource } from 'src/content/app/tools/vep/types/vepResultsResponse';

/**
 * The vocabularies a job's `map_rows` blocks draw from. Every view builds them
 * the same way, so all of them offer the same populations.
 */
export const displayVocabularies = (
  afSources: AfSource[] | undefined
): Record<string, VocabularyEntry[]> => ({
  af_populations: (afSources ?? []).map((source) => ({
    scope: source.source,
    code: source.population,
    label: source.label
  }))
});
