import React from 'react';
import { connect } from 'react-redux';
import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';
import Panel from 'src/shared/components/panel/Panel';
import { RootState } from 'src/store';
import { isEntityViewerSidebarOpen } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';
import { getEntityViewerActiveGeneFunction } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneSelectors';
import { setActiveGeneFunctionTab } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneActions';

import styles from './GeneFunction.scss';

const tabsData: Tab[] = [
  { title: 'Proteins' },
  { title: 'Variants' },
  { title: 'Phenotypes' },
  { title: 'Gene expression' },
  { title: 'Gene ontology', isDisabled: true },
  { title: 'Gene pathways' }
];

const tabClassNames = {
  selected: styles.selectedTab,
  default: styles.defaultTab
};

type Props = {
  isSidebarOpen: boolean;
  selectedTab: string;
  setActiveGeneFunctionTab: (tab: string) => void;
};

const GeneFunction = (props: Props) => {
  const TabWrapper = () => {
    const onTabChange = (tab: string) => {
      props.setActiveGeneFunctionTab(tab);
    };

    return (
      <Tabs
        tabs={tabsData}
        selectedTab={props.selectedTab}
        classNames={tabClassNames}
        onTabChange={onTabChange}
      />
    );
  };

  return (
    <Panel
      header={<TabWrapper />}
      classNames={{
        panel: props.isSidebarOpen
          ? styles.shrinkedPanel
          : styles.fullWidthPanel
      }}
    >
      <div>Panel content is coming...</div>
    </Panel>
  );
};

const mapStateToProps = (state: RootState) => ({
  isSidebarOpen: isEntityViewerSidebarOpen(state),
  selectedTab: getEntityViewerActiveGeneFunction(state).selectedTab
});

const mapDispatchToProps = {
  setActiveGeneFunctionTab
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneFunction);
