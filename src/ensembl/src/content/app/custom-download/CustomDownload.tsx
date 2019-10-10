import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import PreFilterPanel from 'src/content/app/custom-download/containers/pre-filters-panel/PreFilterPanel';
import { getShowPreFilterPanel } from './state/customDownloadSelectors';
import { RootState } from 'src/store';
import CustomDownloadHeader from './containers/header/CustomDownloadHeader';
import CustomDownloadContent from './containers/content/CustomDownloadContent';
import CustomDownloadAppBar from './containers/app-bar/CustomDownloadAppBar';
import { setActiveGenomeId } from './state/customDownloadActions';

type StateProps = {
  showPreFiltersPanel: boolean;
};

type DispatchProps = {
  setActiveGenomeId: (activeGenomeId: string | null) => void;
};

type CustomDownloadProps = StateProps & DispatchProps;

const CustomDownload: FunctionComponent<CustomDownloadProps> = (
  props: CustomDownloadProps
) => {
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
  showPreFiltersPanel: getShowPreFilterPanel(state)
});

const mapDispatchToProps: DispatchProps = {
  setActiveGenomeId
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomDownload);
