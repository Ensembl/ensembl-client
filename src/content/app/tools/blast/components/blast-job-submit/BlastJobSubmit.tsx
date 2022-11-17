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

import React from 'react';
import { useNavigate } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { useAppSelector, useAppDispatch } from 'src/store';

import { useSubmitBlastMutation } from 'src/content/app/tools/blast/state/blast-api/blastApiSlice';
import useBlastForm from 'src/content/app/tools/blast/hooks/useBlastForm';
import { isBlastFormValid } from 'src/content/app/tools/blast/utils/blastFormValidator';

import { getBlastFormData } from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';
import { getSelectedSpeciesIds } from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';

import { clearBlastForm } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import { PrimaryButton } from 'src/shared/components/button/Button';

import type {
  Species,
  BlastFormState
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import type {
  BlastParameterName,
  SequenceType
} from 'src/content/app/tools/blast/types/blastSettings';

import type { SubmittedSequence } from 'src/content/app/tools/blast/types/blastSequence';

export type PayloadParams = {
  species: Species[];
  sequences: SubmittedSequence[];
  preset: string;
  submissionName: string;
  parameters: Partial<Record<BlastParameterName, string>> & {
    stype: SequenceType;
  };
};

const BlastJobSubmit = () => {
  const { sequences } = useBlastForm();
  const selectedSpeciesIds = useAppSelector(getSelectedSpeciesIds);
  const [submitBlast] = useSubmitBlastMutation({
    // Using a fixed cache key means that any subsequent request
    // will overwrite the current request if it hasn't yet completed;
    // but in order for this to be a problem, the api endpoint must be fantastically slow,
    // and the user must be fantastically fast; so it is most likely a non-issue
    fixedCacheKey: 'submit-blast-form'
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isDisabled = !isBlastFormValid(selectedSpeciesIds, sequences);

  const blastFormData = useAppSelector(getBlastFormData);

  const onBlastSubmit = () => {
    const payload = createBlastSubmissionData(blastFormData);
    const submission = submitBlast(payload);
    submission.then(() => submission.reset());
    navigate(urlFor.blastUnviewedSubmissions());

    dispatch(clearBlastForm());
  };

  return (
    <PrimaryButton onClick={onBlastSubmit} isDisabled={isDisabled}>
      Run
    </PrimaryButton>
  );
};

export const createBlastSubmissionData = (
  blastFormData: BlastFormState
): PayloadParams => {
  // labelling sequences with completely artificial identifiers
  // so that job ids in the response can be matched to individual combinations of sequences and genome ids
  const sequences = blastFormData.sequences.map((sequence, index) => ({
    id: index + 1,
    header: sequence.header,
    value: sequence.value
  }));
  sequences.forEach((item) => {
    if (!item.header) delete item.header;
  });

  return {
    species: blastFormData.selectedSpecies,
    sequences,
    preset: blastFormData.settings.preset,
    submissionName: blastFormData.settings.submissionName,
    parameters: {
      database: blastFormData.settings.parameters.database,
      program: blastFormData.settings.program,
      stype: blastFormData.settings.sequenceType,
      ...blastFormData.settings.parameters
    }
  };
};

export default BlastJobSubmit;
