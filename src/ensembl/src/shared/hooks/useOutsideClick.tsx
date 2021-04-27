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

import { useEffect } from 'react';

export default function useOutsideClick<T extends HTMLElement>(
  refOrRefs: React.RefObject<T> | React.RefObject<T>[],
  callback: () => void
) {
  const refs = Array.isArray(refOrRefs) ? refOrRefs : [refOrRefs];

  const handleClickOutside = (event: Event) => {
    let isClickInside = false;

    for (const ref of refs) {
      if (ref.current?.contains(event.target as HTMLElement)) {
        isClickInside = true;
      }
    }

    if (!isClickInside) {
      callback();
    }
  };

  // Notice that this useEffect does not take an empty array of dependencies.
  // This is because we want the useEffect to resubscribe at every component's update,
  // so that if the callback called in handleClickOutside function needs to access any changing values in the parent component,
  // those values always are current (to prevent bugs caused by stale closures)
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, { capture: true });

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });
}
