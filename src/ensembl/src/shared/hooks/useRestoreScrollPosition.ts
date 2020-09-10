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

import { useLayoutEffect, useRef } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { setScrollPosition } from 'src/global/globalActions';
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

  useLayoutEffect(() => {
    const targetElement = targetElementRef.current as HTMLDivElement;

    // TODO: Need to find out why it doesn't work without the setTimeout
    setTimeout(() => {
      if (!skip && (scrollPosition.scrollTop || scrollPosition.scrollLeft)) {
        targetElement.scrollTop = scrollPosition.scrollTop;
        targetElement.scrollLeft = scrollPosition.scrollLeft;
      }
    }, 1);

    return () => {
      dispatch(
        setScrollPosition({
          [referenceId]: {
            scrollTop: targetElement.scrollTop,
            scrollLeft: targetElement.scrollLeft
          }
        })
      );
    };
  }, [scrollPosition, skip]);

  return {
    targetElementRef
  };
}
