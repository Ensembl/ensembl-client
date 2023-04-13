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

import { ValueSetMetadata } from '../thoas/metadata';

export type VariantStudyPopulation = {
  name: string;
  size: number;
  description: string;
  type: ValueSetMetadata;
  is_global: boolean;
  is_from_genotypes: boolean;
  display_group_name: string; // The name of the group of populations this population belongs to; serves for grouping purposes
  super_population: VariantStudyPopulation | null;
  sub_populations: VariantStudyPopulation[];
};
