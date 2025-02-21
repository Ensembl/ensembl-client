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

import { useNavigate, useLocation } from 'react-router';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { isProductionEnvironment } from 'src/shared/helpers/environment';

import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';
import useGenomeBrowser from '../../hooks/useGenomeBrowser';

import ViewInApp, {
  type LinksConfig
} from 'src/shared/components/view-in-app/ViewInApp';

import styles from './Zmenu.module.css';

type Props = {
  featureId: string;
  destroyZmenu: () => void;
};

const ZmenuAppLinks = (props: Props) => {
  const { featureId } = props; // feature id here is passed in the format suitable for urls
  const { genomeIdForUrl, focusObjectIdForUrl, focusObjectId } =
    useGenomeBrowserIds();
  const { changeFocusObject } = useGenomeBrowser();
  const navigate = useNavigate();

  const { search } = useLocation();
  const urlSearchParams = new URLSearchParams(search);
  const locationInUrl = urlSearchParams.get('location');

  const onGenomeBrowserAppClick = () => {
    if (!(focusObjectIdForUrl && focusObjectId)) {
      return;
    }

    const isFocusCurrentlyActive = featureId === focusObjectIdForUrl;

    if (isFocusCurrentlyActive) {
      changeFocusObject(focusObjectId);
    } else {
      navigate(
        urlFor.browser({
          genomeId: genomeIdForUrl,
          focus: featureId
        })
      );
    }
  };

  const links: LinksConfig = {
    genomeBrowser: onGenomeBrowserAppClick,
    entityViewer: {
      url: urlFor.entityViewer({
        genomeId: genomeIdForUrl,
        entityId: featureId
      })
    }
  };

  if (!isProductionEnvironment()) {
    // In the future, links to regulatory activity viewer will depend
    // on the presence of regulatory annotation for a given genome
    links.activityViewer = {
      url: urlFor.regulatoryActivityViewer({
        genomeId: genomeIdForUrl,
        location: locationInUrl
      })
    };
  }

  return (
    <div className={styles.zmenuAppLinks}>
      <ViewInApp
        theme="dark"
        links={links}
        onAnyAppClick={props.destroyZmenu}
      />
    </div>
  );
};

export default ZmenuAppLinks;
