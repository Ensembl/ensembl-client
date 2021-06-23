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

import React, { useEffect, ReactNode } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import routes from 'src/routes/routesConfig';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { changeCurrentApp } from 'src/header/headerActions';

import Header from 'src/header/Header';
import { NotFoundErrorScreen } from 'src/shared/components/error-screen';

type AppProps = {
  changeCurrentApp: (name: string) => void;
};

const App = (props: AppProps) => {
  const location = useLocation();

  useEffect(() => {
    const appName: string = location.pathname.split('/').filter(Boolean)[0];

    props.changeCurrentApp(appName);

    return function unsetApp() {
      props.changeCurrentApp('');
    };
  }, [location.pathname]);

  return (
    <>
      <Header />
      <Switch>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            render={(props) => <route.component {...props} />}
          />
        ))}
        <Redirect exact from="/species" to={urlFor.speciesSelector()} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
};

const Status = ({ code, children }: { code: number; children: ReactNode }) => {
  return (
    <Route
      render={({ staticContext }) => {
        if (staticContext) {
          (staticContext as any).status = code;
        }
        return children;
      }}
    />
  );
};

const NotFound = () => {
  return (
    <Status code={404}>
      <NotFoundErrorScreen />
    </Status>
  );
};

const mapDispatchToProps = {
  changeCurrentApp
};

export default connect(null, mapDispatchToProps)(App);
