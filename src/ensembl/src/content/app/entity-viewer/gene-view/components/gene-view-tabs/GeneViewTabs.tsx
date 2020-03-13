import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';
import { getEntityViewerActiveGeneTab } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewSelectors';
import { setActiveGeneTab } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewActions';

import styles from './GeneViewTabs.scss';

const tabsData: Tab[] = [
  { title: 'Transcripts' },
  { title: 'Gene function' },
  { title: 'Gene relationships' }
];

type Props = {
  selectedGeneTabName: string | null;
  setActiveGeneTab: (selectedTabName: string) => void;
};

const GeneViewTabs = (props: Props) => {
  const tabClassNames = {
    default: styles.geneTab,
    selected: styles.selectedGeneTabName,
    disabled: styles.disabledGeneTab,
    tabsContainer: styles.geneViewTabs
  };

  return (
    <Tabs
      classNames={tabClassNames}
      tabs={tabsData}
      selectedTab={props.selectedGeneTabName || 'Transcripts'}
      onTabChange={props.setActiveGeneTab}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  selectedGeneTabName: getEntityViewerActiveGeneTab(state)
});

const mapDispatchToProps = {
  setActiveGeneTab
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneViewTabs);
