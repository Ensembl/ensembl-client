// As suggested by Kent C. Dodds in the Simplify React Apps with React Hooks course

import { useRef, useEffect } from 'react';
import isEqual from 'lodash/isEqual';

import usePrevious from './usePrevious';

export default function useDeepCompareEffect<T>(callback: any, input: T) {
  // @ts-ignore
  const cleanupRef = useRef();
  const previousInput = usePrevious(input);
  useEffect(() => {
    if (!isEqual(input, previousInput)) {
      cleanupRef.current = callback();
    }
    return cleanupRef.current;
  });
}
