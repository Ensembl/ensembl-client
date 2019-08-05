import React, { FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import useResizeObserver from 'use-resize-observer';

import Header from '../header/Header';
import Content from '../content/Content';
import PrivacyBanner from '../shared/privacy-banner/PrivacyBanner';
import privacyBannerService from '../shared/privacy-banner/privacy-banner-service';
import ErrorBoundary from 'src/shared/error-boundary/ErrorBoundary';
import { GeneralErrorScreen } from 'src/shared/error-screen';

import { updateBreakpointWidth } from '../global/globalActions';
import { getBreakpointWidth } from '../global/globalSelectors';
import { RootState } from '../store';
import { BreakpointWidth } from '../global/globalConfig';
import { getBreakpoint } from '../global/globalHelper';

import styles from './Root.scss';

type StateProps = {
  breakpointWidth: BreakpointWidth;
};

type DispatchProps = {
  updateBreakpointWidth: (breakpointWidth: BreakpointWidth) => void;
};

type OwnProps = {};

type RootProps = StateProps & DispatchProps & OwnProps;

export const Root: FunctionComponent<RootProps> = (props: RootProps) => {
  const [ref, width] = useResizeObserver();
  const currentBreakpoint: BreakpointWidth = getBreakpoint(width);
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(false);

  useEffect(() => {
    props.updateBreakpointWidth(currentBreakpoint);
  }, [props.updateBreakpointWidth, currentBreakpoint]);

  useEffect(() => {
    setShowPrivacyBanner(privacyBannerService.shouldShowBanner());
  }, []);

  const closeBanner = () => {
    privacyBannerService.setPolicyVersion();
    setShowPrivacyBanner(false);
  };

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={styles.root}>
      <ErrorBoundary fallbackComponent={GeneralErrorScreen}>
        <Header />
        <Content />
        {showPrivacyBanner && <PrivacyBanner closeBanner={closeBanner} />}
      </ErrorBoundary>
    </div>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  breakpointWidth: getBreakpointWidth(state)
});

const mapDispatchToProps: DispatchProps = { updateBreakpointWidth };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
