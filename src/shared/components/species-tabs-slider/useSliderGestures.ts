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

import { useCallback } from 'react';
import { fromEvent, switchMap, tap, takeUntil } from 'rxjs';

/**
 * The purpose of this hook is to enable interaction with the species tabs slider
 * using the mouse.
 * Specifically:
 * - user should be able to scroll through species tabs by pressing the mouse button
 *   and dragging the mouse left or right
 * - user should be able to scroll trough species tabs by using the mouse wheel
 */

const useSliderGestures = () => {
  const refCallback = useCallback((element: HTMLElement) => {
    const observable = createDragObservable(element);
    const subscription = observable.subscribe();
    // element.addEventListener('mousedown', onMouseDown, { capture: true });
    // element.addEventListener('click', onClick, { capture: true }); // to control whether to pass the click to the genome lozenge
    // elementRef.current = element;

    return () => {
      subscription.unsubscribe();
      // element.removeEventListener('mousedown', onMouseDown);
      // element.removeEventListener('click', onClick);
      // elementRef.current = null;
    };
  }, []);

  return {
    refCallback
  };
};

// const DRAG_THRESHOLD = 6; // consider a mouse event to be a drag gesture if the mouse moved this distance after mousedown

// FIXME: change mouse to pointer

const createDragObservable = (element: HTMLElement) => {
  const mouseDown$ = fromEvent<MouseEvent>(element, 'mousedown', {
    capture: true
  });

  const pipeline = mouseDown$.pipe(
    switchMap((downEvent) => {
      const startX = downEvent.clientX;
      const startScrollLeft = element.scrollLeft;

      const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove');
      const mouseUp$ = fromEvent<MouseEvent>(document, 'mouseup');

      return mouseMove$.pipe(
        tap((moveEvent) => {
          const deltaX = moveEvent.clientX - startX;
          element.scrollLeft = startScrollLeft - deltaX;
        }),
        takeUntil(mouseUp$)
      );
    })
  );

  return pipeline;
};

export default useSliderGestures;
