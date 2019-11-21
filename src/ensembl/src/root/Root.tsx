import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';

import useResizeObserver from 'src/shared/hooks/useResizeObserver';

import { BreakpointWidth } from '../global/globalConfig';
import { updateBreakpointWidth } from '../global/globalActions';

import Header from '../header/Header';
import Content from '../content/Content';
import PrivacyBanner from '../shared/components/privacy-banner/PrivacyBanner';
import privacyBannerService from '../shared/components/privacy-banner/privacy-banner-service';
import ErrorBoundary from 'src/shared/components/error-boundary/ErrorBoundary';
import { GeneralErrorScreen } from 'src/shared/components/error-screen';

import styles from './Root.scss';

type Props = {
  updateBreakpointWidth: (breakpointWidth: BreakpointWidth) => void;
};

export const Root = (props: Props) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { width } = useResizeObserver<HTMLDivElement>({ ref: elementRef });
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(false);

  useEffect(() => {
    props.updateBreakpointWidth(width);
  }, [width]);

  useEffect(() => {
    setShowPrivacyBanner(privacyBannerService.shouldShowBanner());
  }, []);

  const closeBanner = () => {
    privacyBannerService.setPolicyVersion();
    setShowPrivacyBanner(false);
  };

  return (
    <div ref={elementRef} className={styles.root}>
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
