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

export const getCombinedEpigenomes = ({
  baseEpigenomes,
  combiningDimensions,
  allEpigenomeDimensions
}: {
  baseEpigenomes: Epigenome[];
  combiningDimensions: string[];
  allEpigenomeDimensions: string[];
}) => {
  const combinedEpigenomesMap = new Map<string, Epigenome>();
  const distinguishingDimensions = allEpigenomeDimensions.filter(
    (dimension) => !combiningDimensions.includes(dimension)
  );

  for (const epigenome of baseEpigenomes) {
    const combinedEpigenomeKey = createCombinedEpigenomeKey(
      epigenome,
      distinguishingDimensions
    );
    const storedCombinedEpigenome =
      combinedEpigenomesMap.get(combinedEpigenomeKey);
    const combinedEpigenome = createCombinedEpigenome({
      epigenome,
      combiningDimensions,
      existingCombinedEpigenome: storedCombinedEpigenome
    });
    combinedEpigenomesMap.set(combinedEpigenomeKey, combinedEpigenome);
  }

  return [...combinedEpigenomesMap.values()];
};

const createCombinedEpigenomeKey = (
  epigenome: Epigenome,
  distinguishingDimensions: string[]
) => {
  const keyPartFromDimensions = distinguishingDimensions.reduce(
    (acc, dimension) => {
      return `${acc}-${epigenome[dimension]}`;
    },
    ''
  );

  const key = `${epigenome.term}${keyPartFromDimensions}`;
  return key;
};

const createCombinedEpigenome = ({
  epigenome,
  combiningDimensions,
  existingCombinedEpigenome
}: {
  epigenome: Epigenome;
  combiningDimensions: string[];
  existingCombinedEpigenome?: Epigenome;
}) => {
  const combinedEpigenome: Epigenome = { id: epigenome.id };

  for (const key of Object.keys(epigenome) as Array<keyof Epigenome>) {
    if (combiningDimensions.includes(key)) {
      continue;
    } else if (key === 'id') {
      // a combined epigenome contains identifiers of all the epigenomes that it includes
      combinedEpigenome.id = existingCombinedEpigenome
        ? `${existingCombinedEpigenome.id}, ${epigenome.id}`
        : epigenome.id;
    } else {
      combinedEpigenome[key] = epigenome[key] as any; // shut up typescript
    }
  }

  return combinedEpigenome;
};
