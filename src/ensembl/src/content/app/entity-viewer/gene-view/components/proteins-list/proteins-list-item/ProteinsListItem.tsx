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

import { toggleExpandedProtein } from 'src/content/app/entity-viewer/state/gene-view/proteins/geneViewProteinsSlice';
import { getExpandedTranscriptIds } from 'src/content/app/entity-viewer/state/gene-view/proteins/geneViewProteinsSelectors';

import { RootState } from 'src/store';
import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

import transcriptsListStyles from 'src/content/app/entity-viewer/gene-view/components/default-transcripts-list/DefaultTranscriptsList.scss';
import styles from './ProteinsListItem.scss';

type Props = {
  transcript: Transcript;
  trackLength: number;
  expandedTranscriptIds: string[];
  toggleExpandedProtein: (id: string) => void;
};

const ProteinsListItem = (props: Props) => {
  const { transcript, trackLength } = props;

  const toggleListItemInfo = () =>
    props.toggleExpandedProtein(transcript.stable_id);

  const { product } = transcript.product_generating_contexts[0];

  const midStyles = classNames(transcriptsListStyles.middle, styles.middle);

  return (
    <>
      <div className={transcriptsListStyles.row}>
        <div className={transcriptsListStyles.left}></div>
        <div onClick={toggleListItemInfo} className={midStyles}>
          <div>{product?.length} aa</div>
          <div>Protein description from UniProt</div>
          <div>{product?.stable_id}</div>
        </div>
        <div
          className={transcriptsListStyles.right}
          onClick={toggleListItemInfo}
        >
          <span className={styles.transcriptId}>{transcript.stable_id}</span>
        </div>
      </div>
      {props.expandedTranscriptIds.includes(transcript.stable_id) ? (
        <ProteinsListItemInfo
          transcript={transcript}
          trackLength={trackLength}
        />
      ) : null}
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  expandedTranscriptIds: getExpandedTranscriptIds(state)
});

const mapDispatchToProps = {
  toggleExpandedProtein
};

export default connect(mapStateToProps, mapDispatchToProps)(ProteinsListItem);
