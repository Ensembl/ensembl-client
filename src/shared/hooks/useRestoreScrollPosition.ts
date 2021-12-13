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

import { useEffect, useLayoutEffect, useRef } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { saveScrollPosition } from 'src/global/globalSlice';
import { getScrollPosition } from 'src/global/globalSelectors';

type RestoreScrollPositionProps = {
  referenceId: string;
  skip?: boolean;
};
export function useRestoreScrollPosition(props: RestoreScrollPositionProps) {
  const dispatch = useDispatch();

  const { referenceId, skip } = props;

  const scrollPosition = useSelector(getScrollPosition)[referenceId] || {
    scrollTop: 0,
    scrollLeft: 0
  };

  const targetElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targetElement = targetElementRef.current as HTMLDivElement;

    if (!skip && (scrollPosition.scrollTop || scrollPosition.scrollLeft)) {
      targetElement.scrollTop = scrollPosition.scrollTop;
      targetElement.scrollLeft = scrollPosition.scrollLeft;
    }
  }, [referenceId]);

  // using the useLayoutEffect hook here, because its cleanup function runs
  // synchronously, before the component is unmounted from the DOM
  useLayoutEffect(() => {
    return () => {
      const targetElement = targetElementRef.current as HTMLDivElement;
      dispatch(
        saveScrollPosition({
          [referenceId]: {
            scrollTop: targetElement.scrollTop,
            scrollLeft: targetElement.scrollLeft
          }
        })
      );
    };
  }, [referenceId]);

  return {
    targetElementRef
  };
}
