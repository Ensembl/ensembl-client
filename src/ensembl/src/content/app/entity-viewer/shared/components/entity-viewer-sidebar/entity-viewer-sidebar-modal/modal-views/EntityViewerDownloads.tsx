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

import React from 'react';
import { useSelector } from 'react-redux';

import {
  getEntityViewerActiveEntityId,
  getEntityViewerActiveGenomeId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';

import InstantDownloadGene from 'src/shared/components/instant-download/instant-download-gene/InstantDownloadGene';

import { parseEnsObjectId } from 'src/shared/state/ens-object/ensObjectHelpers';

const EntityViewerSidebarDownloads = () => {
  const genomeId = useSelector(getEntityViewerActiveGenomeId);
  const geneId = useSelector(getEntityViewerActiveEntityId);

  if (!genomeId || !geneId) {
    return null;
  }

  const { objectId } = parseEnsObjectId(geneId);

  return (
    <section>
      <h3>Download</h3>
      <InstantDownloadGene genomeId={genomeId} gene={{ id: objectId }} />
    </section>
  );
};

export default EntityViewerSidebarDownloads;
