import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import PreFilterPanel from 'src/content/app/custom-download/containers/pre-filters-panel/PreFilterPanel';
import { getShowPreFilterPanel } from './customDownloadSelectors';
import { RootState } from 'src/store';
import Header from './containers/header/Header';
import Content from './containers/content/Content';

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
          <Header /> <Content />
        </>
      )}
    </>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  showPreFiltersPanel: getShowPreFilterPanel(state)
});

export default connect(mapStateToProps)(CustomDownload);
