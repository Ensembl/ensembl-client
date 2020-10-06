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

import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import { connect, useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router';
import { replace } from 'connected-react-router';

import ProteinsListItemInfo from '../proteins-list-item-info/ProteinsListItemInfo';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { toggleExpandedProtein } from 'src/content/app/entity-viewer/state/gene-view/proteins/geneViewProteinsSlice';
import { getExpandedTranscriptIds } from 'src/content/app/entity-viewer/state/gene-view/proteins/geneViewProteinsSelectors';

import { RootState } from 'src/store';
import { Transcript } from 'src/content/app/entity-viewer/types/transcript';
import { View } from 'src/content/app/entity-viewer/state/gene-view/view/geneViewViewSlice';

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

  const dispatch = useDispatch();
  const params: { [key: string]: string } = useParams();
  const { genomeId, entityId } = params;
  const { search } = useLocation();
  const transcriptIdToFocus = new URLSearchParams(search).get('transcriptId');

  const toggleListItemInfo = () => {
    if (transcriptIdToFocus) {
      const url = urlFor.entityViewer({
        genomeId,
        entityId,
        view: View.PROTEIN
      });
      dispatch(replace(url));
    }
    props.toggleExpandedProtein(transcript.id);
  };

  const midStyles = classNames(transcriptsListStyles.middle, styles.middle);

  const itemRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (transcript.id === transcriptIdToFocus) {
      // give it some time for other expanded proteins to load
      itemRef.current?.scrollIntoView({
        behavior: 'smooth'
      });

      if (!props.expandedTranscriptIds.includes(transcriptIdToFocus)) {
        props.toggleExpandedProtein(transcript.id);
      }
    }
  }, [transcriptIdToFocus]);

  return (
    <div className={styles.proteinListItem} ref={itemRef}>
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
      {props.expandedTranscriptIds.includes(transcript.id) ? (
        <ProteinsListItemInfo
          transcriptId={transcript.id}
          trackLength={trackLength}
        />
      ) : null}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  expandedTranscriptIds: getExpandedTranscriptIds(state)
});

const mapDispatchToProps = {
  toggleExpandedProtein
};

export default connect(mapStateToProps, mapDispatchToProps)(ProteinsListItem);
