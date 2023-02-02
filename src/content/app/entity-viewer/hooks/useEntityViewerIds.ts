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

import { EntityViewerIdsContext } from 'src/content/app/entity-viewer/contexts/entity-viewer-ids-context/EntityViewerIdsContext';

const useEntityViewerIds = () => {
  const entityViewerIdsContext = useContext(EntityViewerIdsContext);

  if (!entityViewerIdsContext) {
    throw new Error(
      'useEntityViewerIds must be used with EntityViewerIdsContext Provider'
    );
  }

  return entityViewerIdsContext;
};

export default useEntityViewerIds;
