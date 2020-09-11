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
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { globalMediaQueries, BreakpointWidth } from '../global/globalConfig';
import { updateBreakpointWidth } from '../global/globalActions';
import { observeMediaQueries } from 'src/global/windowSizeHelpers';

import App from '../content/app/App';
import PrivacyBanner from '../shared/components/privacy-banner/PrivacyBanner';
import privacyBannerService from '../shared/components/privacy-banner/privacy-banner-service';
import ErrorBoundary from 'src/shared/components/error-boundary/ErrorBoundary';
import {
  GeneralErrorScreen,
  NotFoundErrorScreen
} from 'src/shared/components/error-screen';

import styles from './Root.scss';

type Props = {
  updateBreakpointWidth: (breakpointWidth: BreakpointWidth) => void;
};

export const Root = (props: Props) => {
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(false);
  const location = useLocation<{ is404: boolean } | undefined>();

  useEffect(() => {
    const subscription = observeMediaQueries(globalMediaQueries, (match) => {
      props.updateBreakpointWidth(
        BreakpointWidth[match as keyof typeof BreakpointWidth]
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

  if (location.state?.is404) {
    return <NotFoundErrorScreen />;
  }

  return (
    <div className={styles.root}>
      <ErrorBoundary fallbackComponent={GeneralErrorScreen}>
        <App />
        {showPrivacyBanner && <PrivacyBanner closeBanner={closeBanner} />}
      </ErrorBoundary>
    </div>
  );
};

const mapDispatchToProps = { updateBreakpointWidth };

export default connect(null, mapDispatchToProps)(Root);
