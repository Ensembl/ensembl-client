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

import { useContext } from 'react';

import { GenomeBrowserIdsContext } from 'src/content/app/genome-browser/contexts/genome-browser-ids-context/GenomeBrowserIdsContext';

// TODO: remember that there will also be a lookup into the browser storage
// to determine whether the genome id in the url still matches the genome id
// that the backend thinks it should be associated with
const useGenomeBrowserIds = () => {
  const genomeBrowserIdsContext = useContext(GenomeBrowserIdsContext);

  if (!genomeBrowserIdsContext) {
    throw new Error(
      'useGenomeBrowserIds must be used with GenomeBrowserIdsContext Provider'
    );
  }

  return genomeBrowserIdsContext;
};

export default useGenomeBrowserIds;
