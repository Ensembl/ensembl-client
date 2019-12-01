import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { BreakpointWidth } from '../global/globalConfig';
import { updateBreakpointWidth } from '../global/globalActions';
import { observeMediaQueries } from 'src/global/windowSizeHelpers';

import Header from '../header/Header';
import Content from '../content/Content';
import PrivacyBanner from '../shared/components/privacy-banner/PrivacyBanner';
import privacyBannerService from '../shared/components/privacy-banner/privacy-banner-service';
import ErrorBoundary from 'src/shared/components/error-boundary/ErrorBoundary';
import { GeneralErrorScreen } from 'src/shared/components/error-screen';

import styles from './Root.scss';

type Props = {
  updateBreakpointWidth: (
    breakpointWidth: keyof typeof BreakpointWidth
  ) => void;
};

const defaultMediaQueries: Record<keyof typeof BreakpointWidth, string> = {
  PHONE: 'screen and (min-width: 599px)',
  TABLET: 'screen and (min-width: 600px) and (max-width: 899px)',
  LAPTOP: 'screen and (min-width: 900px) and (max-width: 1199px)',
  DESKTOP: 'screen and (min-width: 1200px) and (max-width: 1799px)',
  BIG_DESKTOP: 'screen and (min-width: 1800px)'
};

export const Root = (props: Props) => {
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(false);

  useEffect(() => {
    const subscription = observeMediaQueries(defaultMediaQueries, (match) => {
      props.updateBreakpointWidth(match as keyof typeof BreakpointWidth);
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
        <Header />
        <Content />
        {showPrivacyBanner && <PrivacyBanner closeBanner={closeBanner} />}
      </ErrorBoundary>
    </div>
  );
};

const mapDispatchToProps = { updateBreakpointWidth };

export default connect(null, mapDispatchToProps)(Root);
