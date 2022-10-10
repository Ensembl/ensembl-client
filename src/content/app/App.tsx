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

import React, { useEffect, memo } from 'react';
import { useLocation, useRoutes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import routesConfig from 'src/routes/routesConfig';

import analyticsTracking from 'src/services/analytics-service';
import useGlobalAnalytics from 'src/global/hooks/useGlobalAnalytics';

import { changeCurrentApp } from 'src/global/globalSlice';

import Header from 'src/header/Header';

const AppContainer = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const appName: string = location.pathname.split('/').filter(Boolean)[0];

    dispatch(changeCurrentApp(appName));

    return function unsetApp() {
      dispatch(changeCurrentApp(''));
    };
  }, [location.pathname]);

  useLocationReporting();

  return <App />;
};

const useLocationReporting = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    const pathToReport = `${pathname}${search}${hash}`;
    analyticsTracking.trackPageView(pathToReport);
  }, [pathname]);
};

const App = memo(() => {
  const routes = useRoutes(routesConfig);
  const { globalAnalyticsRef } = useGlobalAnalytics();
  return (
    <div ref={globalAnalyticsRef}>
      <Header />
      {routes}
    </div>
  );
});

export default AppContainer;
