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

import useActivityViewerIds from 'src/content/app/regulatory-activity-viewer/hooks/useActivityViewerIds';
import { useExampleObjectsForGenomeQuery } from 'src/shared/state/genome/genomeApiSlice';

import styles from './ActivityViewerInterstitial.module.css';

/**
 * Component to display when there isn't enough information in the url
 * to show a specific regulatory activity view
 */

const ActivityViewerInterstitial = () => {
  const { genomeId, genomeIdForUrl } = useActivityViewerIds();
  const { data: exampleObjects } = useExampleObjectsForGenomeQuery(
    genomeId ?? '',
    {
      skip: !genomeId
    }
  );

  let exampleLocationLink;

  if (exampleObjects) {
    const exampleLocation = exampleObjects.find(
      (obj) => obj.type === 'location'
    );

    if (exampleLocation) {
      exampleLocationLink = urlFor.regulatoryActivityViewer({
        genomeId: genomeIdForUrl,
        location: exampleLocation.id
      });
    }
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

  return (
    <div>
      <div className={styles.topPanel} />
      <div className={styles.main}>
        {exampleLocationLink && (
          <Link to={exampleLocationLink}>Example location</Link>
        )}
      </div>
    </div>
  );
};

export default ActivityViewerInterstitial;
