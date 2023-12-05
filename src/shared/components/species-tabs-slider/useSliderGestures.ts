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

import { useEffect, useRef, type RefObject } from 'react';

/**
 * The purpose of this hook is to enable interaction with the species tabs slider
 * using the mouse.
 * Specifically:
 * - user should be able to scroll through species tabs by pressing the mouse button
 *   and dragging the mouse left or right
 * - user should be able to scroll trough species tabs by using the mouse wheel
 */

const useSliderGestures = (ref: RefObject<Element>) => {
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const currentXRef = useRef(0);
  const isMouseDownRef = useRef(false);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (!ref.current) {
      return; // should not happen
    }

    ref.current.addEventListener('mousedown', onMouseDown, { capture: true });
    ref.current.addEventListener('wheel', handleWheel);
    ref.current.addEventListener('click', onClick, { capture: true }); // to control whether to pass the click to the species lozenge

    return () => {
      ref.current?.removeEventListener('mousedown', onMouseDown);
      ref.current?.removeEventListener('wheel', handleWheel);
      ref.current?.removeEventListener('click', onClick);
    };
  }, []);

  const onMouseDown = (event: Event) => {
    const target = event.currentTarget as HTMLElement;
    startScrollLeftRef.current = target.scrollLeft;
    const mouseEvent = event as MouseEvent;
    isMouseDownRef.current = true;
    startXRef.current = mouseEvent.clientX;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (event: Event) => {
    if (!isMouseDownRef.current) {
      return;
    }
    const mouseEvent = event as MouseEvent;
    currentXRef.current = mouseEvent.clientX;
    const deltaX = currentXRef.current - startXRef.current;

    if (Math.abs(deltaX) > 6 && !isDraggingRef.current) {
      isDraggingRef.current = true;
    }

    (ref.current as HTMLElement).scrollLeft =
      startScrollLeftRef.current - deltaX;
  };

  const onMouseUp = () => {
    isMouseDownRef.current = false;
    setTimeout(() => (isDraggingRef.current = false), 0);

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  const onClick = (event: Event) => {
    // If the user tries a "drag" gesture (mouse down followed by mouse move) while over a species lozenge,
    // this will be interpreted as a click on the lozenge, and the species will change.
    // This function prevents this from happening.
    if (isDraggingRef.current) {
      event.stopPropagation();
      isDraggingRef.current = false;
    }
  };

  // see https://greensock.com/forums/topic/32453-convert-vertical-scroll-to-horizontal-scroll-with-observer/
  // this may be a bad idea in general
  const handleWheel = (event: Event) => {
    const wheelEvent = event as WheelEvent;
    if (Math.abs(wheelEvent.deltaY) > Math.abs(wheelEvent.deltaX)) {
      handleWheelVertical(wheelEvent);
    }
  };

  const handleWheelVertical = (event: WheelEvent) => {
    (ref.current as HTMLElement).scrollLeft -= event.deltaY / 2;
  };
};

export default useSliderGestures;
