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

/**
 * NOTE: currently, epigenomes get combined by age no matter whether this dimension is included in the combined dimensions,
 * because it isn't yet clear how to deal with age properly. (Age is going to be tightly linked to life stage.)
 */

export const getCombinedEpigenomes = ({
  baseEpigenomes,
  combiningDimensions
}: {
  baseEpigenomes: Epigenome[];
  combiningDimensions: string[];
}) => {
  const combinedEpigenomesMap = new Map<string, Partial<Epigenome>>();

  for (const epigenome of baseEpigenomes) {
    const combinedEpigenomeKey = createCombinedEpigenomeKey(
      epigenome,
      combiningDimensions
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
  combiningDimensions: string[]
) => {
  const dimensionsForKey = eligibleDimensions.filter(
    (dimension) => !combiningDimensions.includes(dimension)
  );

  const keyPartFromDimensions = dimensionsForKey.reduce((acc, dimension) => {
    return `${acc}-${epigenome[dimension]}`;
  }, '');

  const key = `${epigenome.term}${keyPartFromDimensions}`;
  return key;
};

const createCombinedEpigenome = ({
  epigenome,
  combiningDimensions
  // existingCombinedEpigenome
}: {
  epigenome: Epigenome;
  combiningDimensions: string[];
  existingCombinedEpigenome?: Partial<Epigenome>;
}) => {
  const combinedEpigenome: Partial<Epigenome> = {};

  for (const key of Object.keys(epigenome) as Array<keyof Epigenome>) {
    if (combiningDimensions.includes(key)) {
      continue;
    } else {
      combinedEpigenome[key] = epigenome[key] as any; // shut up typescript
    }
  }

  // FIXME: the fragment below is from the loop above;
  // need to come up with display label for combined epigenome
  // else if (key === 'name') {
  //   combinedEpigenome.name = existingCombinedEpigenome
  //     ? `${existingCombinedEpigenome.name} AND ${epigenome.name}`
  //     : epigenome.name;
  // }

  return combinedEpigenome;
};

/**
 * A list of dimensions that can possibly be used when combining epigenomes.
 * For example, it is meaningless to combine epigenomes on the "term" dimension or "organ" dimension;
 * but meaningful to combine them on the sex or life stage dimension
 */
const eligibleDimensions = ['sex', 'life_stage'] as const;
