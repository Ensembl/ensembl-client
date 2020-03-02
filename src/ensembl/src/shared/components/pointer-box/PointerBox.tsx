import React, { ReactNode, useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import noop from 'lodash/noop';

import windowService from 'src/services/window-service';
import useOutsideClick from 'src/shared/hooks/useOutsideClick';

import { findOptimalPosition } from './pointer-box-helper';
import { Position } from './pointer-box-types';
import {
  POINTER_WIDTH,
  POINTER_HEIGHT,
  POINTER_OFFSET
} from './pointer-box-constants';

import styles from './PointerBox.scss';

type InlineStyles = { [key: string]: string | number | undefined };
type InlineStylesState = {
  bodyStyles: InlineStyles;
  tipStyles: InlineStyles;
};

type PointerBoxProps = {
  position: Position;
  anchor: HTMLElement;
  container?: HTMLElement | null; // area within which the box should try to position itself; defaults to window if null
  autoAdjust: boolean; // whether to adjust pointer box position so as not to extend beyond screen bounds
  renderInsideAnchor: boolean; // whether to render PointerBox inside the anchor (which should have position: relative to display it properly); renders to body if false
  children: ReactNode;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onOutsideClick: () => void;
};

const PointerBox = (props: PointerBoxProps) => {
  const [isPositioning, setIsPositioning] = useState(props.autoAdjust);
  const positionRef = useRef<Position | null>(null);
  const [inlineStyles, setInlineStyles] = useState<InlineStylesState>({
    bodyStyles: {},
    tipStyles: {}
  });
  const pointerBoxRef = useRef<HTMLDivElement>(null);

  // useOutsideClick(tooltipElementRef, props.onClose);

  useEffect(() => {
    const pointerBoxElement = pointerBoxRef.current as HTMLDivElement;

    setInlineStyles(getInlineStyles(props));

    if (props.autoAdjust) {
      adjustPosition(pointerBoxElement, props.anchor);
    }
  }, []);

  const renderTarget = props.renderInsideAnchor ? props.anchor : document.body;
  console.log(props.anchor.getBoundingClientRect())

  return (
    ReactDOM.createPortal(
      <div
        className={styles.pointerBox}
        ref={pointerBoxRef}
      >
      </div>,
      renderTarget
    )
  );
};

PointerBox.defaultProps = {
  position: Position.BOTTOM_RIGHT,
  renderInsideAnchor: false,
  autoAdjust: false,
  onMouseEnter: noop,
  onMouseLeave: noop,
  onOutsideClick: noop,
  onClose: noop
};

export default PointerBox;
