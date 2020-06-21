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
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { push, Push } from 'connected-react-router';

import * as urlFor from 'src/shared/helpers/urlHelper';

import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';

import { RootState } from 'src/store';
import {
  GeneViewTabName,
  View
} from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewState.ts';
import { getSelectedGeneViewTabs } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewSelectors';

import styles from './GeneViewTabs.scss';

const tabsData: Tab[] = [
  { title: 'Transcripts' },
  { title: 'Gene function' },
  { title: 'Gene relationships' }
];

const DEFAULT_TAB = tabsData[0].title;

type Props = {
  selectedGeneTabName: string;
  push: Push;
};

const GeneViewTabs = (props: Props) => {
  const { genomeId, entityId } = useParams() as { [key: string]: string };
  const tabClassNames = {
    default: styles.geneTab,
    selected: styles.selectedGeneTab,
    disabled: styles.disabledGeneTab,
    tabsContainer: styles.geneViewTabs
  };

  const onTabChange = (selectedTabName: string) => {
    let view;
    if (selectedTabName === GeneViewTabName.GENE_FUNCTION) {
      view = View.PROTEIN;
    } else if (selectedTabName === GeneViewTabName.GENE_RELATIONSHIPS) {
      view = View.ORTHOLOGUES;
    }
    const url = urlFor.entityViewer({
      genomeId,
      entityId,
      view
    });
    props.push(url);
  };

  return (
    <Tabs
      classNames={tabClassNames}
      tabs={tabsData}
      selectedTab={props.selectedGeneTabName || DEFAULT_TAB}
      onTabChange={onTabChange}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  selectedGeneTabName: getSelectedGeneViewTabs(state).primaryTab
});

const mapDispatchToProps = {
  push
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneViewTabs);
