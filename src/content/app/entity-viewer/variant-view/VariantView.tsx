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

import useEntityViewerIds from 'src/content/app/entity-viewer/hooks/useEntityViewerIds';

import { useDefaultEntityViewerVariantQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

import styles from './VariantView.module.css';

const VariantView = () => {
  const { activeGenomeId, parsedEntityId } = useEntityViewerIds();

  const { objectId: variantId } = parsedEntityId ?? {};

  const { currentData } = useDefaultEntityViewerVariantQuery(
    {
      genomeId: activeGenomeId ?? '',
      variantId: variantId ?? ''
    },
    {
      skip: !activeGenomeId || !variantId
    }
  );

  const variantData = currentData?.variant;

  return (
    <div className={styles.container}>
      {variantData && (
        <>
          <div style={{ height: '200px', textAlign: 'center' }}>
            Placeholder for navigation panel for variant {variantData.name}
          </div>
          <div style={{ textAlign: 'center' }}>
            Placeholder for the image for variant {variantData.name}
          </div>
        </>
      )}
    </div>
  );
};

export default VariantView;
