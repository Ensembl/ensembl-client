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

import blastSettingsConfig from './blastSettingsConfig.json';

import type { BlastSettingsConfig } from 'src/content/app/tools/blast/types/blastSettings';

/**
 * The purpose of this file is to export the mock blast settings config with a type assigned to it.
 * Q: Why don't we just define the blast settings config here rather than in the json?
 * A: Because the json file is something we update and then hand over to the backend
 *    to update in the tools api. It is thus convenient to have a valid json file on the FE side as well.
 *
 * Q: Why doesn't we just rely on typescript to infer the type of the json object automatically?
 *    Why do we need to manually assign a type to it?
 * A: Typescript indeed correctly infers types of most fields of the json object the types of the json object correctly; but
 *    it decides that types of certain fields in this config is string[][],
 *    whereas in BlastSettingsConfig they are typed more precisely as [string, string][].
 *    For typescript, string[][] is incompatible with [string, string][].
 */
export default blastSettingsConfig as unknown as BlastSettingsConfig;
