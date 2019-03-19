// From React docs, section Hook FAQ, How to get the previous props or state
// (https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state)

import { useRef, useEffect } from 'react';

export default function usePrevious<T>(value: T) {
  // @ts-ignore
  const ref = useRef<T>();
  useEffect(() => {
    // @ts-ignore (broken types; see issue https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31065)
    ref.current = value;
  });
  return ref.current;
}
