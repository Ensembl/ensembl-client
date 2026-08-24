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

import { memo } from 'react';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';

import ViewInAppPopup from 'src/shared/components/view-in-app-popup/ViewInAppPopup';

import type { PredictedTranscriptConsequence } from 'src/content/app/tools/vep/types/vepResultsResponse';

import commonStyles from '../../VepSubmissionResults.module.css';
import styles from './VepResultsTranscript.module.css';

type Props = {
  genomeId: string;
  transcript: PredictedTranscriptConsequence;
};

const VepResultsTranscript = (props: Props) => {
  const { genomeId, transcript } = props;

  const badges = [
    transcript.is_mane_select && 'MANE Select',
    transcript.is_mane_plus_clinical && 'MANE Plus Clinical',
    transcript.is_gencode_primary && 'GENCODE Primary',
    transcript.is_canonical && 'Canonical'
  ].filter((badge): badge is string => Boolean(badge));

  const focusIdForUrl = buildFocusIdForUrl({
    type: 'transcript',
    objectId: transcript.stable_id
  });

  const genomeBrowserUrl = urlFor.browser({
    genomeId,
    focus: focusIdForUrl
  });

  const featureExplorerUrl = urlFor.entityViewer({
    genomeId,
    entityId: focusIdForUrl
  });

  return (
    <>
      <div>
        <ViewInAppPopup
          links={{
            genomeBrowser: {
              url: genomeBrowserUrl
            },
            entityViewer: {
              url: featureExplorerUrl
            }
          }}
        >
          {transcript.stable_id}
        </ViewInAppPopup>
      </div>
      <div className={commonStyles.smallLight}>{transcript.biotype}</div>
      {badges.length > 0 && (
        <div className={styles.transcriptBadges}>
          {badges.map((badge) => (
            <span key={badge} className={styles.transcriptBadge}>
              {badge}
            </span>
          ))}
        </div>
      )}
    </>
  );
};

export default memo(VepResultsTranscript);
