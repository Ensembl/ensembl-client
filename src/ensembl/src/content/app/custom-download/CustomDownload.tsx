import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import PreFilterPanel from 'src/content/app/custom-download/containers/pre-filters-panel/PreFilterPanel';
import { getShowPreFilterPanel } from './state/customDownloadSelectors';
import { RootState } from 'src/store';
import CustomDownloadHeader from './containers/header/CustomDownloadHeader';
import CustomDownloadContent from './containers/content/CustomDownloadContent';

type StateProps = {
  showPreFiltersPanel: any;
};

type CustomDownloadProps = StateProps;

const CustomDownload: FunctionComponent<CustomDownloadProps> = (
  props: CustomDownloadProps
) => {
  return (
    <>
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

export default connect(mapStateToProps)(CustomDownload);
