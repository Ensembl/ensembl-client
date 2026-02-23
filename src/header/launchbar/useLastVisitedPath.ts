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

import { useState } from 'react';
import { useLocation } from 'react-router';

/**
 * Store the latest visited subpath of the rootPath
 * in the local state, so that when the user clicks a launchbar button,
 * he is taken to the last page within that "app" that he visited.
 * Notice that this, of course, does not survive a browser refresh.
 */
const useLastVisitedPath = ({ rootPath }: { rootPath: string }) => {
  const location = useLocation();
  const [lastVisitedPath, setLastVisitedPath] = useState(rootPath);
  const [prevPath, setPrevPath] = useState(lastVisitedPath);

  if (location.pathname.startsWith(rootPath)) {
    const path = location.pathname + location.search;
    if (path !== prevPath) {
      setPrevPath(lastVisitedPath);
      setLastVisitedPath(path);
    }
  }

  return lastVisitedPath;
};

export default useLastVisitedPath;
