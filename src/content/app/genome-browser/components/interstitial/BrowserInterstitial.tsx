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
import { Link } from 'react-router-dom';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-entity/browserEntitySelectors';
import { getExampleGenes } from 'src/shared/state/ens-object/ensObjectSelectors';

import {
  parseEnsObjectId,
  buildFocusIdForUrl
} from 'src/shared/state/ens-object/ensObjectHelpers';
import * as urlFor from 'src/shared/helpers/urlHelper';

import BrowserInterstitialInstructions from './browser-interstitial-instructions/BrowserInterstitialInstructions';
import InAppSearch from 'src/shared/components/in-app-search/InAppSearch';

import styles from './BrowserInterstitial.scss';

const BrowserInterstitial = () => {
  const activeGenomeId = useSelector(getBrowserActiveGenomeId);

  if (!activeGenomeId) {
    return <BrowserInterstitialInstructions />;
  }

  return (
    <div>
      <div className={styles.topPanel}>
        <InAppSearch
          app="genomeBrowser"
          genomeId={activeGenomeId}
          mode="interstitial"
        />
      </div>
      <ExampleLinks />
    </div>
  );
};

const ExampleLinks = () => {
  const activeGenomeId = useSelector(getBrowserActiveGenomeId);
  const ensObjects = useSelector(getExampleGenes);

  const links = ensObjects.map((exampleObject) => {
    const parsedEnsObjectId = parseEnsObjectId(exampleObject.object_id);
    const focusId = buildFocusIdForUrl(parsedEnsObjectId);
    const path = urlFor.browser({
      genomeId: activeGenomeId,
      focus: focusId
    });

    return (
      <div key={exampleObject.object_id}>
        <Link to={path} replace>
          Example {exampleObject.type}
        </Link>
      </div>
    );
  });

  return <div className={styles.exampleLinks}>{links}</div>;
};

export default BrowserInterstitial;
