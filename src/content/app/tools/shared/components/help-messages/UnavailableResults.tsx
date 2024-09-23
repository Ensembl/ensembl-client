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

const UnavailableResults = () => (
  <>
    <p>Results are stored for 7 days from submission</p>
    <p>
      Use 'Edit/rerun' to start a new job with the same configuration as the
      original submission
    </p>
    <p>
      Configurations are stored for 28 days after submission, then removed from
      the jobs list
    </p>
  </>
);

export default UnavailableResults;
