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

import { Link } from 'react-router';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { getGenomicLocationString } from 'src/shared/helpers/genomicLocationHelpers';

import useActivityViewerIds from 'src/content/app/regulatory-activity-viewer/hooks/useActivityViewerIds';

import styles from './ActivityViewerInterstitial.module.css';

/**
 * Component to display when url does not contain enough data
 * to display regulatory activity
 */

const ActivityViewerInterstitial = () => {
  const { genomeIdForUrl, assemblyAccessionId } = useActivityViewerIds();
  let location: string | null = null;

  if (assemblyAccessionId === humanAssemblyId) {
    location = getGenomicLocationString(mockHumanLocation);
  } else if (assemblyAccessionId === mouseAssemblyId) {
    location = getGenomicLocationString(mockMouseLocation);
  }

  if (!location) {
    return (
      <div>
        <div className={styles.topPanel} />
        <div className={styles.main}>
          Please select reference human or reference mouse assembly.
        </div>
      </div>
    );
  }

  const url = urlFor.regulatoryActivityViewer({
    genomeId: genomeIdForUrl,
    location
  });

  return (
    <div>
      <div className={styles.topPanel} />
      <div className={styles.main}>
        <Link to={url}>Example location</Link>
      </div>
    </div>
  );
};

const humanAssemblyId = 'GCA_000001405.29';
const mouseAssemblyId = 'GCA_000001635.9';

const mockHumanLocation = {
  regionName: '17',
  start: 58190566,
  end: 58290566 // <-- 100kB slice
  // end: 59190566 // <-- 1MB slice; switch to it when backend apis get faster
};

const mockMouseLocation = {
  regionName: '5',
  start: 28645230,
  end: 29636061
};

export default ActivityViewerInterstitial;
