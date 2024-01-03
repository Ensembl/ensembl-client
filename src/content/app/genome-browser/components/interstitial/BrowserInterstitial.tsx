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
import { Link } from 'react-router-dom';

import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';
import useGenomeBrowserAnalytics from 'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics';

import { useExampleObjectsForGenomeQuery } from 'src/shared/state/genome/genomeApiSlice';

import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';
import * as urlFor from 'src/shared/helpers/urlHelper';

import BrowserInterstitialInstructions from './browser-interstitial-instructions/BrowserInterstitialInstructions';
import InAppSearch from 'src/shared/components/in-app-search/InAppSearch';
import { CircleLoader } from 'src/shared/components/loader';

import styles from './BrowserInterstitial.module.css';

const BrowserInterstitial = () => {
  const { activeGenomeId, genomeIdForUrl } = useGenomeBrowserIds();
  const { trackInterstitialPageSearch } = useGenomeBrowserAnalytics();

  if (!activeGenomeId) {
    return <BrowserInterstitialInstructions />;
  }

  return (
    <div>
      <div className={styles.topPanel}>
        <InAppSearch
          app="genomeBrowser"
          genomeId={activeGenomeId}
          genomeIdForUrl={genomeIdForUrl as string}
          mode="interstitial"
          onSearchSubmit={trackInterstitialPageSearch}
        />
      </div>
      <ExampleLinks />
    </div>
  );
};

const ExampleLinks = () => {
  const { activeGenomeId, genomeIdForUrl } = useGenomeBrowserIds();
  const { currentData, isLoading } = useExampleObjectsForGenomeQuery(
    activeGenomeId as string
  );

  if (isLoading) {
    return (
      <div className={styles.exampleLinks}>
        <CircleLoader />
      </div>
    );
  }

  const focusObjects = currentData || [];

  const exampleLinks = focusObjects.map((exampleObject) => {
    const focusId = buildFocusIdForUrl({
      type: exampleObject.type,
      objectId: exampleObject.id
    });
    const path = urlFor.browser({
      genomeId: genomeIdForUrl,
      focus: focusId
    });

    return (
      <div key={exampleObject.id}>
        <Link to={path} replace>
          Example {exampleObject.type}
        </Link>
      </div>
    );
  });

  return <div className={styles.exampleLinks}>{exampleLinks}</div>;
};

export default BrowserInterstitial;
