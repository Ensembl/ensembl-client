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

import { useEffect, useRef, useState } from 'react';

/**
 * An unpleasant effect about spinners is when they appear on the screen
 * and then immediately disappear, producing a flash of a spinner.
 * The purpose of this hook is to prevent this flashing effect by:
 * - Delaying the spinner for a brief while giving time content to appear quickly
 * - If the content hasn't appeared during this short period, then the spinner
 *   is displayed for at least a certain minimum duration, even if the content
 *   becomes available before this time runs out.
 */

export function usePendingUIFlags(
  isPending: boolean,
  {
    delayMs = 40,
    minimumVisibleMs = 400
  }: {
    delayMs?: number;
    minimumVisibleMs?: number;
  } = {}
) {
  const [shouldDisplayPendingUI, setShouldShowPendingUI] = useState(false);
  const shownAt = useRef<number | null>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (isPending) {
      // Don't show a spinner for fast operations.
      timeout = setTimeout(() => {
        shownAt.current = Date.now();
        setShouldShowPendingUI(true);
      }, delayMs);
    } else if (shownAt.current !== null) {
      // Once shown, keep it visible long enough to avoid a flash.
      const elapsed = Date.now() - shownAt.current;
      const remaining = Math.max(0, minimumVisibleMs - elapsed);

      timeout = setTimeout(() => {
        shownAt.current = null;
        setShouldShowPendingUI(false);
      }, remaining);
    }

    return () => clearTimeout(timeout);
  }, [isPending, delayMs, minimumVisibleMs]);

  return {
    shouldDisplayPendingUI,
    shouldBlockInteraction: isPending || shouldDisplayPendingUI
  };
}
