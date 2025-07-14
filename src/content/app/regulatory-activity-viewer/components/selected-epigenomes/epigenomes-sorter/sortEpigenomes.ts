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

import type { Epigenome } from 'src/content/app/regulatory-activity-viewer/types/epigenome';

export const sortEpigenomes = <T extends Epigenome>({
  sortingDimensions,
  epigenomes
}: {
  sortingDimensions: string[];
  epigenomes: T[];
}) => {
  return epigenomes.toSorted((e1, e2) => {
    for (const dimension of sortingDimensions) {
      const e1Value = stringifyDimensionValue(e1, dimension);
      const e2Value = stringifyDimensionValue(e2, dimension);
      if (
        e1Value === null ||
        e1Value === undefined ||
        e2Value === null ||
        e2Value === undefined
      ) {
        continue;
      } else if (e1Value === e2Value) {
        // compare the values of the next dimension
        continue;
      } else {
        return e1Value.localeCompare(e2Value);
      }
    }
    return 0;
  });
};

export const stringifyDimensionValue = (
  epigenome: Partial<Epigenome>,
  dimension: keyof Epigenome
) => {
  const value = epigenome[dimension];

  if (Array.isArray(value)) {
    return value.join(', ');
  } else {
    return String(value);
  }
};

export default sortEpigenomes;
