import React, {
  FunctionComponent,
  useEffect,
  useState,
  useCallback
} from 'react';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withCookies, ReactCookieProps, Cookies } from 'react-cookie';
import useResizeObserver from 'use-resize-observer';

import Header from './header/Header';
import Content from './content/Content';
import PrivacyBanner from './shared/privacy-banner/PrivacyBanner';

import { updateBreakpointWidth } from './globalActions';
import { getBreakpointWidth } from './globalSelectors';
import { RootState } from './rootReducer';
import { BreakpointWidth, getBreakpoint } from './globalConfig';

type StateProps = {
  breakpointWidth: BreakpointWidth;
};

type DispatchProps = {
  updateBreakpointWidth: (breakpointWidth: BreakpointWidth) => void;
};

type OwnProps = {};

type RootProps = StateProps & DispatchProps & ReactCookieProps & OwnProps;

const Root: FunctionComponent<RootProps> = (props: RootProps) => {
  const [ref, width] = useResizeObserver();
  const currentBreakpoint: BreakpointWidth = getBreakpoint(width);

  useEffect(() => {
    props.updateBreakpointWidth(currentBreakpoint);
  }, [props.updateBreakpointWidth, currentBreakpoint]);

  const [showPrivacyBanner, setShowPrivacyBanner] = useState(true);
  const cookies = props.cookies as Cookies;

  useEffect(() => {
    if (cookies.get('ENSEMBL_PRIVACY_POLICY') === 'true') {
      setShowPrivacyBanner(false);
    }
  }, [cookies]);

  const closeBanner = useCallback(() => {
    cookies.set('ENSEMBL_PRIVACY_POLICY', 'true');
    setShowPrivacyBanner(false);
  }, [cookies]);

  return (
    <React.Fragment>
      <div ref={ref as React.RefObject<HTMLDivElement>}>
        <Header />
        <Content />
        {showPrivacyBanner ? (
          <PrivacyBanner closeBanner={closeBanner} />
        ) : (
          false
        )}
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  breakpointWidth: getBreakpointWidth(state)
});

const mapDispatchToProps: DispatchProps = { updateBreakpointWidth };

export default withCookies(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Root)
);
