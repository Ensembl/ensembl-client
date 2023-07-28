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

  const { region_name, start, id } = variantMetadata;
  const variantId = `${region_name}:${start}:${id}`;
  const featureId = `variant:${variantId}`;

  const linkToVariantInGenomeBrowser = urlFor.browser({
    genomeId: genomeIdForUrl,
    focus: featureId
  });

  return (
    <>
      <ZmenuContent
        features={content}
        featureId={featureId}
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

export default VariantZmenu;
