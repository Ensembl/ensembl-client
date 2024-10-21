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

import useLongPress from './useLongPress';

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
  start: number;
  end: number;
} | null;

type SelectionStartAction = {
  type: 'selection-start';
  position: {
    x: number;
  };
};

type SelectionUpdateAction = {
  type: 'selection-update';
  position: {
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

const selectionStateReducer = (state: State, action: Action) => {
  if (action.type === 'selection-start') {
    return {
      start: action.position.x,
      end: action.position.x
    };
  } else if (action.type === 'selection-update') {
    if (!state) {
      // this should not happen
      return null;
    }
    const xMin = Math.min(state.start, action.position.x);
    const xMax = Math.max(state.start, action.position.x);

    return {
      start: xMin,
      end: xMax
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
  onSelectionCompleted: (state: NonNullable<State>) => void;
}) => {
  const [state, dispatch] = useReducer(selectionStateReducer, null);
  const stateRef = useRef(state);

  const containerBoundingClientRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    if (ref.current) {
      containerBoundingClientRef.current = ref.current.getBoundingClientRect();

      ref.current.addEventListener(
        'mousedown',
        onSelectionStart as EventListener
      );
      // ref.current.addEventListener('touchstart', onSelectionStart as EventListener);
    }

    return () => {
      if (!ref.current) {
        return;
      }
      ref.current.removeEventListener(
        'mousedown',
        onSelectionStart as EventListener
      );
      // ref.current.removeEventListener('touchstart', onSelectionStart as EventListener);
    };
  }, [ref.current]);

  // NOTE: this might become unnecessary when the new useEffectEvent hook is released
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const onSelectionStart = (event: MouseEvent | TouchEvent) => {
    if (event instanceof MouseEvent) {
      const startPosition = event.offsetX;
      dispatch({
        type: 'selection-start',
        position: { x: startPosition }
      });

      document.addEventListener('mousemove', onSelectionChange);
      document.addEventListener('mouseup', onSelectionEnd);
    }
  };

  useLongPress({ ref, callback: onSelectionStart });

  const onSelectionChange = (event: MouseEvent | TouchEvent) => {
    if (event instanceof MouseEvent) {
      dispatch({
        type: 'selection-update',
        position: { x: event.offsetX }
      });
    }
  };

  const onSelectionEnd = () => {
    if (stateRef.current) {
      onSelectionCompleted(stateRef.current);
    }
    removeAllListeners();
  };

  const removeAllListeners = () => {
    document.removeEventListener('mousemove', onSelectionChange);
  };

  return state;
};

export default useLocationSelector;
