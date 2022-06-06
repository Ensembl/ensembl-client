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

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from 'src/store';
import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';

import { fetchExampleFocusObjects } from 'src/content/app/genome-browser/state/focus-object/focusObjectSlice';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { getExampleGenes } from 'src/content/app/genome-browser/state/focus-object/focusObjectSelectors';

import {
  parseFocusObjectId,
  buildFocusIdForUrl
} from 'src/shared/helpers/focusObjectHelpers';
import * as urlFor from 'src/shared/helpers/urlHelper';

import BrowserInterstitialInstructions from './browser-interstitial-instructions/BrowserInterstitialInstructions';
import InAppSearch from 'src/shared/components/in-app-search/InAppSearch';

import styles from './BrowserInterstitial.scss';

const BrowserInterstitial = () => {
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId);
  const { genomeIdForUrl } = useGenomeBrowserIds();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!activeGenomeId) {
      return;
    }
    dispatch(fetchExampleFocusObjects(activeGenomeId));
  }, [activeGenomeId]);

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
        />
      </div>
      <ExampleLinks />
    </div>
  );
};

const ExampleLinks = () => {
  const { genomeIdForUrl } = useGenomeBrowserIds();
  const focusObjects = useAppSelector(getExampleGenes);

  const links = focusObjects.map((exampleObject) => {
    const parsedFocusObjectId = parseFocusObjectId(exampleObject.object_id);
    const focusId = buildFocusIdForUrl(parsedFocusObjectId);
    const path = urlFor.browser({
      genomeId: genomeIdForUrl,
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
