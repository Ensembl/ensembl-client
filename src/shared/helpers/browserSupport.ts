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
  NOTE: Browsers that load this scriipt are guaranteed to support ES6;
  so no need to check for ES6 support
*/

// BigInt64Array was added to Safari in version 15 (released in Sep 2021); it is required by genome browser code
const lacksBigInt64Array = () => {
  return !('BigInt64Array' in window);
};

const hasNoAbortController = () => {
  return !('AbortController' in window);
};

// This sets browser threshold at around 2022-2023
const lacksNewArrayMethods = () => {
  return !('toSorted' in Array.prototype);
};

const browserChecks = [
  lacksBigInt64Array,
  hasNoAbortController,
  lacksNewArrayMethods
];

const ensureBrowserSupport = () => {
  if (browserChecks.some((check) => check())) {
    window.location.replace('/unsupported-browser');
  }
};

export default ensureBrowserSupport;
