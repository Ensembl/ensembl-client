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

import { combineEpics } from 'redux-observable';

import * as speciesSelectorEpics from 'src/content/app/species-selector/state/speciesSelectorEpics';
import * as blastEpics from 'src/content/app/tools/blast/state/epics/blastEpics';

import { isEnvironment, Environment } from 'src/shared/helpers/environment';

export default combineEpics(
  ...Object.values(speciesSelectorEpics),

  // IMPORTANT! remember to update the database version of indexed db when enabling the below in production
  ...(isEnvironment([Environment.PRODUCTION]) ? [] : Object.values(blastEpics))
);
