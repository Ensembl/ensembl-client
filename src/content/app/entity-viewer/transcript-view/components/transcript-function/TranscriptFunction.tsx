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

import classNames from 'classnames';
import noop from 'lodash/noop';

import {
  isProteinCodingTranscript,
  getProductAminoAcidLength,
  getProteinDescription
} from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import Tabs, { type Tab } from 'src/shared/components/tabs/Tabs';
import Panel from 'src/shared/components/panel/Panel';
import ProteinsListItemInfo, {
  type Props as ProteinListItemInfoProps
} from 'src/content/app/entity-viewer/gene-view/components/proteins-list/proteins-list-item-info/ProteinsListItemInfo';
import { TranscriptQualityLabel } from 'src/content/app/entity-viewer/shared/components/default-transcript-label/TranscriptQualityLabel';

import type { DefaultEntityViewerTranscriptQueryResult } from 'src/content/app/entity-viewer/state/api/queries/transcriptDefaultQuery';

import transcriptsListStyles from 'src/content/app/entity-viewer/gene-view/components/default-transcripts-list/DefaultTranscriptsList.module.css';
import styles from './TranscriptFunction.module.css';

const tabsData: Tab[] = [
  { title: 'Protein' },
  { title: 'Variants', isDisabled: true },
  { title: 'Phenotypes', isDisabled: true }
];

const tabClassNames = {
  default: styles.tab,
  selected: styles.selectedTab,
  tabsContainer: styles.tabsContainer
};

type Props = {
  transcript: DefaultEntityViewerTranscriptQueryResult['transcript'];
};

const TranscriptFunction = (props: Props) => {
  const canDisplayProtein = isProteinCodingTranscript(props.transcript);

  return (
    <Panel
      header={<TabWrapper />}
      classNames={{
        panel: styles.panel,
        header: styles.header,
        body: styles.panelBody
      }}
    >
      {canDisplayProtein ? (
        <ProteinInfo
          transcript={
            props.transcript as ProteinListItemInfoProps['transcript']
          }
          gene={props.transcript.gene}
        />
      ) : (
        <div>This transcript is not protein-coding</div>
      )}
    </Panel>
  );
};

const ProteinInfo = ({
  transcript,
  gene
}: {
  transcript: ProteinListItemInfoProps['transcript'];
  gene: ProteinListItemInfoProps['gene'];
}) => {
  const { product } = transcript.product_generating_contexts[0];
  const proteinLength = getProductAminoAcidLength(transcript);

  // ProteinsListItemInfo component was developed for Feature Explorer gene view;
  // which is why it has "list" in its name, and also why it receives a "track length"
  // property (in gene view, proteins are drawn relative to the longest protein in a gene)
  return (
    <div className={styles.proteinInfo}>
      <div className={transcriptsListStyles.row}>
        <div className={transcriptsListStyles.left}>
          <TranscriptQualityLabel metadata={transcript.metadata} />
        </div>
        <div
          className={classNames(
            transcriptsListStyles.middle,
            styles.proteinInfoMiddle
          )}
        >
          <div>{getProductAminoAcidLength(transcript)} aa</div>
          <div>{getProteinDescription(product)}</div>
          <div className={styles.productStableId}>{product?.stable_id}</div>
        </div>
        <div className={transcriptsListStyles.right}>
          <span className={styles.transcriptId}>{transcript.stable_id}</span>
        </div>
      </div>
      <ProteinsListItemInfo
        transcript={transcript}
        gene={gene}
        trackLength={proteinLength}
      />
    </div>
  );
};

const TabWrapper = () => {
  return (
    <Tabs
      tabs={tabsData}
      selectedTab={tabsData[0].title}
      classNames={tabClassNames}
      onTabChange={noop}
    />
  );
};

export default TranscriptFunction;
