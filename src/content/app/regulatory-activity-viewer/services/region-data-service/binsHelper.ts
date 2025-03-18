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

/**
 * In order to avoid the need to iterate over the whole region when looking for features,
 * features are stored in 1-megabase bins.
 */

export const BIN_SIZE = 1_000_000;

export const createBins = ({ start, end }: { start: number; end: number }) => {
  const binsStart = getBinStartForPosition(start);
  const binsEnd = getBinEndForPosition(end);

  const binBoundaries: { start: number; end: number }[] = [];

  for (let i = binsStart; i < binsEnd; i += BIN_SIZE) {
    binBoundaries.push({
      start: i,
      end: i + BIN_SIZE - 1
    });
  }

  return binBoundaries;
};

export const getBinStartForPosition = (position: number) => {
  if (position < 1) {
    // this should never happen
    throw new Error(
      'Feature coordinates can only be represented with positive integers'
    );
  }

  if (position % BIN_SIZE === 0) {
    // A multiple of BIN_SIZE is the upper limit of a bin.
    // In order for the subsequent computation to return the correct bin start,
    // reduce the position value by 1
    position -= 1;
  }

  return Math.floor(position / BIN_SIZE) * BIN_SIZE + 1;
};

export const getBinEndForPosition = (position: number) => {
  return Math.ceil(position / BIN_SIZE) * BIN_SIZE;
};

export const createBinKey = ({
  start,
  end
}: {
  start: number;
  end: number;
}) => {
  return `${start}-${end}`;
};
