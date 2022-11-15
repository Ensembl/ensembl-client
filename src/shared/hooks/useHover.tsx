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

import { useRef, useState, useEffect } from 'react';

type UseHoverType<T extends HTMLElement> = [React.RefObject<T>, boolean];

export default function useHover<T extends HTMLElement>(): UseHoverType<T> {
  const [isHovering, setIsHovering] = useState(false);
  let isTouched = false;

  const ref = useRef<T>(null);

  const handleMouseEnter = () => {
    if (!isTouched) {
      !isHovering && setIsHovering(true);
    }
    isTouched = false;
  };
  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleTouch = () => {
    isTouched = true;
  };

  useEffect(() => {
    const element = ref.current;

    element?.addEventListener('mouseenter', handleMouseEnter);
    element?.addEventListener('mouseleave', handleMouseLeave);
    element?.addEventListener('click', handleMouseLeave);
    element?.addEventListener('touchstart', handleTouch, { passive: true });

    // cancel hover state if user switches to a different tab
    document.addEventListener('visibilitychange', handleMouseLeave);

    return () => {
      element?.removeEventListener('mouseenter', handleMouseEnter);
      element?.removeEventListener('mouseleave', handleMouseLeave);
      element?.removeEventListener('click', handleMouseLeave);
      element?.removeEventListener('touchstart', handleTouch);

      document.removeEventListener('visibilitychange', handleMouseLeave);
    };
  }, [ref.current]);

  return [ref, isHovering];
}
