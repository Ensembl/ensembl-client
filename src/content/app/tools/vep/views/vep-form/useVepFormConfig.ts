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

import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from 'src/store';

import {
  getSelectedSpecies,
  getVepFormParameters
} from 'src/content/app/tools/vep/state/vep-form//vepFormSelectors';

import { useVepFormConfigQuery } from 'src/content/app/tools/vep/state/vep-api/vepApiSlice';
import { setDefaultParameters } from 'src/content/app/tools/vep/state/vep-form/vepFormSlice';

/**
 * The purpose of this hook is to request VEP form config with user options
 * every time the selected species changes; and to update VEP form parameters
 * with the default values from the config.
 *
 * Consider the following scenarios:
 * 1. Component mounts for the first time. User selects a species.
 *    VEP form config needs to be fetched.
 * 2. After selecting a species, user decides to change the species.
 *    A different VEP form config needs to be fetched.
 * 3. User starts filling in the form triggering the fetching of a VEP form config;
 *    then resets the form, and starts filling it again for the same species.
 *    A new request for the config will not be sent, because the previous request
 *    will have still been cached; but it is necessary to set up
 *    default form parameters from the config.
 * 4. User starts filling in the form, switches to a different app,
 *    then comes back. No need to fetch a new VEP form config.
 */

const useVepFormConfig = () => {
  const selectedSpecies = useAppSelector(getSelectedSpecies);
  const vepFormParameters = useAppSelector(getVepFormParameters);
  const selectedGenomeId = selectedSpecies?.genome_id;
  const areFormParametersEmpty = isObjectEmpty(vepFormParameters);
  const { currentData: vepFormConfig } = useVepFormConfigQuery(
    {
      genome_id: selectedGenomeId ?? ''
    },
    {
      skip: !selectedGenomeId || !areFormParametersEmpty
    }
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    // NOTE: When the user changes the selected species,
    // form parameters are cleared out (see vepFormSlice),
    // which will trigger the dispatch below.
    if (!vepFormConfig || !areFormParametersEmpty) {
      return;
    }

    dispatch(setDefaultParameters(vepFormConfig));
  }, [vepFormConfig, areFormParametersEmpty]);
};

const isObjectEmpty = (obj: Record<string, unknown>) => {
  return Object.keys(obj).length === 0;
};

export default useVepFormConfig;
