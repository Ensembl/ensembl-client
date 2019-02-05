import React, { FunctionComponent } from 'react';
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

export const Content: FunctionComponent<ContentProps> = (
  props: ContentProps
) => {
  const getExpandClass = (): string => {
    return props.launchbarExpanded ? '' : styles.expanded;
  };

  return (
    <main className={`${styles.content} ${getExpandClass()}`}>
      <Route path="/app" component={App} />
    </main>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  launchbarExpanded: getLaunchbarExpanded(state)
});

export default withRouter(connect(mapStateToProps)(Content));
