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

import type { RootState } from 'src/store';

export const getVepFormState = (state: RootState) => state.vep.vepForm;

export const getSelectedSpecies = (state: RootState) =>
  state.vep.vepForm.selectedSpecies;

export const getTemporaryVepSubmissionId = (state: RootState) =>
  state.vep.vepForm.submissionId;

export const getVepSubmissionName = (state: RootState) =>
  state.vep.vepForm.submissionName;

export const getVepFormParameters = (state: RootState) =>
  state.vep.vepForm.parameters;

export const getVepFormInputText = (state: RootState) =>
  state.vep.vepForm.inputText;

export const getVepFormInputFileName = (state: RootState) =>
  state.vep.vepForm.inputFileName;

export const getVepFormInputCommittedFlag = (state: RootState) =>
  state.vep.vepForm.isInputCommitted;
