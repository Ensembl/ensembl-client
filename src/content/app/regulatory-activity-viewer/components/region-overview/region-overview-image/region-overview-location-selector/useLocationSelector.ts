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

import { useEffect, useReducer, useRef, type MutableRefObject } from 'react';

/**
 * TODO:
 * - consider how this selection will be reconciled with selection start and end
 *   that are passed from the parent (i.e. those would inevitably have to live in redux)
 * - until selection has been committed, allow dismissing it upon pressing the escape key
 */

/**
 * Actions:
 * - start selection
 * - update selection
 * - clear selection
 */

type State = {
  originX: number;
  latestX: number;
} | null;

type SelectionStartAction = {
  type: 'selection-start';
  payload: {
    originX: number;
    latestX: number;
  };
};

type SelectionUpdateAction = {
  type: 'selection-update';
  payload: {
    x: number;
  };
};

type SelectionClearAction = {
  type: 'selection-clear';
};

type Action =
  | SelectionStartAction
  | SelectionUpdateAction
  | SelectionClearAction;

const selectionStateReducer = (state: State, action: Action): State => {
  if (action.type === 'selection-start') {
    return {
      originX: action.payload.originX,
      latestX: action.payload.latestX
    };
  } else if (action.type === 'selection-update') {
    if (!state) {
      // this should not happen
      return null;
    }

    return {
      ...state,
      latestX: action.payload.x
    };
  } else {
    return null;
  }
};

const useLocationSelector = <T extends HTMLElement | SVGSVGElement>({
  ref,
  onSelectionCompleted
}: {
  ref: MutableRefObject<T | null>;
  onSelectionCompleted: (coords: { start: number; end: number }) => void;
}) => {
  const [state, dispatch] = useReducer(selectionStateReducer, null);
  const stateRef = useRef(state);
  const selectionOriginXRef = useRef<number | null>(null);
  const containerBoundingClientRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    if (ref.current) {
      containerBoundingClientRef.current = ref.current.getBoundingClientRect();

      ref.current.addEventListener('mousedown', onMouseDown as EventListener);
      // ref.current.addEventListener('touchstart', onSelectionStart as EventListener);
    }

    return () => {
      if (!ref.current) {
        return;
      }
      ref.current.removeEventListener(
        'mousedown',
        onMouseDown as EventListener
      );
      // ref.current.removeEventListener('touchstart', onSelectionStart as EventListener);
    };
  }, [ref.current]);

  // NOTE: this might become unnecessary when the new useEffectEvent hook is released
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const onMouseDown = (event: MouseEvent) => {
    const targetElement = event.target as HTMLElement | SVGSVGElement;
    if (
      !(
        targetElement === ref.current ||
        targetElement.dataset.name === 'inert-area'
      )
    ) {
      return;
    }
    selectionOriginXRef.current = event.offsetX;
    document.addEventListener('mousemove', detectSelectionStart);
  };

  const detectSelectionStart = (event: MouseEvent) => {
    const currentX = event.offsetX;
    const distance = Math.abs(
      currentX - (selectionOriginXRef.current as number)
    );

    // start the selection after a minimum distance from the origin has been reached
    if (distance > 5) {
      onSelectionStart(event);
      document.removeEventListener('mousemove', detectSelectionStart);
    }
  };

  const onSelectionStart = (event: MouseEvent | TouchEvent) => {
    if (event instanceof MouseEvent) {
      const startPosition = event.offsetX;
      dispatch({
        type: 'selection-start',
        payload: {
          originX: selectionOriginXRef.current as number,
          latestX: startPosition
        }
      });

      document.addEventListener('mousemove', onSelectionChange);
      document.addEventListener('mouseup', onSelectionEnd);
    }
  };

  const onSelectionChange = (event: MouseEvent | TouchEvent) => {
    if (event instanceof MouseEvent) {
      const newX = event.clientX - containerBoundingClientRef.current!.x;
      if (newX < 0 || newX > containerBoundingClientRef.current!.width) {
        return;
      }

      dispatch({
        type: 'selection-update',
        payload: { x: newX }
      });
    }
  };

  const onSelectionEnd = () => {
    if (stateRef.current) {
      onSelectionCompleted(stateToRectCoordinates(stateRef.current));
    }
    removeAllListeners();
  };

  const removeAllListeners = () => {
    document.removeEventListener('mousemove', onSelectionChange);
    document.removeEventListener('mousemove', detectSelectionStart);
  };

  return state ? stateToRectCoordinates(state) : null;
};

const stateToRectCoordinates = (state: NonNullable<State>) => {
  return {
    start: Math.min(state.originX, state.latestX),
    end: Math.max(state.originX, state.latestX)
  };
};

export default useLocationSelector;
