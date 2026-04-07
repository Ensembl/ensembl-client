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

import { useSyncExternalStore } from 'react';

import { Store } from './parsedUrlParamsStore';

/**
 * The purpose of this hook is to encapsulate the logic
 * for subscribing to the store which contains parsed and validated
 * url params.
 */

const useParsedUrlParamsStore = () => {
  const state = useSyncExternalStore(Store.subscribe, Store.getSnapshot);

  return state;
};

export default useParsedUrlParamsStore;
