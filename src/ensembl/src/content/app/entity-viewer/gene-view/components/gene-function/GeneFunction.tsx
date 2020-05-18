import React from 'react';
import { connect } from 'react-redux';

import { isEntityViewerSidebarOpen } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';
import { getEntityViewerActiveGeneFunction } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewSelectors';
import { setActiveGeneFunctionTab } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewActions';

import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';
import Panel from 'src/shared/components/panel/Panel';
import ProteinsList from '../proteins-list/ProteinsList';

import { RootState } from 'src/store';
import { GeneFunctionTabName } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewState.ts';

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
  default: styles.defaultTabName,
  selected: styles.selectedTabName
};

type Props = {
  geneId: string;
  isNarrow: boolean;
  selectedTabName: GeneFunctionTabName;
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
        selectedTab={props.selectedTabName}
        classNames={tabClassNames}
        onTabChange={onTabChange}
      />
    );
  };

  const getCurrentTabContent = () => {
    switch (props.selectedTabName) {
      case GeneFunctionTabName.PROTEINS:
        return <ProteinsList geneId={props.geneId} />;
      default:
        return <></>;
    }
  };

  return (
    <Panel
      header={<TabWrapper />}
      classNames={{
        panel: props.isNarrow ? styles.narrowPanel : styles.fullWidthPanel,
        body: styles.panelBody
      }}
    >
      {getCurrentTabContent()}
    </Panel>
  );
};

const mapStateToProps = (state: RootState) => ({
  isNarrow: isEntityViewerSidebarOpen(state),
  selectedTabName: getEntityViewerActiveGeneFunction(state).selectedTabName
});

const mapDispatchToProps = {
  setActiveGeneFunctionTab
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneFunction);
