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

import IndexedDB from 'src/services/indexeddb-service';

import {
  GENERAL_UI_STORE_NAME as STORE_NAME,
  SPECIES_NAME_DISPLAY_OPTION_KEY
} from './generalUIStorageConstants';
import { speciesNameDisplayOptions } from 'src/content/app/species-selector/constants/speciesNameDisplayConstants';

import type { SpeciesNameDisplayOption } from 'src/content/app/species-selector/types/speciesNameDisplayOption';

export const saveSpeciesNameDisplayOption = async (
  option: SpeciesNameDisplayOption
) => {
  await IndexedDB.set(STORE_NAME, SPECIES_NAME_DISPLAY_OPTION_KEY, option);
};

export const getSpeciesNameDisplayOption = async () => {
  const savedOption = await IndexedDB.get(
    STORE_NAME,
    SPECIES_NAME_DISPLAY_OPTION_KEY
  );

  if (savedOption && isValidSpeciesNameDisplayOption(savedOption)) {
    return savedOption;
  } else {
    return null;
  }
};

const isValidSpeciesNameDisplayOption = (
  option: string
): option is SpeciesNameDisplayOption => {
  return speciesNameDisplayOptions.includes(option as any);
};
