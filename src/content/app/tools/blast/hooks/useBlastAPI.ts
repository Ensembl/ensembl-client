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

import config from 'config';
import apiService from 'src/services/api-service';

import { toFasta } from 'src/shared/helpers/formatters/fastaFormatter';
import {
  BlastParameterName,
  SequenceType
} from 'src/content/app/tools/blast/types/blastSettings';
import { BlastFormState } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

export type PayloadParams = {
  genomeIds: string[];
  querySequences: string[];
  parameters: Partial<Record<BlastParameterName, string>> & {
    title: string;
    stype: SequenceType;
  };
};

const useBlastAPI = () => {
  const submitBlastJob = (blastFormData: BlastFormState) => {
    const dataToSubmit = JSON.stringify(
      createBlastSubmissionData(blastFormData)
    );
    const endpointURL = `${config.toolsApiBaseUrl}/blast/job`;

    try {
      apiService
        .fetch(endpointURL, {
          preserveEndpoint: true,
          body: dataToSubmit
        })
        .then((response: any) => {
          return response;
        });
    } catch (error) {
      console.error(error as Error);
    }
  };

  const createBlastSubmissionData = (
    blastFormData: BlastFormState
  ): PayloadParams => {
    const sequences = blastFormData.sequences.map((sequence) =>
      toFasta(sequence)
    );

    return {
      genomeIds: blastFormData.selectedSpecies,
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

  return {
    createBlastSubmissionData,
    submitBlastJob
  };
};

export default useBlastAPI;
