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

import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';

import {
  ToolboxExpandableContent,
  ToggleButton as ToolboxToggleButton
} from 'src/shared/components/toolbox';
import ZmenuContent from '../ZmenuContent';
import ZmenuInstantDownload from '../ZmenuInstantDownload';
import ZmenuAppLinks from '../ZmenuAppLinks';

import type {
  ZmenuContentTranscriptMetadata,
  ZmenuPayload
} from 'src/content/app/genome-browser/services/genome-browser-service/types/zmenu';

import styles from '../Zmenu.module.css';

type Props = {
  payload: ZmenuPayload;
  onDestroy: () => void;
};

const TranscriptZmenu = (props: Props) => {
  const { content: contentList } = props.payload;
  const content = contentList.at(0);

  if (!content) {
    return null;
  }

  const transcriptMetadata = content.metadata as ZmenuContentTranscriptMetadata;
  const transcriptId = transcriptMetadata.versioned_id;
  const transcriptIdForUrl = buildFocusIdForUrl({
    type: 'transcript',
    objectId: transcriptMetadata.unversioned_id
  });

  const mainContent = (
    <>
      <ZmenuContent
        features={contentList}
        featureId={transcriptId}
        destroyZmenu={props.onDestroy}
      />
      <div className={styles.zmenuLinksGrid}>
        <ToolboxToggleButton
          className={styles.zmenuToggleFooter}
          label="Download"
        />
        <ZmenuAppLinks
          featureId={transcriptIdForUrl}
          destroyZmenu={props.onDestroy}
        />
      </div>
    </>
  );

  const footerContent = (
    <div className={styles.zmenuFooterContent}>
      <ZmenuInstantDownload id={transcriptId} />
    </div>
  );

  return (
    <ToolboxExpandableContent
      mainContent={mainContent}
      footerContent={footerContent}
    />
  );
};

export default TranscriptZmenu;
