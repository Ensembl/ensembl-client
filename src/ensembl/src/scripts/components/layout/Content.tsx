import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';

import { RootState } from '../../reducers';
import { getLaunchbarExpanded } from '../../selectors/headerSelectors';

import App from '../apps/App';

type StateProps = {
  launchbarExpanded: boolean;
};

type OwnProps = {};

type ContentProps = RouteComponentProps & StateProps & OwnProps;

export class Content extends Component<ContentProps> {
  public render() {
    return (
      <main className={this.getExpandClass()}>
        <Route path="/app" component={App} />
      </main>
    );
  }

  private getExpandClass() {
    return this.props.launchbarExpanded ? '' : 'expanded';
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  launchbarExpanded: getLaunchbarExpanded(state)
});

export default withRouter(connect(mapStateToProps)(Content));
