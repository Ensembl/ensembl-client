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
import { useParams } from 'react-router-dom';

import EntityViewerInterstitialInstructions from './entity-viewer-interstitial-instructions/EntityViewerInterstitialInstructions';
import AppBar from 'src/shared/components/app-bar/AppBar';
import { EntityViewerParams } from 'src/content/app/entity-viewer/EntityViewer';
import ExampleLinks from 'src/content/app/entity-viewer/components/example-links/ExampleLinks';
import EntityViewerAppBar from '../shared/components/entity-viewer-app-bar/EntityViewerAppBar';
import InAppSearch from 'src/shared/components/in-app-search/InAppSearch';

const EntityViewerInterstitial = () => {
  const params: EntityViewerParams = useParams(); // NOTE: will likely cause a problem when server-side rendering
  const { genomeId, entityId } = params;

  return (
    <>
      {!genomeId && !entityId ? (
        <>
          <AppBar
            appName="Entity Viewer"
            mainContent="To start using this app..."
          />
          <EntityViewerInterstitialInstructions />
        </>
      ) : (
        <>
          <EntityViewerAppBar />
          <InAppSearch />
          <ExampleLinks />
        </>
      )}
    </>
  );
};

export default EntityViewerInterstitial;

{
  /* <>

<EntityViewerInterstitialInstructions />
</> */
}
