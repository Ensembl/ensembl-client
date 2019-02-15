import React, { FunctionComponent, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import useResizeObserver from 'use-resize-observer';

import Header from './header/Header';
import Content from './content/Content';

import { updateBreakpointWidth } from './globalActions';
import { getBreakpointWidth } from './globalSelectors';
import { RootState } from './rootReducer';
import { BreakpointWidth } from './globalConfig';

type StateProps = {
  breakpointWidth: BreakpointWidth;
};

type DispatchProps = {
  updateBreakpointWidth: (breakpointWidth: BreakpointWidth) => void;
};

type OwnProps = {};

type RootProps = StateProps & DispatchProps & OwnProps;

const Root: FunctionComponent<RootProps> = (props: RootProps) => {
  const [ref, width] = useResizeObserver();
  const currentBreakpoint: BreakpointWidth = getBreakpoint(width);

  useEffect(() => {
    props.updateBreakpointWidth(currentBreakpoint);
  }, [props.updateBreakpointWidth, currentBreakpoint]);

  return (
    <BrowserRouter>
      <div ref={ref as React.RefObject<HTMLDivElement>}>
        <Header />
        <Content />
      </div>
    </BrowserRouter>
  );
};

function getBreakpoint(width: number): BreakpointWidth {
  if (width > BreakpointWidth.LARGE) {
    return BreakpointWidth.LARGE;
  } else if (width > BreakpointWidth.MEDIUM) {
    return BreakpointWidth.MEDIUM;
  } else {
    return BreakpointWidth.SMALL;
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  breakpointWidth: getBreakpointWidth(state)
});

const mapDispatchToProps: DispatchProps = { updateBreakpointWidth };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
