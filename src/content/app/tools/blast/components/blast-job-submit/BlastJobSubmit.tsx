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

import { useAppSelector } from 'src/store';

import useToolsContext from 'src/content/app/tools/shared/context/useToolsContext';

import LoadingButton from 'src/shared/components/loading-button/LoadingButton';

import useBlastInputSequences from 'src/content/app/tools/blast/components/blast-input-sequences/useBlastInputSequences';
import { isBlastFormValid } from 'src/content/app/tools/blast/utils/blastFormValidator';

import { getBlastFormData } from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';
import { getSelectedSpeciesIds } from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';

import { toFasta } from 'src/shared/helpers/formatters/fastaFormatter';

import type {
  Species,
  BlastFormState
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import type {
  BlastParameterName,
  SequenceType
} from 'src/content/app/tools/blast/types/blastSettings';
import type { BlastSubmission } from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

export type PayloadParams = {
  species: Species[];
  querySequences: string[];
  parameters: Partial<Record<BlastParameterName, string>> & {
    title: string;
    stype: SequenceType;
  };
};

type BlastSubmissionResponse = {
  submissionId: string;
  submission: BlastSubmission;
};

const BlastJobSubmit = () => {
  const { sequences } = useBlastInputSequences();
  const selectedSpeciesIds = useAppSelector(getSelectedSpeciesIds);

  const { submitBlastForm } = useToolsContext();

  const isDisabled = !isBlastFormValid(selectedSpeciesIds, sequences);

  const blastFormData = useAppSelector(getBlastFormData);

  const onBlastSubmit = async () => {
    const payload = createBlastSubmissionData(blastFormData);

    const response = await submitBlastForm(payload);

    if (response) {
      onSubmitSuccess(response);
    }
  };

  const onSubmitSuccess = (response: BlastSubmissionResponse) => {
    // TODO: change the temporary implementation of this function with a more permanent one
    const firstJobId = response.submission.results[0].jobId;
    if (!firstJobId) {
      return;
    }

    const resultPageUrl = `https://wwwdev.ebi.ac.uk/Tools/services/web/toolresult.ebi?jobId=${firstJobId}`;

    const resultTab = window.open(resultPageUrl, '_blank');
    if (resultTab !== null) {
      resultTab.focus();
    }
  };

  return (
    <LoadingButton onClick={onBlastSubmit} isDisabled={isDisabled}>
      Run
    </LoadingButton>
  );
};

export const createBlastSubmissionData = (
  blastFormData: BlastFormState
): PayloadParams => {
  const sequences = blastFormData.sequences.map((sequence) =>
    toFasta(sequence)
  );

  return {
    species: blastFormData.selectedSpecies,
    querySequences: sequences,
    parameters: {
      title: blastFormData.settings.jobName,
      database: blastFormData.settings.parameters.database,
      program: blastFormData.settings.program,
      stype: blastFormData.settings.sequenceType,
      ...blastFormData.settings.parameters
    }
  };
};

export default BlastJobSubmit;
