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

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

export type VepSelectedSpecies = Omit<CommittedItem, 'isEnabled'>;

/**
 * Schema of the data that will be persisted in indexedDB.
 */
export type VEPSubmission = {
  id: string;
  genome_id: string; // <-- should be the whole CommittedItem rather than a string
  input_text: string | null;
  input_file: File | null;
  submission_name: string | null;
  parameters: Record<string, unknown>;
  created_at: string;
  submitted_at: string | null; // <-- can get the unsubmitted submission
  status: string; // <-- a member of a closed dictionary of words
};

/**
 * Schema of the payload submitted to the server.
 */
export type VEPSubmissionPayload = {
  genome_id: string;
  input_file: File;
  parameters: string;
};
