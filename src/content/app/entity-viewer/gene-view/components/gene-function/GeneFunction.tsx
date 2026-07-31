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

import { useSelector } from 'react-redux';

import { getSelectedGeneViewTabs } from 'src/content/app/entity-viewer/state/gene-view/view/geneViewViewSelectors';
import { GeneFunctionTabName } from 'src/content/app/entity-viewer/state/gene-view/view/geneViewViewSlice';

import { isProteinCodingTranscript } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import { Panel, PanelHead, PanelBody } from 'src/shared/components/panel/Panel';
import ProteinsList from '../proteins-list/ProteinsList';

import type { DefaultEntityViewerGene } from 'src/content/app/entity-viewer/state/api/queries/defaultGeneQuery';

import styles from './GeneFunction.module.css';

export type Props = {
  gene: DefaultEntityViewerGene;
};

const GeneFunction = (props: Props) => {
  const selectedTabName = useSelector(getSelectedGeneViewTabs)
    .secondaryTab as GeneFunctionTabName;

  const transcripts = props.gene.transcripts;

  // Check if we have at least one protein coding transcript
  const hasProteinCodingTranscripts = transcripts.some(
    isProteinCodingTranscript
  );

  const getCurrentTabContent = () => {
    switch (selectedTabName) {
      case GeneFunctionTabName.PROTEINS:
        if (hasProteinCodingTranscripts) {
          return <ProteinsList gene={props.gene} />;
        }
        break;
      default:
        return <>No data</>;
    }
  };

  return (
    <Panel>
      <PanelHead className={styles.panelHead}>
        <span className={styles.selectedTab}>Proteins</span>
      </PanelHead>
      <PanelBody className={styles.panelBody}>
        {getCurrentTabContent()}
      </PanelBody>
    </Panel>
  );
};

export default GeneFunction;
