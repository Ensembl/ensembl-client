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
import apiService, { HTTPMethod } from 'src/services/api-service';

export type BlastJobResult = {
  jobIds: string[];
};

const useBlastAPI = () => {
  const submitBlastJob = async (
    stringifiedBlastFormData: string
  ): Promise<BlastJobResult | undefined> => {
    const endpointURL = `${config.toolsApiBaseUrl}/blast/job`;

    try {
      const jobResult = await apiService
        .fetch(endpointURL, {
          method: HTTPMethod.POST,
          preserveEndpoint: true,
          body: stringifiedBlastFormData
        })
        .then((response: BlastJobResult) => {
          return response;
        });

      return jobResult;
    } catch (error: unknown) {
      console.error(error);
    }
    return;
  };

  return {
    submitBlastJob
  };
};

export default useBlastAPI;