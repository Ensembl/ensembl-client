import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';
import { getEntityViewerActiveGeneTab } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneSelectors';
import { setActiveGeneTab } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneActions';

import styles from './GeneViewTabs.scss';

const tabsData: Tab[] = [
  { title: 'Transcripts' },
  { title: 'Gene function' },
  { title: 'Gene relationships' }
];

type Props = {
  selectedGeneTab: string | null;
  setActiveGeneTab: (selectedTab: string) => void;
};

const GeneViewTabs = (props: Props) => {
  const tabClassNames = {
    default: styles.geneTab,
    selected: styles.selectedGeneTab,
    disabled: styles.disabledGeneTab
  };

  return (
    <Tabs
      classNames={tabClassNames}
      tabs={tabsData}
      selectedTab={props.selectedGeneTab || 'Transcripts'}
      onTabChange={props.setActiveGeneTab}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  selectedGeneTab: getEntityViewerActiveGeneTab(state)
});

const mapDispatchToProps = {
  setActiveGeneTab
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneViewTabs);
