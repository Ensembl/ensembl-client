import React, { ReactNode, useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import noop from 'lodash/noop';

import windowService from 'src/services/window-service';
import useOutsideClick from 'src/shared/hooks/useOutsideClick';
import { findOptimalPosition } from './pointer-box-helper';
import {
  getStylesForRenderingIntoBody
} from './pointer-box-inline-styles';

import {
  POINTER_WIDTH,
  POINTER_HEIGHT,
  POINTER_OFFSET
} from './pointer-box-constants';

import { Position } from './pointer-box-types';

import styles from './PointerBox.scss';

type InlineStyles = { [key: string]: string | number | undefined };
export type InlineStylesState = {
  bodyStyles: InlineStyles;
  pointerStyles: InlineStyles;
};

type PointerProps = {
  style: InlineStyles;
  pointerWidth: number;
  pointerHeight: number;
};

export type PointerBoxProps = {
  position: Position;
  anchor: HTMLElement;
  container?: HTMLElement | null; // area within which the box should try to position itself; defaults to window if null
  autoAdjust: boolean; // whether to adjust pointer box position so as not to extend beyond screen bounds
  renderInsideAnchor: boolean; // whether to render PointerBox inside the anchor (which should have position: relative to display it properly); renders to body if false
  pointerWidth: number;
  pointerHeight: number;
  pointerOffset: number;
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
    pointerStyles: {}
  });
  const pointerBoxRef = useRef<HTMLDivElement>(null);

  // useOutsideClick(tooltipElementRef, props.onClose);

  useEffect(() => {
    const pointerBoxElement = pointerBoxRef.current as HTMLDivElement;

    setInlineStyles(getStylesForRenderingIntoBody(props));

    if (props.autoAdjust) {
      adjustPosition(pointerBoxElement, props.anchor);
    }
  }, []);

  const adjustPosition = (
    pointerBox: HTMLDivElement,
    anchor: HTMLElement
  ) => {
    const pointerBoxBoundingRect = pointerBox.getBoundingClientRect();
    const rootBoundingRect = props.container
      ? props.container.getBoundingClientRect()
      : windowService.getDimensions();
    const anchorBoundingRect = anchor.getBoundingClientRect();

    const optimalPosition = findOptimalPosition({
      pointerBoxBoundingRect,
      anchorBoundingRect,
      rootBoundingRect,
      position: positionRef.current || props.position,
      pointerWidth: props.pointerWidth,
      pointerHeight: props.pointerHeight,
      pointerOffset: props.pointerOffset
    });

    if (optimalPosition !== positionRef.current) {
      positionRef.current = optimalPosition;
    }
    setInlineStyles(
      getStylesForRenderingIntoBody({
        ...props,
        position: optimalPosition
      })
    );
    setIsPositioning(false);
  };

  const hasInlineStyles = () => Object.keys(inlineStyles.bodyStyles).length;

  const className = classNames(
    styles.pointerBox,
    // positionRef.current || props.position,
    { [styles.tooltipInvisible]: isPositioning || !hasInlineStyles() }
  );

  const renderTarget = props.renderInsideAnchor ? props.anchor : document.body;

  return (
    ReactDOM.createPortal(
      <div
        className={className}
        ref={pointerBoxRef}
        style={inlineStyles.bodyStyles}
      >
        <Pointer pointerWidth={props.pointerWidth} pointerHeight={props.pointerWidth} style={inlineStyles.pointerStyles} />
        { props.children }
      </div>,
      renderTarget
    )
  );
};

PointerBox.defaultProps = {
  position: Position.BOTTOM_RIGHT,
  renderInsideAnchor: false,
  autoAdjust: false,
  pointerWidth: POINTER_WIDTH,
  pointerHeight: POINTER_HEIGHT,
  pointerOffset: POINTER_OFFSET,
  onMouseEnter: noop,
  onMouseLeave: noop,
  onOutsideClick: noop,
  onClose: noop
};

const Pointer = (props: PointerProps) => {
  const {
    pointerWidth,
    pointerHeight
  } = props;
  const pointerEndX = pointerWidth / 2;
  const style = {
    ...props.style,
    width: `${pointerWidth}px`,
    height: `${pointerHeight}px`
  }

  const polygonPoints = `0,${pointerHeight} ${pointerWidth},${pointerHeight} ${pointerEndX},0`;

  return (
    <svg
      className={styles.pointer}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={`0 0 ${pointerWidth} ${pointerHeight}`}
    >
      <polygon points={polygonPoints} />
    </svg>
  );
};

export { Position };
export default PointerBox;
