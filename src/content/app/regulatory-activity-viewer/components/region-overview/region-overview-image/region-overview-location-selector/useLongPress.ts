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

import { useEffect, useRef, type MutableRefObject } from 'react';

/**
 * This should probably be a shared reusable hook
 */

const DELAY = 1000;

const useLongPress = <T extends HTMLElement | SVGSVGElement>({
  ref,
  callback
}: {
  ref: MutableRefObject<T | null>;
  callback: (event: MouseEvent | TouchEvent) => void;
}) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.addEventListener('mousedown', onPressStart as EventListener);
    ref.current.addEventListener('touchstart', onPressStart as EventListener);

    ref.current.addEventListener('mouseup', onPressEnd);
    ref.current.addEventListener('touchend', onPressEnd);

    return () => {
      if (!ref.current) {
        return;
      }

      ref.current.removeEventListener(
        'mousedown',
        onPressStart as EventListener
      );
      ref.current.removeEventListener(
        'touchstart',
        onPressStart as EventListener
      );

      ref.current.removeEventListener('mouseup', onPressEnd);
      ref.current.removeEventListener('touchend', onPressEnd);
    };
  }, [ref.current]);

  const onPressStart = (event: MouseEvent | TouchEvent) => {
    timeoutRef.current = setTimeout(() => {
      clearExistingTimeout();
      callback(event);
    }, DELAY);
  };

  const onPressEnd = () => {
    clearExistingTimeout();
  };

  const clearExistingTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = null;
  };
};

export default useLongPress;
