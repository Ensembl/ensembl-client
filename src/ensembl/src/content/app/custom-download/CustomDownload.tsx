import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PreFilterPanel from 'src/content/app/custom-download/containers/pre-filters-panel/PreFilterPanel';
import {
  getShowPreFilterPanel,
  getCustomDownloadActiveGenomeId
} from './state/customDownloadSelectors';
import { RootState } from 'src/store';
import CustomDownloadHeader from './containers/header/CustomDownloadHeader';
import CustomDownloadContent from './containers/content/CustomDownloadContent';
import CustomDownloadAppBar from './containers/app-bar/CustomDownloadAppBar';
import { setActiveGenomeId } from './state/customDownloadActions';
import { CommittedItem } from 'src/content/app/species-selector/types/species-search';
import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

type StateProps = {
  shouldShowPreFilterPanel: boolean;
  activeGenomeId: string | null;
  committedItems: CommittedItem[];
};

type DispatchProps = {
  setActiveGenomeId: (activeGenomeId: string) => void;
};

type CustomDownloadProps = StateProps & DispatchProps;

const CustomDownload = (props: CustomDownloadProps) => {
  useEffect(() => {
    if (!props.activeGenomeId && props.committedItems.length) {
      props.setActiveGenomeId(props.committedItems[0].genome_id);
    }
  }, []);

  if (!props.activeGenomeId) {
    return null;
  }
  return (
    <>
      <CustomDownloadAppBar onSpeciesSelect={props.setActiveGenomeId} />
      {props.shouldShowPreFilterPanel && <PreFilterPanel />}
      {!props.shouldShowPreFilterPanel && (
        <>
          <CustomDownloadHeader />
          <CustomDownloadContent />
        </>
      )}
    </>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  shouldShowPreFilterPanel: getShowPreFilterPanel(state),
  activeGenomeId: getCustomDownloadActiveGenomeId(state),
  committedItems: getCommittedSpecies(state)
});

const mapDispatchToProps: DispatchProps = {
  setActiveGenomeId
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomDownload);
