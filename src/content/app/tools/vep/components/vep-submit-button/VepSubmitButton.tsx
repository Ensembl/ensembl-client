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

import { useAppSelector } from 'src/store';

import {
  getSelectedSpecies,
  getVepFormParameters,
  getVepFormInputText,
  getVepFormInputFile,
  getVepFormInputCommittedFlag
} from 'src/content/app/tools/vep/state/vep-form/vepFormSelectors';

import { useVepFormSubmissionMutation } from 'src/content/app/tools/vep/state/vep-api/vepApiSlice';

import { PrimaryButton } from 'src/shared/components/button/Button';

import type {
  VEPSubmissionPayload,
  VepSelectedSpecies
} from 'src/content/app/tools/vep/types/vepSubmission';

const VepSubmitButton = () => {
  const selectedSpecies = useAppSelector(getSelectedSpecies);
  const inputText = useAppSelector(getVepFormInputText);
  const inputFile = useAppSelector(getVepFormInputFile);
  const formParameters = useAppSelector(getVepFormParameters);
  const isInputCommitted = useAppSelector(getVepFormInputCommittedFlag);
  const [submitVepForm] = useVepFormSubmissionMutation();

  const canSubmit = Boolean(
    selectedSpecies &&
      (inputText || inputFile) &&
      Object.keys(formParameters).length &&
      isInputCommitted
  );

  const onSubmit = () => {
    const payload = preparePayload({
      species: selectedSpecies as VepSelectedSpecies,
      inputText,
      inputFile,
      parameters: formParameters
    });

    submitVepForm(payload);
  };

  return (
    <PrimaryButton disabled={!canSubmit} onClick={onSubmit}>
      Run
    </PrimaryButton>
  );
};

const preparePayload = ({
  species,
  inputText,
  inputFile,
  parameters
}: {
  species: VepSelectedSpecies;
  inputText: string;
  inputFile: File | null;
  parameters: Record<string, unknown>;
}): VEPSubmissionPayload => {
  if (inputText) {
    inputFile = new File([inputText], 'input.txt', {
      type: 'text/plain'
    });
  }

  return {
    genome_id: species.genome_id,
    input_file: inputFile as File,
    parameters: JSON.stringify(parameters)
  };
};

export default VepSubmitButton;
