import React, { FunctionComponent } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';

import { RootState } from '../rootReducer';
import { getLaunchbarExpanded } from '../header/headerSelectors';

import Home from './home/Home';
import App from './app/App';

import styles from './Content.scss';

type StateProps = {
  launchbarExpanded: boolean;
};

type OwnProps = {};

type ContentProps = RouteComponentProps & StateProps & OwnProps;

export const getHeightClass = (launchbarExpanded: boolean): string => {
  return launchbarExpanded ? styles.shorter : styles.taller;
};

export const Content: FunctionComponent<ContentProps> = (
  props: ContentProps
) => {
  return (
    <main
      className={`${styles.content} ${getHeightClass(props.launchbarExpanded)}`}
    >
      <Route path="/" component={Home} exact={true} />
      <Route path="/app" component={App} />
    </main>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  launchbarExpanded: getLaunchbarExpanded(state)
});

export default withRouter(connect(mapStateToProps)(Content));
