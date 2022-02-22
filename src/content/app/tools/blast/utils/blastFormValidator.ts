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

import { ParsedInputSequence } from 'src/content/app/tools/blast/types/parsedInputSequence';

const SPECIES_LIMIT = 25;
const SEQUENCE_LIMIT = 30;

export const isBlastFormValid = (
  species: string[],
  sequences: ParsedInputSequence[]
) => {
  if (
    !species.length ||
    species.length > SPECIES_LIMIT ||
    !sequences.length ||
    sequences.length > SEQUENCE_LIMIT
  ) {
    return false;
  }

  return true;
};
