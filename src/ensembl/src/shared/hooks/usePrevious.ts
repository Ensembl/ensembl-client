// From React docs, section Hook FAQ, How to get the previous props or state
// (https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state)

import { useRef, useEffect } from 'react';

export default function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
