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

import * as urlFor from 'src/shared/helpers/urlHelper';
import { parseFeatureId } from 'src/content/app/genome-browser/helpers/browserHelper';
import { buildFocusIdForUrl } from 'src/shared/state/ens-object/ensObjectHelpers';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browserSelectors';

import { ToggleButton as ToolboxToggleButton } from 'src/shared/components/toolbox';
import ViewInApp, { UrlObj } from 'src/shared/components/view-in-app/ViewInApp';

import styles from './Zmenu.scss';

type Props = {
  featureId: string;
  destroyZmenu: () => void;
};

const ZmenuAppLinks = (props: Props) => {
  const genomeId = useSelector(getBrowserActiveGenomeId);

  const parsedFeatureId = parseFeatureId(`${genomeId}:${props.featureId}`);

  if (parsedFeatureId.type !== 'gene') {
    return null;
  }

  const featureIdForUrl = buildFocusIdForUrl(parsedFeatureId);

  const getBrowserLink = () =>
    urlFor.browser({ genomeId, focus: featureIdForUrl });

  const links: UrlObj = {
    genomeBrowser: {
      url: getBrowserLink(),
      replaceState: true
    },
    entityViewer: {
      url: urlFor.entityViewer({
        genomeId,
        entityId: featureIdForUrl
      })
    }
  };
  return (
    <div className={styles.zmenuAppLinks}>
      <ToolboxToggleButton
        className={styles.zmenuToggleFooter}
        label="Download"
      />
      <ViewInApp links={links} onAnyAppClick={props.destroyZmenu} />
    </div>
  );
};

export default ZmenuAppLinks;
