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

  let clickedInside = false;

  const handleClickOutside = (event: Event) => {
    if (clickedInside) {
      // Reset the clickedInside flag to false
      clickedInside = false;
      return;
    }

    for (const ref of refs) {
      if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
        callback();
        break;
      }
    }
  };

  // Notice that this useEffect does not take an empty array of dependencies.
  // This is because we want the useEffect to resubscribe at every component's update,
  // so that if the callback called in handleClickOutside function needs to access any changing values in the parent component,
  // those values always are current (to prevent bugs caused by stale closures)
  useEffect(() => {
    /*
      When a child node of the reference node is clicked and is removed from the DOM
      ref.current.contains(event.target) will return false.
      To deal with this, we are adding a click event listener to the ref to capture
      all the clicks to any element within the ref to update the clickedInside flag.
    */

    const onClickInside = () => {
      clickedInside = true;
    };

    const elements = refs.map((ref) => ref.current).filter(Boolean) as T[];

    elements.forEach((element) =>
      element.addEventListener('click', onClickInside)
    );

    document.addEventListener('click', handleClickOutside);

    return () => {
      elements.forEach((element) =>
        element.removeEventListener('click', onClickInside)
      );
      document.removeEventListener('click', handleClickOutside);
    };
  });
}
