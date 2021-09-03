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
import { parseFeatureId } from 'src/content/app/browser/browserHelper';
import { buildFocusIdForUrl } from 'src/shared/state/ens-object/ensObjectHelpers';

import {
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObjectId,
  isFocusObjectPositionDefault
} from '../browserSelectors';

import { ToggleButton as ToolboxToggleButton } from 'src/shared/components/toolbox';
import ViewInApp, { UrlObj } from 'src/shared/components/view-in-app/ViewInApp';

import styles from './Zmenu.scss';

type Props = {
  featureId: string;
};

const ZmenuAppLinks = (props: Props) => {
  const genomeId = useSelector(getBrowserActiveGenomeId);
  const activeFeatureId = useSelector(getBrowserActiveEnsObjectId);
  const isInDefaultPosition = useSelector(isFocusObjectPositionDefault);

  const parsedFeatureId = parseFeatureId(`${genomeId}:${props.featureId}`);

  if (parsedFeatureId.type !== 'gene') {
    return null;
  }

  const featureIdForUrl = buildFocusIdForUrl(parsedFeatureId);

  const getBrowserLink = () =>
    urlFor.browser({ genomeId, focus: featureIdForUrl });

  const getEntityViewerLink = () =>
    urlFor.entityViewer({
      genomeId,
      entityId: featureIdForUrl
    });

  const shouldShowBrowserButton =
    props.featureId !== activeFeatureId || !isInDefaultPosition;

  const links: UrlObj = {};

  if (shouldShowBrowserButton) {
    links['genomeBrowser'] = {
      url: getBrowserLink(),
      replaceState: true
    };
  }

  links['entityViewer'] = { url: getEntityViewerLink() };

  return (
    <div className={styles.zmenuAppLinks}>
      <ViewInApp links={links} />
      <ToolboxToggleButton
        className={styles.zmenuToggleFooter}
        openElement={<span>Download</span>}
      />
    </div>
  );
};

export default ZmenuAppLinks;
