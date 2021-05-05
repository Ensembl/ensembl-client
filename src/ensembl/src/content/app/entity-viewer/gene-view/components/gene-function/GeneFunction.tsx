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
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { push } from 'connected-react-router';

import { getSelectedGeneViewTabs } from 'src/content/app/entity-viewer/state/gene-view/view/geneViewViewSelectors';
import {
  GeneViewTabMap,
  GeneViewTabName,
  GeneFunctionTabName,
  View
} from 'src/content/app/entity-viewer/state/gene-view/view/geneViewViewSlice';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { isProteinCodingTranscript } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';
import Panel from 'src/shared/components/panel/Panel';
import ProteinsList, { ProteinsListProps } from '../proteins-list/ProteinsList';

import styles from './GeneFunction.scss';

// TODO: the isDisabled flags are hardcoded here since we do not have any data available.
// We need to update this logic once we have the data available
const tabsData = [...GeneViewTabMap.values()]
  .filter(({ primaryTab }) => primaryTab === GeneViewTabName.GENE_FUNCTION)
  .map((item) => ({
    title: item.secondaryTab,
    isDisabled: item.view !== View.PROTEIN
  })) as Tab[];

const tabClassNames = {
  default: styles.defaultTabName,
  selected: styles.selectedTabName
};

export type Props = {
  gene: ProteinsListProps['gene'];
};

const GeneFunction = (props: Props) => {
  const dispatch = useDispatch();
  const selectedTabName = useSelector(getSelectedGeneViewTabs)
    .secondaryTab as GeneFunctionTabName;

  const { genomeId, entityId } = useParams() as { [key: string]: string };
  const {
    gene: { transcripts }
  } = props;

  const changeTab = (tab: string) => {
    const match = [...GeneViewTabMap.entries()].find(
      ([, { secondaryTab }]) => secondaryTab === tab
    );

    if (!match) {
      return;
    }

    const [view] = match;
    const url = urlFor.entityViewer({
      genomeId,
      entityId,
      view
    });

    dispatch(push(url));
  };

  // Check if we have at least one protein coding transcript
  const hasProteinCodingTranscripts = transcripts.some(
    isProteinCodingTranscript
  );

  // Disable the Proteins tab if there are no transcripts data
  // TODO: We need a better logic to disable tabs once we have the data available for other tabs
  if (!hasProteinCodingTranscripts) {
    const proteinTabIndex = tabsData.findIndex(
      (tab) => tab.title === GeneFunctionTabName.PROTEINS
    );

    tabsData[proteinTabIndex].isDisabled = true;
  }

  const TabWrapper = () => {
    return (
      <Tabs
        tabs={tabsData}
        selectedTab={selectedTabName}
        classNames={tabClassNames}
        onTabChange={changeTab}
      />
    );
  };

  const getCurrentTabContent = () => {
    switch (selectedTabName) {
      case GeneFunctionTabName.PROTEINS:
        return hasProteinCodingTranscripts ? (
          <ProteinsList gene={props.gene} />
        ) : null;
      default:
        return <>Data for these views will be available soon...</>;
    }
  };

  return (
    <Panel
      header={<TabWrapper />}
      classNames={{
        panel: styles.panel,
        header: styles.header,
        body: styles.panelBody
      }}
    >
      {getCurrentTabContent()}
    </Panel>
  );
};

export default GeneFunction;
