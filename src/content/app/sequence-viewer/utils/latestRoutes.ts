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
 * This is a piece of state for remembering which genome the user was viewing last,
 * and what the url was for that genome.
 * This state is used for navigation between genomes in the sequence viewer
 * (i.e. on click on a species lozenge). It doesn't need to be reactive,
 * and thus doesn't need to be stored in redux.
 */

export type LatestRoutesMap = {
  latestGenomeId: string | null;
  genomeUrls: Record<string, string>;
};

export const latestRoutesMap: LatestRoutesMap = {
  latestGenomeId: null,
  genomeUrls: {}
};
