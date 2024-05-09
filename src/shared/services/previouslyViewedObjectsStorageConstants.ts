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

export const PREVIOUSLY_VIEWED_OBJECTS_STORE_NAME = 'previously-viewed';
export const GENOME_BROWSER_PREFIX = 'genome-browser';
export const ENTITY_VIEWER_PREFIX = 'entity-viewer';

export type APP_PREFIX_TYPE =
  | typeof GENOME_BROWSER_PREFIX
  | typeof ENTITY_VIEWER_PREFIX;
