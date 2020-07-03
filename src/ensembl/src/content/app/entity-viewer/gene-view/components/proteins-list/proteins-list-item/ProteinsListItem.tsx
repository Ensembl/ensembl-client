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
import classNames from 'classnames';
import { connect } from 'react-redux';

import ProteinsListItemInfo from '../proteins-list-item-info/ProteinsListItemInfo';

import { toggleProteinInfo } from 'src/content/app/entity-viewer/state/gene-view/proteins/entityViewerGeneViewProteinsActions';
import { getProteinsUI } from 'src/content/app/entity-viewer/state/gene-view/proteins/entityViewerGeneViewProteinsSelectors';

import { RootState } from 'src/store';
import { Transcript } from 'src/content/app/entity-viewer/types/transcript';
import { EntityViewerGeneViewProteinsUI } from 'src/content/app/entity-viewer/state/gene-view/proteins/entityViewerGeneViewProteinsState';

import transcriptsListStyles from 'src/content/app/entity-viewer/gene-view/components/default-transcripts-list/DefaultTranscriptsList.scss';
import styles from './ProteinsListItem.scss';

type Props = {
  transcript: Transcript;
  trackLength: number;
  proteinsUI: EntityViewerGeneViewProteinsUI;
  toggleProteinInfo: (id: string) => void;
};

const ProteinsListItem = (props: Props) => {
  const { transcript, trackLength } = props;

  const expandedProteinIds = props.proteinsUI?.expandedProteinIds;

  const toggleListItemInfo = () => props.toggleProteinInfo(transcript.id);

  const midStyles = classNames(transcriptsListStyles.middle, styles.middle);

  return (
    <>
      <div className={transcriptsListStyles.row}>
        <div className={transcriptsListStyles.left}></div>
        {transcript.cds && (
          <div onClick={toggleListItemInfo} className={midStyles}>
            <div>{transcript.cds.protein_length} aa</div>
            <div>Protein description from UniProt</div>
            <div>{transcript.cds.protein_id}</div>
          </div>
        )}
        <div
          className={transcriptsListStyles.right}
          onClick={toggleListItemInfo}
        >
          <span className={styles.transcriptId}>{props.transcript.id}</span>
        </div>
      </div>
      {expandedProteinIds?.includes(transcript.id) ? (
        <ProteinsListItemInfo
          transcript={transcript}
          trackLength={trackLength}
        />
      ) : null}
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  proteinsUI: getProteinsUI(state)
});

const mapDispatchToProps = {
  toggleProteinInfo
};

export default connect(mapStateToProps, mapDispatchToProps)(ProteinsListItem);
