import { useEffect, useState, useRef, MutableRefObject } from 'react';

/*
Normally, mutating ref.current will not cause React component
to re-render. So if a child component is to be rendered only when
a ref.current not null, we have to orchestrate a way to keep track
of ref.current changes. This logic can be abstracted into a custom hook.
*/

const useRefWithRerender = <T>(
  initialValue: T | null
): MutableRefObject<T | null> => {
  const [currentRef, setCurrentRef] = useState<T | null>(null);
  const ref = useRef<T>(initialValue);

  useEffect(() => {
    if (currentRef !== ref.current) {
      setCurrentRef(ref.current);
    }
  }, [ref.current]);

  return ref;
};

export default useRefWithRerender;
