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

import { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import { getSelectedGeneViewTabs } from 'src/content/app/entity-viewer/state/gene-view/view/geneViewViewSelectors';
import {
  GeneViewTabMap,
  GeneViewTabName,
  GeneFunctionTabName,
  View
} from 'src/content/app/entity-viewer/state/gene-view/view/geneViewViewSlice';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { isProteinCodingTranscript } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import useEntityViewerAnalytics from 'src/content/app/entity-viewer/hooks/useEntityViewerAnalytics';

import Tabs, { type Tab } from 'src/shared/components/tabs/Tabs';
import Panel from 'src/shared/components/panel/Panel';
import ProteinsList from '../proteins-list/ProteinsList';

import type { DefaultEntityViewerGene } from 'src/content/app/entity-viewer/state/api/queries/defaultGeneQuery';

import styles from './GeneFunction.module.css';

const getTabsData = () => {
  // TODO: the isDisabled flags are hardcoded here since we do not have any data available.
  // We need to update this logic once we have the data available
  return [...GeneViewTabMap.values()]
    .filter(({ primaryTab }) => primaryTab === GeneViewTabName.GENE_FUNCTION)
    .map((item) => ({
      title: item.secondaryTab,
      isDisabled: item.view !== View.PROTEIN
    })) as Tab[];
};

const tabClassNames = {
  default: styles.defaultTabName,
  selected: styles.selectedTabName
};

export type Props = {
  gene: DefaultEntityViewerGene;
};

const GeneFunction = (props: Props) => {
  const navigate = useNavigate();
  const selectedTabName = useSelector(getSelectedGeneViewTabs)
    .secondaryTab as GeneFunctionTabName;

  const { genomeId, entityId } = useParams() as { [key: string]: string };
  const transcripts = props.gene.transcripts_page.transcripts;
  const { trackTabChange } = useEntityViewerAnalytics();

  const changeTab = useCallback(
    (tab: string) => {
      const match = [...GeneViewTabMap.entries()].find(
        ([, { secondaryTab }]) => secondaryTab === tab
      );

      if (!match) {
        return;
      }
      trackTabChange(tab);
      const [view] = match;
      const url = urlFor.entityViewer({
        genomeId,
        entityId,
        view
      });

      navigate(url);
    },
    [entityId, genomeId, navigate, trackTabChange]
  );

  // Check if we have at least one protein coding transcript
  const hasProteinCodingTranscripts = transcripts.some(
    isProteinCodingTranscript
  );

  const tabsData = useMemo(() => {
    const tabsData = getTabsData();
    if (!hasProteinCodingTranscripts) {
      const proteinTabIndex = tabsData.findIndex(
        (tab) => tab.title === GeneFunctionTabName.PROTEINS
      );

      tabsData[proteinTabIndex].isDisabled = true;
    }
    return tabsData;
  }, [hasProteinCodingTranscripts]);

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
    <Panel
      header={
        <TabWrapper
          tabs={tabsData}
          selectedTabName={selectedTabName}
          onTabChange={changeTab}
        />
      }
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

const TabWrapper = ({
  tabs,
  selectedTabName,
  onTabChange
}: {
  tabs: Tab[];
  selectedTabName: GeneFunctionTabName;
  onTabChange: (tab: string) => void;
}) => {
  return (
    <Tabs
      tabs={tabs}
      selectedTab={selectedTabName}
      classNames={tabClassNames}
      onTabChange={onTabChange}
    />
  );
};

export default GeneFunction;
