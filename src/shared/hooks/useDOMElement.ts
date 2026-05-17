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

import { useState, useCallback } from 'react';

/**
 * This is a replacement for the useRefWithRerender hook,
 * whose downside is that it returns a ref; and refs aren't supposed
 * to be read from during render.
 *
 * This hook, instead, stores the referenced DOM element in the state,
 * and returns that state.
 * Its purpose is to abstract away the repetitive logic
 * of assigning the element received via a ref callback to the state.
 */

const useDOMElement = <T>(): [T | null, (element: T) => () => void] => {
  const [element, setElement] = useState<T | null>(null);

  const refCallback = useCallback((element: T) => {
    setElement(element);
    return () => {
      setElement(null);
    };
  }, []);

  return [element, refCallback];
};

export default useDOMElement;
