import React, { FunctionComponent } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { RootState } from '../store';
import { getLaunchbarExpanded } from '../header/headerSelectors';

import Home from './home/Home';
import App from './app/App';

type StateProps = {
  launchbarExpanded: boolean;
};

type OwnProps = {
  children: React.ReactNode;
};

type ContentProps = StateProps & OwnProps;

const ContentRoutes = () => (
  <>
    <Route path="/" component={Home} exact={true} />
    <Route path="/app" component={App} />
  </>
);

export const Content: FunctionComponent<ContentProps> = (
  props: ContentProps
) => {
  return <main>{props.children}</main>;
};

// helper for making the Content component testable (no need to render the whole component tree nested in Content)
export const withInnerContent = (innerContent: React.ReactNode) => (
  props: StateProps
) => <Content {...props}>{innerContent}</Content>;

const mapStateToProps = (state: RootState): StateProps => ({
  launchbarExpanded: getLaunchbarExpanded(state)
});

export default connect(mapStateToProps)(withInnerContent(<ContentRoutes />));
