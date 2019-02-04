import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';

import { RootState } from '../rootReducer';
import { getLaunchbarExpanded } from '../header/headerSelectors';

import App from './app/App';

import styles from './Content.scss';

type StateProps = {
  launchbarExpanded: boolean;
};

type OwnProps = {};

type ContentProps = RouteComponentProps & StateProps & OwnProps;

export class Content extends Component<ContentProps> {
  public render() {
    return (
      <main className={`${styles.content} ${this.getExpandClass()}`}>
        <Route path="/app" component={App} />
      </main>
    );
  }

  private getExpandClass(): string {
    return this.props.launchbarExpanded ? '' : styles.expanded;
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  launchbarExpanded: getLaunchbarExpanded(state)
});

export default withRouter(connect(mapStateToProps)(Content));
