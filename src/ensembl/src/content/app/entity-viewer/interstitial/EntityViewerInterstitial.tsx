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

import { getEntityViewerActiveGenomeId } from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';

import EntityViewerInterstitialInstructions from './entity-viewer-interstitial-instructions/EntityViewerInterstitialInstructions';
import ExampleLinks from 'src/content/app/entity-viewer/components/example-links/ExampleLinks';
import InAppSearch from 'src/shared/components/in-app-search/InAppSearch';

import styles from './EntityViewerInterstitial.scss';

const EntityViewerInterstitial = () => {
  const activeGenomeId = useSelector(getEntityViewerActiveGenomeId);

  if (!activeGenomeId) {
    return <EntityViewerInterstitialInstructions />;
  }

  return (
    <div>
      <div className={styles.topPanel}>
        <InAppSearch
          app="entityViewer"
          mode="interstitial"
          genomeId={activeGenomeId}
        />
      </div>
      <ExampleLinks />
    </div>
  );
};

export default EntityViewerInterstitial;
