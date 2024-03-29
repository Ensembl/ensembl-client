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

import { createSelector } from 'reselect';

import { RootState } from 'src/store';

export const getSequences = (state: RootState) =>
  state.blast.blastForm.sequences;

export const getEmptyInputVisibility = (state: RootState) =>
  state.blast.blastForm.shouldAppendEmptyInput;

export const getUncommittedSequencePresence = (state: RootState) =>
  state.blast.blastForm.hasUncommittedSequence;

export const getSelectedSequenceType = (state: RootState) =>
  state.blast.blastForm.settings.sequenceType;

export const getSequenceSelectionMode = (state: RootState) =>
  state.blast.blastForm.settings.sequenceSelectionMode;

export const getSelectedBlastProgram = (state: RootState) =>
  state.blast.blastForm.settings.program;

export const getSelectedSearchSensitivity = (state: RootState) =>
  state.blast.blastForm.settings.preset;

export const getBlastSearchParameters = (state: RootState) =>
  state.blast.blastForm.settings.parameters;

export const getBlastSubmissionName = (state: RootState) =>
  state.blast.blastForm.settings.submissionName;

export const getStep = (state: RootState) => state.blast.blastForm.step;

export const getModalView = (state: RootState) =>
  state.blast.blastForm.modalView;

export const getSelectedSpeciesList = (state: RootState) =>
  state.blast.blastForm.selectedSpecies;

export const getSelectedSpeciesIds = createSelector(
  getSelectedSpeciesList,
  (speciesList) => speciesList.map(({ genome_id }) => genome_id)
);

export const getBlastFormData = (state: RootState) => state.blast.blastForm;
