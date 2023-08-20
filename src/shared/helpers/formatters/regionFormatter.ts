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

import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';

type Location = {
  chromosome: string;
  start: number;
  end?: number;
};

export const getFormattedLocation = (location: Location) => {
  const start = formatNumber(location.start);
  const end = location.end ? formatNumber(location.end) : null;

  if (end === null || start === end) {
    return `${location.chromosome}:${start}`;
  } else {
    return `${location.chromosome}:${start}-${end}`;
  }
};
