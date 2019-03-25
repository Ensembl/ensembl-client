import React, {
  FunctionComponent,
  useEffect,
  useState,
  useCallback
} from 'react';
import { connect } from 'react-redux';
import { withCookies, ReactCookieProps, Cookies } from 'react-cookie';
import useResizeObserver from 'use-resize-observer';

import Header from '../header/Header';
import Content from '../content/Content';
import PrivacyBanner from '../shared/privacy-banner/PrivacyBanner';

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

type RootProps = StateProps & DispatchProps & ReactCookieProps & OwnProps;

export const Root: FunctionComponent<RootProps> = (props: RootProps) => {
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
    <div ref={ref as React.RefObject<HTMLDivElement>} className={styles.root}>
      <Header />
      <Content />
      {showPrivacyBanner && <PrivacyBanner closeBanner={closeBanner} />}
    </div>
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
