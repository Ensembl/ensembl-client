import React, { FunctionComponent, useEffect } from 'react';
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
import { getCommittedSpecies } from '../species-selector/state/speciesSelectorSelectors';
import { CommittedItem } from '../species-selector/types/species-search';

type StateProps = {
  showPreFiltersPanel: boolean;
  activeGenomeId: string | null;
  committedItems: CommittedItem[];
};

type DispatchProps = {
  setActiveGenomeId: (activeGenomeId: string | null) => void;
};

type CustomDownloadProps = StateProps & DispatchProps;

const CustomDownload: FunctionComponent<CustomDownloadProps> = (
  props: CustomDownloadProps
) => {
  useEffect(() => {
    if (!props.activeGenomeId && props.committedItems.length) {
      props.setActiveGenomeId(props.committedItems[0].genome_id);
    }
  }, [props.activeGenomeId]);

  if (!props.activeGenomeId) {
    return null;
  }
  return (
    <>
      <CustomDownloadAppBar onSpeciesSelect={props.setActiveGenomeId} />
      {props.showPreFiltersPanel && <PreFilterPanel />}
      {!props.showPreFiltersPanel && (
        <>
          <CustomDownloadHeader /> <CustomDownloadContent />
        </>
      )}
    </>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  showPreFiltersPanel: getShowPreFilterPanel(state),
  activeGenomeId: getCustomDownloadActiveGenomeId(state),
  committedItems: getCommittedSpecies(state)
});

const mapDispatchToProps: DispatchProps = {
  setActiveGenomeId
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomDownload);
