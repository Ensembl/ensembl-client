// modified from https://github.com/ZeeCoder/use-resize-observer/blob/master/src/index.js

import { useEffect, useState, useRef, useMemo, RefObject } from 'react';

type Params<T> = {
  ref?: RefObject<T> | null;
};

export default function<T extends HTMLElement>(params: Params<T> = {}) {
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
  }, [ref]);

  return useMemo(() => ({ ref, ...size }), [
    ref,
    size ? size.width : null,
    size ? size.height : null
  ]);
}
