import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { RootState } from '../../../../reducers';
import { changeCurrentApp } from '../../../../actions/headerActions';
import Launchbar from './Launchbar';
import {
  getCurrentApp,
  getLaunchbarExpanded
} from '../../../../selectors/headerSelectors';

type StateProps = {
  currentApp: string;
  launchbarExpanded: boolean;
};

type DispatchProps = {
  changeCurrentApp: (currentApp: string) => void;
};

type OwnProps = {};

type LaunchbarContainerProps = StateProps & DispatchProps & OwnProps;

export class LaunchbarContainer extends PureComponent<LaunchbarContainerProps> {
  public render() {
    return <Launchbar {...this.props} />;
  }
}

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
