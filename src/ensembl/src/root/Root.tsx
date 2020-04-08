import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { globalMediaQueries, BreakpointWidth } from '../global/globalConfig';
import { updateBreakpointWidth } from '../global/globalActions';
import { observeMediaQueries } from 'src/global/windowSizeHelpers';

import Header from '../header/Header';
import Content from '../content/Content';
import PrivacyBanner from '../shared/components/privacy-banner/PrivacyBanner';
import privacyBannerService from '../shared/components/privacy-banner/privacy-banner-service';
import ErrorBoundary from 'src/shared/components/error-boundary/ErrorBoundary';
import { GeneralErrorScreen } from 'src/shared/components/error-screen';
import PopupHelp from '../content/app/help-and-docs/popup-help/PopupHelp';
import styles from './Root.scss';

type Props = {
  updateBreakpointWidth: (breakpointWidth: BreakpointWidth) => void;
};

export const Root = (props: Props) => {
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(false);

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

  return (
    <div className={styles.root}>
      <ErrorBoundary fallbackComponent={GeneralErrorScreen}>
        <Header />
        <Content />
        <PopupHelp />

        {showPrivacyBanner && <PrivacyBanner closeBanner={closeBanner} />}
      </ErrorBoundary>
    </div>
  );
};

const mapDispatchToProps = { updateBreakpointWidth };

export default connect(null, mapDispatchToProps)(Root);
