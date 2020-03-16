import React from 'react';
import { connect } from 'react-redux';

import { RootState } from 'src/store';
import { getEntityViewerActiveGeneTab } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewSelectors';
import { setActiveGeneTab } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewActions';

import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';

import styles from './GeneViewTabs.scss';

const tabsData: Tab[] = [
  { title: 'Transcripts' },
  { title: 'Gene function' },
  { title: 'Gene relationships' }
];

const DEFAULT_TAB = tabsData[0].title;

type Props = {
  selectedGeneTabName: string | null;
  setActiveGeneTab: (selectedTabName: string) => void;
};

const GeneViewTabs = (props: Props) => {
  const tabClassNames = {
    default: styles.geneTab,
    selected: styles.selectedGeneTab,
    disabled: styles.disabledGeneTab,
    tabsContainer: styles.geneViewTabs
  };

  const onTabChange = (selectedTabName: string) => {
    if (selectedTabName === props.selectedGeneTabName) {
      props.setActiveGeneTab(DEFAULT_TAB);
      return;
    }

    props.setActiveGeneTab(selectedTabName);
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
  selectedGeneTabName: getEntityViewerActiveGeneTab(state)
});

const mapDispatchToProps = {
  setActiveGeneTab
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneViewTabs);
