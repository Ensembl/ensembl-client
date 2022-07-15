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
import { parseFocusIdFromUrl } from 'src/shared/helpers/focusObjectHelpers';

import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';

import { ToggleButton as ToolboxToggleButton } from 'src/shared/components/toolbox';
import ViewInApp, { UrlObj } from 'src/shared/components/view-in-app/ViewInApp';

import styles from './Zmenu.scss';

type Props = {
  featureId: string;
  destroyZmenu: () => void;
};

const ZmenuAppLinks = (props: Props) => {
  const { featureId } = props; // feature id here is passed in the format suitable for urls
  const { genomeIdForUrl } = useGenomeBrowserIds();

  const { type: featureType } = parseFocusIdFromUrl(featureId);

  if (featureType !== 'gene') {
    return null;
  }

  const links: UrlObj = {
    genomeBrowser: {
      url: urlFor.browser({
        genomeId: genomeIdForUrl,
        focus: featureId
      }),
      replaceState: true
    },
    entityViewer: {
      url: urlFor.entityViewer({
        genomeId: genomeIdForUrl,
        entityId: featureId
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
