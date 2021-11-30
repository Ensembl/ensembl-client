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

/*
  This file contains the Status enumerable type.
  The Status type does not correspond to any single thing,
  but rather serves as a collection of various possible statuses
  that various things may have.
*/

// To developer: for easier checking of which statuses are available,
// please add new variants to the enum in the alphabetical order
export enum Status {
  DEFAULT = 'default',
  SELECTED = 'selected',
  UNSELECTED = 'unselected',
  DISABLED = 'disabled',
  PARTIALLY_SELECTED = 'partially selected',
  OPEN = 'open',
  CLOSED = 'closed'
}
