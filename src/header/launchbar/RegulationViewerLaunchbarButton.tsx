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

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { isProductionEnvironment } from 'src/shared/helpers/environment';

import LaunchbarButton from './LaunchbarButton';

const activityViewerRootPath = urlFor.regulatoryActivityViewer();

const RegulatoryActivityViewerLaunchbarButton = () => {
  const location = useLocation();
  const lastVisitedPath = useLastVisitedPath();

  if (isProductionEnvironment()) {
    return null;
  }

  const isActive = location.pathname.startsWith(activityViewerRootPath);

  return (
    <LaunchbarButton
      path={lastVisitedPath}
      description="Regulatory activity viewer"
      icon={() => (
        <div
          style={{
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            lineHeight: 1,
            color: 'white'
          }}
        >
          R
        </div>
      )}
      isActive={isActive}
      enabled={true}
    />
  );
};

const useLastVisitedPath = () => {
  const location = useLocation();
  const [lastVisitedPath, setLastVisitedPath] = useState(
    activityViewerRootPath
  );

  useEffect(() => {
    if (location.pathname.startsWith(activityViewerRootPath)) {
      const path = location.pathname + location.search;
      setLastVisitedPath(path);
    }
  }, [[location]]);

  return lastVisitedPath;
};

export default RegulatoryActivityViewerLaunchbarButton;
