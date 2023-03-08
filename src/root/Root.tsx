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

import React, { Suspense, useEffect, useState } from 'react';

import { useAppDispatch } from 'src/store';

import { globalMediaQueries, BreakpointWidth } from '../global/globalConfig';
import { updateBreakpointWidth } from 'src/global/globalSlice';
import { restoreBlastSubmissions } from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';
import { observeMediaQueries } from 'src/global/windowSizeHelpers';
import privacyBannerService from '../shared/components/privacy-banner/privacy-banner-service';

import useRestoredReduxState from './useRestoredReduxState';
import useDisabledDocumentDragover from './useDisabledDocumentDragover';

import App from '../content/app/App';
import Meta from 'src/content/html/Meta';
import ThirdPartyScripts from 'src/content/html/ThirdParty';
import PrivacyBanner from '../shared/components/privacy-banner/PrivacyBanner';
import ErrorBoundary from 'src/shared/components/error-boundary/ErrorBoundary';
import { GeneralErrorScreen } from 'src/shared/components/error-screen';
import { setScrollbarWidth } from 'src/shared/helpers/scrollbarWidth';

import styles from './Root.scss';

export const Root = () => {
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(false);
  const dispatch = useAppDispatch();

  useRestoredReduxState();
  useDisabledDocumentDragover();

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
    dispatch(restoreBlastSubmissions());
    setScrollbarWidth();
  }, []);

  const closeBanner = () => {
    privacyBannerService.setPolicyVersion();
    setShowPrivacyBanner(false);
  };

  return (
    <div className={styles.root}>
      <ErrorBoundary fallbackComponent={GeneralErrorScreen}>
        <Suspense>
          <Meta />
          <App />
          {showPrivacyBanner && <PrivacyBanner closeBanner={closeBanner} />}
          <ThirdPartyScripts />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Root;
