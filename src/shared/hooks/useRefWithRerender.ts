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

import { useState, useRef, useCallback, MutableRefObject } from 'react';

/*
Normally, mutating ref.current will not cause React component
to re-render. So if a child component is to be rendered only when
a ref.current is not null, we have to orchestrate a way to keep track
of ref.current changes. This logic can be abstracted into a custom hook.
*/

const useRefWithRerender = <T>(
  initialValue: T | null
): [MutableRefObject<T | null>, (value: T | null) => void] => {
  const [, setRenderCount] = useState(0); // for force rerendering
  const ref = useRef<typeof initialValue>(initialValue);

  const callbackRef = useCallback((value: typeof initialValue) => {
    if (value !== ref.current) {
      ref.current = value;
      setRenderCount((prevCount) => prevCount + 1); // to force a re-render
    }
  }, []);

  return [ref, callbackRef];
};

export default useRefWithRerender;
