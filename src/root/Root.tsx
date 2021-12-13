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

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { globalMediaQueries, BreakpointWidth } from '../global/globalConfig';
import { updateBreakpointWidth } from 'src/global/globalSlice';
import { observeMediaQueries } from 'src/global/windowSizeHelpers';
import privacyBannerService from '../shared/components/privacy-banner/privacy-banner-service';

import useRestoredReduxState from './useRestoredReduxState';

import App from '../content/app/App';
import RootMeta from './RootMeta';
import PrivacyBanner from '../shared/components/privacy-banner/PrivacyBanner';
import ErrorBoundary from 'src/shared/components/error-boundary/ErrorBoundary';
import { GeneralErrorScreen } from 'src/shared/components/error-screen';

import styles from './Root.scss';

export const Root = () => {
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(false);
  const dispatch = useDispatch();

  useRestoredReduxState();

  useEffect(() => {
    const subscription = observeMediaQueries(globalMediaQueries, (match) => {
      dispatch(
        updateBreakpointWidth(
          BreakpointWidth[match as keyof typeof BreakpointWidth]
        )
      );
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setShowPrivacyBanner(privacyBannerService.shouldShowBanner());
  }, []);

  const closeBanner = () => {
    privacyBannerService.setPolicyVersion();
    setShowPrivacyBanner(false);
  };

  return (
    <div className={styles.root}>
      <ErrorBoundary fallbackComponent={GeneralErrorScreen}>
        <RootMeta />
        <App />
        {showPrivacyBanner && <PrivacyBanner closeBanner={closeBanner} />}
      </ErrorBoundary>
    </div>
  );
};

export default Root;
