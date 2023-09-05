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

import * as urlFor from 'src/shared/helpers/urlHelper';
import { getChrLocationStr } from 'src/content/app/genome-browser/helpers/browserHelper';
import { buildFocusVariantId } from 'src/shared/helpers/focusObjectHelpers';
import { isEnvironment, Environment } from 'src/shared/helpers/environment';

import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';

import ZmenuContent from '../ZmenuContent';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';

import type {
  ZmenuPayload,
  ZmenuContentVariantMetadata
} from 'src/content/app/genome-browser/services/genome-browser-service/types/zmenu';

import styles from '../Zmenu.scss';

type Props = {
  payload: ZmenuPayload;
  onDestroy: () => void;
};

const VariantZmenu = (props: Props) => {
  const { content } = props.payload;
  const { genomeIdForUrl } = useGenomeBrowserIds();

  const variantMetadata = content[0]?.metadata as
    | ZmenuContentVariantMetadata
    | undefined;

  if (!variantMetadata) {
    // something has gone wrong
    return null;
  }

  const variantId = buildFocusVariantId({
    regionName: variantMetadata.region_name,
    start: variantMetadata.start,
    variantName: variantMetadata.id
  });

  const locationForVariant = calculateLocation(
    variantMetadata.region_name,
    variantMetadata.start,
    variantMetadata.end
  );

  const linkToVariantInGenomeBrowser = urlFor.browser({
    genomeId: genomeIdForUrl,
    focus: variantId,
    location: locationForVariant
  });

  return (
    <>
      <ZmenuContent
        features={content}
        featureId={variantId}
        destroyZmenu={props.onDestroy}
      />
      {isEnvironment([Environment.DEVELOPMENT, Environment.INTERNAL]) && (
        <div className={styles.zmenuLinksGrid}>
          <ViewInApp
            theme="dark"
            links={{ genomeBrowser: { url: linkToVariantInGenomeBrowser } }}
            onAnyAppClick={props.onDestroy}
            className={styles.zmenuAppLinks}
          />
        </div>
      )}
    </>
  );
};

/**
 * Consider that the genome browser shows the detailed zoomed-in view for variants
 * at scales 2**1 to 2**6 base pairs. 2**6 is 64; and when the genome browser zooms out to this point,
 * it switches to the zoomed-out view.
 */
const MAX_NUCLEOTIDES_PER_VIEWPORT = 64 - 2;
const MIN_NUCLEOTIDES_PER_VIEWPORT = 32;

const calculateLocation = (
  regionName: string,
  variantStart: number,
  variantEnd: number
) => {
  const variantLength = variantEnd - variantStart;
  const variantMidpoint = variantStart + Math.ceil(variantLength / 2);

  let start: number;
  let end: number;

  if (variantLength < MIN_NUCLEOTIDES_PER_VIEWPORT) {
    start = variantMidpoint - MIN_NUCLEOTIDES_PER_VIEWPORT / 2;
    end = variantMidpoint + MIN_NUCLEOTIDES_PER_VIEWPORT / 2;
  } else if (variantLength <= MAX_NUCLEOTIDES_PER_VIEWPORT) {
    start = variantMidpoint - MAX_NUCLEOTIDES_PER_VIEWPORT / 2;
    end = variantMidpoint + MAX_NUCLEOTIDES_PER_VIEWPORT / 2;
  } else {
    const viewportSize = variantLength / 0.7; // variant should take 70% of the viewport
    const halfViewportSize = Math.ceil(viewportSize / 2);
    start = Math.max(variantMidpoint - halfViewportSize, 0);
    end = variantMidpoint + halfViewportSize; // hopefully, this won't exceed region length; might be a problem for circular chromosomes
  }

  return getChrLocationStr([regionName, start, end]);
};

export default VariantZmenu;
