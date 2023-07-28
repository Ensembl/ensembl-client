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

import React, { ReactNode, useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import once from 'lodash/once';
import noop from 'lodash/noop';

import windowService from 'src/services/window-service';
import useOutsideClick from 'src/shared/hooks/useOutsideClick';
import { findOptimalPosition } from './pointer-box-helper';
import {
  getStylesForRenderingIntoBody,
  getStylesForRenderingIntoAnchor
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
  boxStyles: InlineStyles;
  pointerStyles: InlineStyles;
};

type PointerProps = {
  style: InlineStyles;
  className?: string;
  width: number;
  height: number;
};

export type PointerBoxProps = {
  position?: Position;
  anchor: HTMLElement;
  container?: HTMLElement | null; // area within which the box should try to position itself; defaults to window if null
  autoAdjust?: boolean; // whether to adjust pointer box position so as not to extend beyond screen bounds
  renderInsideAnchor?: boolean; // whether to render PointerBox inside the anchor (which should have position: relative to display it properly); renders to body if false
  pointerWidth?: number;
  pointerHeight?: number;
  pointerOffset?: number;
  classNames?: {
    box?: string;
    pointer?: string;
  };
  children: ReactNode;
  onOutsideClick?: (() => void) | ((event: Event) => void);
  onClose?: () => void;
};

const defaultProps = {
  position: Position.BOTTOM_RIGHT,
  renderInsideAnchor: false,
  autoAdjust: false,
  pointerWidth: POINTER_WIDTH,
  pointerHeight: POINTER_HEIGHT,
  pointerOffset: POINTER_OFFSET,
  onOutsideClick: noop,
  onClose: noop
};

const PointerBox = (props: PointerBoxProps) => {
  const {
    position: positionFromProps = defaultProps.position,
    renderInsideAnchor = defaultProps.renderInsideAnchor,
    autoAdjust = defaultProps.autoAdjust,
    pointerWidth: pointerWidthFromProps = defaultProps.pointerWidth,
    pointerHeight: pointerHeightFromProps = defaultProps.pointerHeight,
    pointerOffset: pointerOffsetFromProps = defaultProps.pointerOffset,
    onOutsideClick = defaultProps.onOutsideClick,
    onClose = defaultProps.onClose
  } = props;
  const [isPositioning, setIsPositioning] = useState(autoAdjust);
  const positionRef = useRef<Position | null>(positionFromProps);
  const anchorRectRef = useRef<DOMRect | null>(null);
  const [inlineStyles, setInlineStyles] = useState<InlineStylesState>({
    boxStyles: {},
    pointerStyles: {}
  });
  const pointerBoxRef = useRef<HTMLDivElement>(null);

  useOutsideClick(pointerBoxRef, onOutsideClick);

  useEffect(() => {
    const pointerBoxElement = pointerBoxRef.current as HTMLDivElement;

    setInlineStyles(getInlineStyles(props));
    anchorRectRef.current = props.anchor.getBoundingClientRect();

    if (autoAdjust) {
      adjustPosition(pointerBoxElement, props.anchor);
    }
  }, []);

  const closeOnScroll = once(onClose);

  // from Stack Overflow: https://stackoverflow.com/questions/59792071/how-to-observe-dom-element-position-changes
  // (listen to all scroll events in the event capturing phase on the body and re-evaluate anchor position)
  useEffect(() => {
    if (!renderInsideAnchor) {
      document.addEventListener('scroll', closeOnScroll, true);
      return () => document.removeEventListener('scroll', closeOnScroll, true);
    }
  }, []);

  const getInlineStyles = (props: PointerBoxProps) => {
    const params = { ...defaultProps, ...props };
    if (renderInsideAnchor) {
      return getStylesForRenderingIntoAnchor(params);
    } else {
      return getStylesForRenderingIntoBody(params);
    }
  };

  const adjustPosition = (pointerBox: HTMLDivElement, anchor: HTMLElement) => {
    const pointerBoxBoundingRect = pointerBox.getBoundingClientRect();
    const rootBoundingRect = props.container
      ? props.container.getBoundingClientRect()
      : windowService.getDimensions();
    const anchorBoundingRect = anchor.getBoundingClientRect();

    const optimalPosition = findOptimalPosition({
      pointerBoxBoundingRect,
      anchorBoundingRect,
      rootBoundingRect,
      position: positionRef.current || positionFromProps,
      pointerWidth: pointerWidthFromProps,
      pointerHeight: pointerHeightFromProps,
      pointerOffset: pointerOffsetFromProps
    });

    if (optimalPosition !== positionRef.current) {
      positionRef.current = optimalPosition;
    }
    setInlineStyles(
      getInlineStyles({
        ...props,
        position: optimalPosition
      })
    );
    setIsPositioning(false);
  };

  const hasInlineStyles = () => Object.keys(inlineStyles.boxStyles).length;

  const bodyClasses = classNames(
    styles.pointerBox,
    props.classNames?.box,
    positionFromProps,
    { [styles.invisible]: isPositioning || !hasInlineStyles() }
  );

  const renderedPointerBox = (
    <div
      className={bodyClasses}
      ref={pointerBoxRef}
      style={inlineStyles.boxStyles}
    >
      <Pointer
        className={props.classNames?.pointer}
        width={pointerWidthFromProps}
        height={pointerHeightFromProps}
        style={inlineStyles.pointerStyles}
      />
      {props.children}
    </div>
  );
  const renderTarget = renderInsideAnchor ? props.anchor : document.body;

  return ReactDOM.createPortal(renderedPointerBox, renderTarget);
};

const Pointer = (props: PointerProps) => {
  const { width: pointerWidth, height: pointerHeight } = props;
  const pointerEndX = pointerWidth / 2;

  const style = {
    ...props.style,
    width: `${pointerWidth}px`,
    height: `${pointerHeight}px`
  };

  const pointerClasses = classNames(styles.pointer, props.className);
  const polygonPoints = `0,${pointerHeight} ${pointerWidth},${pointerHeight} ${pointerEndX},0`;

  return (
    <svg
      className={pointerClasses}
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
