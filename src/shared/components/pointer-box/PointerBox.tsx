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
  position: Position;
  anchor: HTMLElement;
  container?: HTMLElement | null; // area within which the box should try to position itself; defaults to window if null
  autoAdjust: boolean; // whether to adjust pointer box position so as not to extend beyond screen bounds
  renderInsideAnchor: boolean; // whether to render PointerBox inside the anchor (which should have position: relative to display it properly); renders to body if false
  pointerWidth: number;
  pointerHeight: number;
  pointerOffset: number;
  classNames?: {
    box?: string;
    pointer?: string;
  };
  children: ReactNode;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onOutsideClick: () => void;
  onClose: () => void;
};

const handleClickInside = (e: React.MouseEvent | React.TouchEvent) => {
  e.preventDefault();
  e.stopPropagation(); // this works within React's event system
  e.nativeEvent.stopImmediatePropagation(); // also prevent propagation to DOM elements outside of React (e.g. to document)
};

const PointerBox = (props: PointerBoxProps) => {
  const [isPositioning, setIsPositioning] = useState(props.autoAdjust);
  const positionRef = useRef<Position | null>(props.position);
  const anchorRectRef = useRef<DOMRect | null>(null);
  const [inlineStyles, setInlineStyles] = useState<InlineStylesState>({
    boxStyles: {},
    pointerStyles: {}
  });
  const pointerBoxRef = useRef<HTMLDivElement>(null);

  useOutsideClick(pointerBoxRef, props.onOutsideClick);

  useEffect(() => {
    const pointerBoxElement = pointerBoxRef.current as HTMLDivElement;

    setInlineStyles(getInlineStyles(props));
    anchorRectRef.current = props.anchor.getBoundingClientRect();

    if (props.autoAdjust) {
      adjustPosition(pointerBoxElement, props.anchor);
    }
  }, []);

  const closeOnScroll = once(props.onClose);

  // from Stack Overflow: https://stackoverflow.com/questions/59792071/how-to-observe-dom-element-position-changes
  // (listen to all scroll events in the event capturing phase on the body and re-evaluate anchor position)
  useEffect(() => {
    if (!props.renderInsideAnchor) {
      document.addEventListener('scroll', closeOnScroll, true);
      return () => document.removeEventListener('scroll', closeOnScroll, true);
    }
  }, []);

  const getInlineStyles = (props: PointerBoxProps) => {
    if (props.renderInsideAnchor) {
      return getStylesForRenderingIntoAnchor(props);
    } else {
      return getStylesForRenderingIntoBody(props);
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
      position: positionRef.current || props.position,
      pointerWidth: props.pointerWidth,
      pointerHeight: props.pointerHeight,
      pointerOffset: props.pointerOffset
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
    props.position,
    { [styles.invisible]: isPositioning || !hasInlineStyles() }
  );

  const renderedPointerBox = (
    <div
      className={bodyClasses}
      ref={pointerBoxRef}
      style={inlineStyles.boxStyles}
      onClick={handleClickInside}
    >
      <Pointer
        className={props.classNames?.pointer}
        width={props.pointerWidth}
        height={props.pointerWidth}
        style={inlineStyles.pointerStyles}
      />
      {props.children}
    </div>
  );
  const renderTarget = props.renderInsideAnchor ? props.anchor : document.body;

  return ReactDOM.createPortal(renderedPointerBox, renderTarget);
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
