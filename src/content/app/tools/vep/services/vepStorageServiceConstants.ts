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

import {
  ONE_HOUR_IN_MILLISECONDS,
  ONE_DAY_IN_MILLISECONDS
} from 'src/shared/constants/timeConstants';

export const VEP_SUBMISSIONS_STORE_NAME = 'vep-submissions';

export const VEP_RESULTS_AVAILABILITY_DURATION =
  ONE_DAY_IN_MILLISECONDS * 7 - ONE_HOUR_IN_MILLISECONDS;
export const VEP_SUBMISSION_STORAGE_DURATION = ONE_DAY_IN_MILLISECONDS * 28;
