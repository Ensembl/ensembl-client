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
 * NOTE:
 * In the genome browser section, there are similar functions
 * named getChrLocationFromStr and getChrLocationStr.
 *
 * The difference is the interface of those functions.
 * They split a location string into an array of three elements (defined as a ChrLocation type),
 * or take a ChrLocation-shaped input to generate a string.
 *
 * The functions in this helper, while identical in logic, use a different interface:
 * an object with regionName, start, and end fields. This shape is more explicit,
 * and thus, more convenient to use. The type with this shape is defined below as GenomicLocation.
 *
 * Over time, it might be worth replacing the helper functions
 * from the genome browser section with the functions defined in this file.
 */

export type GenomicLocation = {
  regionName: string;
  start: number;
  end: number;
};

export const getGenomicLocationFromString = (
  input: string
): GenomicLocation => {
  try {
    const locationRegex = /^(?<regionName>.+):(?<start>\d+)-(?<end>\d+)$/;

    const result = locationRegex.exec(input);

    if (!result?.groups) {
      throw new Error();
    }

    const { regionName, start, end } = result.groups;

    if (
      typeof regionName !== 'string' ||
      typeof start !== 'string' ||
      typeof end !== 'string'
    ) {
      throw new Error();
    }

    return {
      regionName,
      start: parseInt(start, 10),
      end: parseInt(end, 10)
    };
  } catch {
    throw new Error('Malformed genomic location string');
  }
};

export const getGenomicLocationString = (location: GenomicLocation) => {
  const { regionName, start, end } = location;

  return `${regionName}:${start}-${end}`;
};
