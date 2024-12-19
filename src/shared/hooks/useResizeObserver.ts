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

// modified from https://github.com/ZeeCoder/use-resize-observer/blob/master/src/index.js

import { useEffect, useState, useRef, RefObject } from 'react';
import windowService from 'src/services/window-service';

type Params<T> = {
  ref?: RefObject<T> | null;
};

export default function <T extends HTMLElement | null>(params: Params<T> = {}) {
  const defaultRef = useRef(null);
  const ref = params.ref || defaultRef;
  const [size, setSize] = useState({ width: 0, height: 0 });

  const sizeRef = useRef({
    width: 0,
    height: 0
  });

  useEffect(() => {
    if (ref && !ref.current) {
      return;
    }

    const element = ref.current;

    if (!element) {
      return;
    }

    const ResizeObserver = windowService.getResizeObserver();
    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries)) {
        return;
      }

      // We are only observing one element
      const entry = entries[0];

      if (!entry) {
        return;
      }

      // `Math.round` is in line with how CSS resolves sub-pixel values
      const newWidth = Math.round(entry.contentRect.width);
      const newHeight = Math.round(entry.contentRect.height);
      if (
        sizeRef.current.width !== newWidth ||
        sizeRef.current.height !== newHeight
      ) {
        sizeRef.current.width = newWidth;
        sizeRef.current.height = newHeight;
        setSize({ width: newWidth, height: newHeight });
      }
    });

    resizeObserver.observe(element);

    return () => resizeObserver.unobserve(element);
  }, [ref?.current]);

  return { ref, ...size };
}
