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

import { useRef, useEffect, type ForwardedRef } from 'react';

/**
 * Based on https://non-traditional.dev/how-to-use-the-forwarded-ref-in-react-1fb108f4e6af
 * and https://stackoverflow.com/questions/73015696/whats-the-difference-between-reacts-forwardedref-and-refobject
 *
 * React refs are a pain.
 */

const useForwardedRef = <T>(ref: ForwardedRef<T>) => {
  const innerRef = useRef<T>(null);

  useEffect(() => {
    if (!ref) return;

    if (typeof ref === 'function') {
      ref(innerRef.current);
    } else {
      ref.current = innerRef.current;
    }
  });

  return innerRef;
};

export default useForwardedRef;
