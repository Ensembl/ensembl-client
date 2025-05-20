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

/**
 * The backend api would be too slow, and would also probably return too much data
 * for excessively large region slices; so it makes sense to show detailed views
 * only past a certain threshold. So far, this threshold is chosen to be 1MB
 */
export const MAX_SLICE_LENGTH_FOR_DETAILED_VIEW = 1_000_000;
