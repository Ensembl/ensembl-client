import React, { FunctionComponent, memo } from 'react';
import { connect } from 'react-redux';

import { RootState } from 'src/rootReducer';
import { changeCurrentApp } from '../headerActions';
import Launchbar from './Launchbar';
import { getCurrentApp, getLaunchbarExpanded } from '../headerSelectors';

type StateProps = {
  currentApp: string;
  launchbarExpanded: boolean;
};

type DispatchProps = {
  changeCurrentApp: (currentApp: string) => void;
};

type OwnProps = {};

type LaunchbarContainerProps = StateProps & DispatchProps & OwnProps;

export const LaunchbarContainer: FunctionComponent<
  LaunchbarContainerProps
> = memo((props) => <Launchbar {...props} />);

const mapStateToProps = (state: RootState): StateProps => ({
  currentApp: getCurrentApp(state),
  launchbarExpanded: getLaunchbarExpanded(state)
});

const mapDispatchToProps: DispatchProps = {
  changeCurrentApp
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LaunchbarContainer);
