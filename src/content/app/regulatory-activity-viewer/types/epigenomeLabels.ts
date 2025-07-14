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
 * This is the label suggested for an epigenome suggested by the epigenomes api.
 *
 * Note:
 *  - An epigenome displayed by the client can be a combination
 *    of several base epigenomes (hence the 'epigenome_ids' field)
 *  - Due to the capability to combine epigenomes dynamically,
 *    and to Regulation team's willingness to fine-tune the text of the labels,
 *    they are requested from the server dynamincally, rather than generated
 *    on the client.
 *
 */
export type EpigenomeLabel = {
  epigenome_ids: string[]; // ids of one or more base epigenomes used to generate data for this given epigenome
  label: string;
};

export type EpigenomeLabelsRequest = {
  collapsed_by: string[];
  epigenome_ids: string[][];
};

// There is a promise from the api to return the labels in the same order
// in which they were requested
export type EpigenomeLabelsResponse = EpigenomeLabel[];
