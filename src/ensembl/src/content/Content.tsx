/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
