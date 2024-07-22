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

import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { getVepSubmission } from 'src/content/app/tools/vep/services/vepStorageService';

import {
  getTemporaryVepSubmissionId,
  getSelectedSpecies,
  getVepFormParameters,
  getVepFormInputText,
  getVepFormInputFileName,
  getVepFormInputCommittedFlag
} from 'src/content/app/tools/vep/state/vep-form/vepFormSelectors';

import { useVepFormSubmissionMutation } from 'src/content/app/tools/vep/state/vep-api/vepApiSlice';
import { onVepFormSubmission } from 'src/content/app/tools/vep/state/vep-form/vepFormSlice';

import { PrimaryButton } from 'src/shared/components/button/Button';

import type {
  VepSubmissionPayload,
  VepSelectedSpecies
} from 'src/content/app/tools/vep/types/vepSubmission';

const VepSubmitButton = (props: { className?: string }) => {
  const submissionId = useAppSelector(getTemporaryVepSubmissionId);
  const selectedSpecies = useAppSelector(getSelectedSpecies);
  const inputText = useAppSelector(getVepFormInputText);
  const inputFileName = useAppSelector(getVepFormInputFileName);
  const formParameters = useAppSelector(getVepFormParameters);
  const isInputCommitted = useAppSelector(getVepFormInputCommittedFlag);
  const [submitVepForm] = useVepFormSubmissionMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const canSubmit = Boolean(
    selectedSpecies &&
      (inputText || inputFileName) &&
      Object.keys(formParameters).length &&
      isInputCommitted
  );

  const onSubmit = async () => {
    const payload = await preparePayload({
      submissionId: submissionId as string,
      species: selectedSpecies as VepSelectedSpecies,
      inputText,
      parameters: formParameters
    });

    await dispatch(
      onVepFormSubmission({ submissionId: submissionId as string })
    );

    navigate(urlFor.vepSubmissionsList());

    submitVepForm(payload);
  };

  return (
    <PrimaryButton
      disabled={!canSubmit}
      onClick={onSubmit}
      className={props.className}
    >
      Run
    </PrimaryButton>
  );
};

const preparePayload = async ({
  submissionId,
  species,
  inputText,
  parameters
}: {
  submissionId: string;
  species: VepSelectedSpecies;
  inputText: string | null;
  parameters: Record<string, unknown>;
}): Promise<VepSubmissionPayload> => {
  let inputFile: File;

  if (inputText) {
    inputFile = new File([inputText], 'input.txt', {
      type: 'text/plain'
    });
  } else {
    const storedSubmission = await getVepSubmission(submissionId);
    if (!storedSubmission) {
      throw new Error(
        `Submission with id ${submissionId} does not exist in browser storage`
      );
    }
    inputFile = storedSubmission.inputFile as File;
  }

  return {
    submission_id: submissionId,
    genome_id: species.genome_id,
    input_file: inputFile as File,
    parameters: JSON.stringify(parameters)
  };
};

export default VepSubmitButton;
