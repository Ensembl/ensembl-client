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

import { useDispatch, useSelector } from 'react-redux';

import config from 'config';
import apiService, { HTTPMethod } from 'src/services/api-service';
import { toFasta } from 'src/shared/helpers/formatters/fastaFormatter';

import { getNextJobId } from 'src/content/app/tools/blast/state/blast-jobs/blastJobsSelectors';
import {
  saveBlastJobResult,
  BlastJobResult,
  saveBlastJob
} from 'src/content/app/tools/blast/state/blast-jobs/blastJobsSlice';

import {
  BlastParameterName,
  SequenceType
} from 'src/content/app/tools/blast/types/blastSettings';
import { BlastFormState } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import { LoadingState } from 'src/shared/types/loading-state';

export type PayloadParams = {
  genomeIds: string[];
  querySequences: string[];
  parameters: Partial<Record<BlastParameterName, string>> & {
    title: string;
    stype: SequenceType;
  };
};

const useBlastAPI = () => {
  const dispatch = useDispatch();
  const nextJobId = useSelector(getNextJobId);

  /* 
    TODO: We can move the code responsible for fetching the settings config
    here and store it in the blastFormSlice
    const fetchBlastConfig = () => {....} ?
  */

  const submitBlastJob = async (
    blastFormData: BlastFormState
  ): Promise<BlastJobResult | undefined> => {
    const dataToSubmit = JSON.stringify(
      createBlastSubmissionData(blastFormData)
    );

    dispatch(saveBlastJob({ jobData: blastFormData }));

    const endpointURL = `${config.toolsApiBaseUrl}/blast/job`;

    try {
      const jobResult = await apiService
        .fetch(endpointURL, {
          method: HTTPMethod.POST,
          preserveEndpoint: true,
          body: dataToSubmit
        })
        .then((response: BlastJobResult) => {
          dispatch(
            saveBlastJobResult({
              jobId: nextJobId,
              result: response,
              status: LoadingState.SUCCESS
            })
          );
          return response;
        });

      return jobResult;
    } catch (error: unknown) {
      console.error(error);
      saveBlastJobResult({
        jobId: nextJobId,
        result: null,
        status: LoadingState.ERROR,
        error
      });
    }

    return;
  };

  return {
    submitBlastJob
  };
};

export const createBlastSubmissionData = (
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

export default useBlastAPI;
