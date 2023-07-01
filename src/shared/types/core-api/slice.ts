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

import { Strand } from './strand';
import { LocationWithinRegion } from './location';
import { Sequence } from './sequence';

export type Region = {
  name: string;
  length: number;
  assembly: string; // TODO: update, according to the graphql schema
  code: string; // chromosome, plasmid, scaffold; maybe something else
  topology: 'linear' | 'circular';
  sequence: Sequence;
};

export type Slice = {
  location: LocationWithinRegion;
  region: Region;
  strand: {
    code: Strand;
    value?: 1 | -1; // adding this field for documentation purposes; we shouldn't need to use it
  };
};

export type SliceWithLocationOnly = {
  location: {
    start: number;
    end: number;
    length: number;
  };
};
